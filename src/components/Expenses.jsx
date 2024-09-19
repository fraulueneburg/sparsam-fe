import { useState, useContext } from 'react'
import { SettingsContext } from '../context/settings.context'
import { API_URL } from '../config'
import axios from 'axios'

import CardEmpty from '../components/CardEmpty'
import { ReactComponent as IconMinus } from '../assets/icons/icon-minus.svg'
import { ReactComponent as IconEdit } from '../assets/icons/icon-edit.svg'
import { ReactComponent as IconClose } from '../assets/icons/icon-close.svg'
import { ReactComponent as IconCheck } from '../assets/icons/icon-check.svg'
import noExpensesGif from '../assets/img/gif-no-expenses.gif'

export default function Expenses() {
	const { currency, handleChange, expensesArr, setExpensesArr, expensesTotal, maxLengthTextInput } =
		useContext(SettingsContext)

	// EDIT EXPENSE

	const [editExpenseId, setEditExpenseId] = useState('')
	const [editExpenseName, setEditExpenseName] = useState('')
	const [editExpenseAmount, setEditExpenseAmount] = useState('')

	const handleEditExpense = (id, name, amount) => {
		setEditExpenseId(id)
		setEditExpenseName(name)
		setEditExpenseAmount(+amount)
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
		const updatedExpense = { _id: editExpenseId, name: editExpenseName, amount: +editExpenseAmount }
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
			setEditExpenseAmount(+editExpenseAmount.toFixed(2))
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
			setEditExpenseAmount(+editExpenseAmount)
			setExpensesArr(expensesArr)
		}
	}

	// ADD NEW EXPENSE

	const [newExpenseName, setNewExpenseName] = useState('')
	const [newExpenseAmount, setNewExpenseAmount] = useState('')

	const handleAddNewExpense = async (event) => {
		event.preventDefault()
		const gotToken = localStorage.getItem('authToken')
		const newArr = [...expensesArr, { name: newExpenseName, amount: +newExpenseAmount }]
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
			setNewExpenseAmount(+newExpenseAmount)
		}
	}

	return (
		<>
			<h2>Monthly Expenses</h2>
			<div className="card" aria-live="polite">
				{!expensesArr || expensesArr.length <= 0 ? (
					<CardEmpty
						headline={'No expenses yet'}
						text={<p>Start adding some via the form below.</p>}
						imgSrc={noExpensesGif}
						imgAlt={'A man in a suit and tie is lying on a floor full of banknotes, making snow angel movements'}
					/>
				) : (
					<>
						<ul>
							{expensesArr.map((elem, index) => {
								const elemId = elem._id || index
								if (elemId !== editExpenseId) {
									return (
										<li key={elemId}>
											<div className="name">{elem.name}</div>
											<div className="amount">
												-{elem.amount.toFixed(2)} {currency.symbol}
											</div>
											<button className="btn-edit-item" onClick={() => handleEditExpense(elemId, elem.name, elem.amount)}>
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
															maxLength={maxLengthTextInput}
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
															<span className="text">–</span>
															<input
																type="number"
																id="edit-expense-amount"
																min="0"
																placeholder="0,00"
																step=".01"
																name="inputEditExpenseAmount"
																value={+editExpenseAmount}
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
														<button className="btn-delete-item" aria-label="delete expense" onClick={handleDeleteExpense}>
															<IconMinus />
														</button>
														<button className="btn-close" aria-label="cancel editing" onClick={handleCancelEditExpense}>
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
						<p className="total">
							<strong className="amount">
								-{expensesTotal} {currency.symbol}
							</strong>
							<span className="name">total </span>
						</p>
					</>
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
								maxLength={maxLengthTextInput}
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
		</>
	)
}
