import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config'

import { ReactComponent as IconMinus } from '../assets/icons/icon-minus.svg'
import { ReactComponent as IconEdit } from '../assets/icons/icon-edit.svg'
import { ReactComponent as IconClose } from '../assets/icons/icon-close.svg'
import { ReactComponent as IconCheck } from '../assets/icons/icon-check.svg'
import Alert from './../components/Alert'
import NavAnchor from './../components/NavAnchor'
import CardEmpty from '../components/CardEmpty'
import currenciesArr from '../data/currencies.json'
import noEarningsGif from '../assets/img/gif-no-earnings.gif'
import noExpensesGif from '../assets/img/gif-no-expenses.gif'
import SettingsCategories from '../components/SettingsCategories'

export default function Settings() {
	const [existingBudget, setExistingBudget] = useState([])
	const [dataLoaded, setDataLoaded] = useState(false)

	const navLinksArr = [
		{ title: 'General', to: '#general', end: true },
		{ title: 'Earnings', to: '#earnings', end: true },
		{ title: 'Expenses', to: '#expenses', end: true },
		{ title: 'Categories', to: '#categories', end: true },
	]

	// GENERAL

	const calculateTotal = (arr = []) => {
		if (!Array.isArray(arr)) {
			return '0.00'
		}
		const sum = arr.reduce((acc, curr) => {
			if (curr && typeof curr.amount === 'number') {
				return acc + curr.amount
			} else {
				return acc
			}
		}, 0)
		return sum.toFixed(2)
	}

	const handleChange = (changeFunction) => (event) => {
		changeFunction(event.target.value)
	}

	// ---------------------------------------------------------------------------------------------------

	// CURRENCY

	const indexDefaultCurrency = currenciesArr.findIndex((elem) => elem.symbol === '€')
	const [currency, setCurrency] = useState(() => existingBudget.currency || currenciesArr[indexDefaultCurrency])

	const handleUpdateCurrency = async (event) => {
		event.preventDefault()
		const gotToken = localStorage.getItem('authToken')
		const updatedCurrency = currenciesArr.find((elem) => elem.code === event.target.value)
		setCurrency(updatedCurrency)

		try {
			const response = await axios.post(
				`${API_URL}/budget/currency/update`,
				{ currency: updatedCurrency },
				{ headers: { authorization: `Bearer ${gotToken}` } }
			)
			setCurrency(response.data.currency)
		} catch (err) {
			console.log('Error while submitting new currency', err)
			setCurrency(currency)
		}
	}

	// ---------------------------------------------------------------------------------------------------

	// EARNINGS

	const [earningsArr, setEarningsArr] = useState(existingBudget.earnings || [])
	const [earningsTotal, setEarningsTotal] = useState(calculateTotal(earningsArr))

	// EDIT EARNING

	const [editEarningId, setEditEarningId] = useState('')
	const [editEarningName, setEditEarningName] = useState('')
	const [editEarningAmount, setEditEarningAmount] = useState('')

	const handleEditEarning = (id, name, amount) => {
		setEditEarningId(id)
		setEditEarningName(name)
		setEditEarningAmount(amount)
	}

	const handleCancelEditEarning = () => {
		setEditEarningId('')
		setEditEarningName('')
		setEditEarningAmount('')
	}

	// UPDATE EARNING

	const handleUpdateEarning = async (event) => {
		event.preventDefault()
		const gotToken = localStorage.getItem('authToken')
		const updatedEarning = { _id: editEarningId, name: editEarningName, amount: editEarningAmount }
		const itemIndex = earningsArr.findIndex((elem) => elem._id === updatedEarning._id)
		const newArr = [...earningsArr]
		newArr[itemIndex] = updatedEarning

		setEarningsArr(newArr)
		setEditEarningId('')
		setEditEarningName('')
		setEditEarningAmount('')

		try {
			const response = await axios.post(
				`${API_URL}/budget/earnings/update`,
				{ updatedEarning },
				{ headers: { authorization: `Bearer ${gotToken}` } }
			)
			setEarningsArr(response.data.earnings)
		} catch (err) {
			console.log('Error while updating earning:', err)
			setEditEarningId(editEarningId)
			setEditEarningName(editEarningName)
			setEditEarningAmount(editEarningAmount)
			setEarningsArr(earningsArr)
		}
	}

	// DELETE EARNING

	const handleDeleteEarning = async (event) => {
		event.preventDefault()
		const gotToken = localStorage.getItem('authToken')
		const earningId = editEarningId
		const newArr = earningsArr.filter((elem) => {
			return elem._id !== editEarningId ? elem : null
		})
		setEarningsArr(newArr)
		setEditEarningId('')
		setEditEarningName('')
		setEditEarningAmount('')
		try {
			const response = await axios.delete(`${API_URL}/budget/earnings/delete/${earningId}`, {
				headers: { authorization: `Bearer ${gotToken}` },
			})
			setEarningsArr(response.data.earnings)
		} catch (err) {
			setEditEarningId(editEarningId)
			setEditEarningName(editEarningName)
			setEditEarningAmount(editEarningAmount)
			setEarningsArr(earningsArr)
		}
	}

	// ADD NEW EARNING

	const [newEarningName, setNewEarningName] = useState('')
	const [newEarningAmount, setNewEarningAmount] = useState('')

	const handleAddNewEarning = async (event) => {
		event.preventDefault()
		const gotToken = localStorage.getItem('authToken')
		const newArr = [...earningsArr, { name: newEarningName, amount: newEarningAmount }]
		setEarningsArr(newArr)
		setNewEarningName('')
		setNewEarningAmount('')

		try {
			const response = await axios.post(
				`${API_URL}/budget/earnings/add`,
				{ earnings: newArr },
				{ headers: { authorization: `Bearer ${gotToken}` } }
			)
			setEarningsArr(response.data.earnings)
		} catch (err) {
			console.log('Error while adding new earning', err)
			setEarningsArr(earningsArr)
			setNewEarningName(newEarningName)
			setNewEarningAmount(newEarningAmount)
		}
	}

	// ---------------------------------------------------------------------------------------------------

	// EXPENSES

	const [expensesArr, setExpensesArr] = useState(existingBudget.expenses || [])
	const [expensesTotal, setExpensesTotal] = useState(calculateTotal(expensesArr))

	// EDIT EXPENSE

	const [editExpenseId, setEditExpenseId] = useState('')
	const [editExpenseName, setEditExpenseName] = useState('')
	const [editExpenseAmount, setEditExpenseAmount] = useState('')

	const handleEditExpense = (id, name, amount) => {
		setEditExpenseId(id)
		setEditExpenseName(name)
		setEditExpenseAmount(amount)
	}

	const handleCancelEditExpense = () => {
		setEditExpenseId('')
		setEditExpenseName('')
		setEditExpenseAmount('')
	}

	// UPDATE EXPENSE

	const handleUpdateExpense = async (event) => {
		event.preventDefault()
		const gotToken = localStorage.getItem('authToken')
		const updatedExpense = { _id: editExpenseId, name: editExpenseName, amount: editExpenseAmount }
		const itemIndex = expensesArr.findIndex((elem) => elem._id === updatedExpense._id)
		const newArr = [...expensesArr]
		newArr[itemIndex] = updatedExpense

		setExpensesArr(newArr)
		setEditExpenseId('')
		setEditExpenseName('')
		setEditExpenseAmount('')

		try {
			const response = await axios.post(
				`${API_URL}/budget/expenses/update`,
				{ updatedExpense },
				{ headers: { authorization: `Bearer ${gotToken}` } }
			)
			setExpensesArr(response.data.expenses)
		} catch (err) {
			console.log('Error while updating expense:', err)
			setEditExpenseId(editExpenseId)
			setEditExpenseName(editExpenseName)
			setEditExpenseAmount(editExpenseAmount)
			setExpensesArr(expensesArr)
		}
	}

	// DELETE EXPENSE

	const handleDeleteExpense = async (event) => {
		event.preventDefault()
		const gotToken = localStorage.getItem('authToken')
		const expenseId = editExpenseId
		const newArr = expensesArr.filter((elem) => {
			return elem._id !== editExpenseId ? elem : null
		})
		setExpensesArr(newArr)
		setEditExpenseId('')
		setEditExpenseName('')
		setEditExpenseAmount('')
		try {
			const response = await axios.delete(`${API_URL}/budget/expenses/delete/${expenseId}`, {
				headers: { authorization: `Bearer ${gotToken}` },
			})
			setExpensesArr(response.data.expenses)
		} catch (err) {
			console.log('error while deleting expense: ', err)
			setEditExpenseId(editExpenseId)
			setEditExpenseName(editExpenseName)
			setEditExpenseAmount(editExpenseAmount)
			setExpensesArr(expensesArr)
		}
	}

	// ADD NEW EXPENSE

	const [newExpenseName, setNewExpenseName] = useState('')
	const [newExpenseAmount, setNewExpenseAmount] = useState('')

	const handleAddNewExpense = async (event) => {
		event.preventDefault()
		const gotToken = localStorage.getItem('authToken')
		const newArr = [...expensesArr, { name: newExpenseName, amount: newExpenseAmount }]
		setExpensesArr(newArr)
		setNewExpenseName('')
		setNewExpenseAmount('')
		try {
			const response = await axios.post(
				`${API_URL}/budget/expenses/add`,
				{ expenses: newArr },
				{ headers: { authorization: `Bearer ${gotToken}` } }
			)
			setExpensesArr(response.data.expenses)
		} catch (err) {
			console.log('Error while adding new expense', err)
			setExpensesArr(expensesArr)
			setNewExpenseName(newExpenseName)
			setNewExpenseAmount(newExpenseAmount)
		}
	}

	// ---------------------------------------------------------------------------------------------------

	// MONTHLY BUDGET

	const [monthlyBudget, setMonthlyBudget] = useState((earningsTotal - expensesTotal).toFixed(2))

	// FETCH BUDGET DATA

	useEffect(() => {
		const fetchBudgetData = async () => {
			try {
				const gotToken = localStorage.getItem('authToken')
				const resp = await axios.get(`${API_URL}/budget/settings`, {
					headers: { authorization: `Bearer ${gotToken}` },
				})
				const budget = resp.data.respMonthlyBudget

				if (budget) {
					setExistingBudget(budget)
					setCurrency(budget.currency)
					setEarningsArr(budget.earnings)
					setExpensesArr(budget.expenses)

					setEarningsTotal(calculateTotal(budget.earnings))
					setExpensesTotal(calculateTotal(budget.expenses))
				}

				setDataLoaded(true)
			} catch (err) {
				console.log('Error while loading budget data:', err)
			}
		}
		fetchBudgetData()

		setDataLoaded(true)
	}, [])

	// CALCULATE MONTHLY BUDGET

	useEffect(() => {
		setMonthlyBudget((calculateTotal(earningsArr) - calculateTotal(expensesArr)).toFixed(2))
		setEarningsTotal(calculateTotal(earningsArr))
		setExpensesTotal(calculateTotal(expensesArr))
	}, [earningsArr, expensesArr])

	// --------------------------------------------------------------------------------------------------------------------------------------------

	if (dataLoaded) {
		return (
			<>
				<div className="columns">
					<aside className="column is-3">
						<NavAnchor links={navLinksArr} />
					</aside>
					<div className="column is-9">
						<h1>Settings</h1>
						<p>Add your monthly earnings, expenses and spending categories here:</p>

						<section id="general" className="section-settings">
							<h2>General</h2>
							<div className="grid">
								<label htmlFor="currency">Your currency</label>
								<select id="currency" value={currency.code} onChange={handleUpdateCurrency}>
									{currenciesArr.map((elem) => {
										return (
											<option key={elem.code} value={elem.code}>
												{elem.name} ({elem.code})
											</option>
										)
									})}
								</select>
							</div>
							<div className="grid">
								<label htmlFor="startday" className="disabled">
									budget week starts on
								</label>
								<select id="startday" defaultValue="5" disabled>
									<option value="5">Friday (default)</option>
									<option value="6">Saturday</option>
									<option value="0">Sunday</option>
									<option value="1">Monday</option>
									<option value="2">Tuesday</option>
									<option value="3">Wednesday</option>
									<option value="4">Thursday</option>
								</select>
							</div>
							<Alert
								type="primary"
								content={
									<>
										<p>
											<strong>Tipp:</strong> Weekends are usually when we spend the most money. So we recommend starting your
											budget week on friday. You’ll be able to adapt this soon.
										</p>
									</>
								}
							/>
						</section>
						{/* EARNINGS ---------------------------------------------------------------------------------------------------*/}
						<section id="earnings" className="section-settings">
							<h2>
								Your monthly earnings:{' '}
								<strong style={{ float: 'right' }}>
									{earningsTotal} {currency.symbol}
								</strong>
							</h2>
							<div className="card" aria-live="polite">
								{!earningsArr || earningsArr.length === 0 ? (
									<CardEmpty
										headline={'No earnings yet. 😿'}
										text={<p>Start adding some via the form below.</p>}
										imgSrc={noEarningsGif}
										imgAlt={'A baby throws a packet of banknotes out of a window'}
									/>
								) : (
									<ul>
										{earningsArr.map((elem, index) => {
											const elemId = elem._id || index
											if (elemId !== editEarningId) {
												return (
													<li key={elemId}>
														<div className="name">{elem.name}</div>
														<div className="amount">
															{elem.amount} {currency.symbol}
														</div>
														<button
															className="btn-edit-item"
															onClick={() => handleEditEarning(elemId, elem.name, elem.amount)}>
															<IconEdit />
														</button>
													</li>
												)
											} else {
												return (
													<li key={elemId}>
														<form className="form-budget" onSubmit={handleUpdateEarning}>
															<div className="grid">
																<div>
																	<label htmlFor="edit-earning-name" className="hidden">
																		Earning Name
																	</label>
																	<input
																		type="text"
																		id="edit-earning-name"
																		name="inputEditEarningName"
																		placeholder="Name (i.e. »salary«)"
																		value={editEarningName}
																		onChange={handleChange(setEditEarningName)}
																		required
																	/>
																</div>
																<div>
																	<label htmlFor="edit-earning-amount" className="hidden">
																		Amount
																	</label>
																	<div className="input-group">
																		<span className="text">+</span>
																		<input
																			type="number"
																			id="edit-earning-amount"
																			min="0"
																			placeholder="0,00"
																			step=".01"
																			name="inputEditEarningAmount"
																			value={editEarningAmount}
																			onChange={handleChange(setEditEarningAmount)}
																			required
																		/>
																		<span className="text">{currency.symbol}</span>
																	</div>
																</div>
																<div className="btn-group">
																	<button type="submit" className="btn-add-item" aria-label="save changes">
																		<IconCheck />
																	</button>
																	<button
																		className="btn-delete-item"
																		aria-label="delete earning"
																		onClick={handleDeleteEarning}>
																		<IconMinus />
																	</button>
																	<button
																		className="btn-close"
																		aria-label="cancel editing"
																		onClick={handleCancelEditEarning}>
																		<IconClose />
																	</button>
																</div>
															</div>
														</form>
													</li>
												)
											}
										})}
									</ul>
								)}
								<form className="form-budget" onSubmit={handleAddNewEarning}>
									<strong className="sr-only">Add new Earning</strong>
									<div className="grid">
										<div>
											<label htmlFor="new-earning-name" className="hidden">
												Earning Name
											</label>
											<input
												type="text"
												id="new-earning-name"
												name="inputNewEarningName"
												placeholder="Name (i.e. »salary«)"
												value={newEarningName}
												onChange={handleChange(setNewEarningName)}
												required
											/>
										</div>
										<div>
											<label htmlFor="new-earning-amount" className="hidden">
												Amount
											</label>
											<div className="input-group">
												<span className="text">+</span>
												<input
													type="number"
													id="new-earning-amount"
													min="0"
													placeholder="0,00"
													step=".01"
													value={newEarningAmount}
													onChange={handleChange(setNewEarningAmount)}
													required
												/>
												<span className="text">{currency.symbol}</span>
											</div>
										</div>
										<button type="submit" className="btn-add-item" aria-label="add new earning">
											<IconCheck />
										</button>
									</div>
								</form>
							</div>
						</section>
						{/* EXPENSES ---------------------------------------------------------------------------------------------------*/}
						<section id="expenses" className="section-settings">
							<h2>
								Your monthly expenses:
								<strong style={{ float: 'right' }}>
									-{expensesTotal} {currency.symbol}
								</strong>
							</h2>
							<div className="card" aria-live="polite">
								{!expensesArr || expensesArr.length <= 0 ? (
									<CardEmpty
										headline={'No expenses yet'}
										text={<p>Start adding some via the form below.</p>}
										imgSrc={noExpensesGif}
										imgAlt={'A man in a suit and tie is lying on a floor full of banknotes, making snow angel movements'}
									/>
								) : (
									<ul>
										{expensesArr.map((elem, index) => {
											const elemId = elem._id || index
											if (elemId !== editExpenseId) {
												return (
													<li key={elemId}>
														<div className="name">{elem.name}</div>
														<div className="amount">
															-{elem.amount} {currency.symbol}
														</div>
														<button
															className="btn-edit-item"
															onClick={() => handleEditExpense(elemId, elem.name, elem.amount)}>
															<IconEdit />
														</button>
													</li>
												)
											} else {
												return (
													<li key={elemId}>
														<form className="form-budget" onSubmit={handleUpdateExpense}>
															<div className="grid">
																<div>
																	<label htmlFor="edit-expense-name" className="hidden">
																		Expense Name
																	</label>
																	<input
																		type="text"
																		id="edit-expense-name"
																		name="inputEditExpenseName"
																		placeholder="Name (i.e. »salary«)"
																		value={editExpenseName}
																		onChange={handleChange(setEditExpenseName)}
																		required
																	/>
																</div>
																<div>
																	<label htmlFor="edit-expense-amount" className="hidden">
																		Amount
																	</label>
																	<div className="input-group">
																		<span className="text">+</span>
																		<input
																			type="number"
																			id="edit-expense-amount"
																			min="0"
																			placeholder="0,00"
																			step=".01"
																			name="inputEditExpenseAmount"
																			value={editExpenseAmount}
																			onChange={handleChange(setEditExpenseAmount)}
																			required
																		/>
																		<span className="text">{currency.symbol}</span>
																	</div>
																</div>
																<div className="btn-group">
																	<button type="submit" className="btn-add-item" aria-label="save changes">
																		<IconCheck />
																	</button>
																	<button
																		className="btn-delete-item"
																		aria-label="delete expense"
																		onClick={handleDeleteExpense}>
																		<IconMinus />
																	</button>
																	<button
																		className="btn-close"
																		aria-label="cancel editing"
																		onClick={handleCancelEditExpense}>
																		<IconClose />
																	</button>
																</div>
															</div>
														</form>
													</li>
												)
											}
										})}
									</ul>
								)}
								<form className="form-budget" onSubmit={handleAddNewExpense}>
									<strong className="sr-only">Add new Expense</strong>
									<div className="grid">
										<div>
											<label htmlFor="new-expense-name" className="sr-only">
												Expense Name
											</label>
											<input
												type="text"
												id="new-expense-name"
												placeholder="Name (i.e. »rent«)"
												value={newExpenseName}
												onChange={handleChange(setNewExpenseName)}
												required
											/>
										</div>
										<div>
											<label htmlFor="new-expense-amount" className="sr-only">
												Amount
											</label>
											<div className="input-group">
												<span className="text">–</span>
												<input
													type="number"
													id="new-expense-amount"
													min="0"
													placeholder="0,00"
													step=".01"
													name="newExpenseAmount"
													value={newExpenseAmount}
													onChange={handleChange(setNewExpenseAmount)}
													required
												/>
												<span className="text">{currency.symbol}</span>
											</div>
										</div>
										<button type="submit" className="btn-add-item" aria-label="add new expense">
											<IconCheck />
										</button>
									</div>
								</form>
							</div>
						</section>
						{/* BUDGET ---------------------------------------------------------------------------------------------------*/}
						<section className="section-settings">
							<h2>Your monthly Budget:</h2>

							<big>
								{monthlyBudget} <span className="currency">{currency.symbol}</span>
							</big>
						</section>
						{/* CATEGORIES ---------------------------------------------------------------------------------------------------*/}
						<SettingsCategories data={existingBudget} />
					</div>
				</div>
			</>
		)
	} else {
		return <>loading</>
	}
}
