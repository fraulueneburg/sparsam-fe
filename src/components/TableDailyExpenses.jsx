import axios from 'axios'
import { API_URL } from '../config'
import { useState, useContext } from 'react'
import { useDateUtils } from '../hooks/useDateUtils'
import { calculateTotalAmount } from '../context/utils/utilityFunctions'

import { BudgetContext } from '../context/budget.context'
import { HashLink } from 'react-router-hash-link'
import { ReactComponent as IconEdit } from '../assets/icons/icon-edit.svg'
import { ReactComponent as IconCheck } from '../assets/icons/icon-check.svg'
import { ReactComponent as IconClose } from '../assets/icons/icon-close.svg'
import { ReactComponent as IconMinus } from '../assets/icons/icon-minus.svg'
import CardEmpty from './CardEmpty'
import Alert from './Alert'
import dailyExpensesGif from '../assets/img/gif-no-daily-expenses.gif'

export default function TableDailyExpenses() {
	const { dateTodayISO, lastDayFromTodayISO } = useDateUtils()

	const {
		currency,
		existingBudget,
		budgetLeft,
		setBudgetLeft,
		budgetTotal,
		isCurrentTime,
		firstDayISO,
		lastDayISO,
		writeOutDate,
		dailyExpensesArr,
		setDailyExpensesArr,
		categoriesArr,
		setDailyExpensesTotal,
	} = useContext(BudgetContext)

	// ADD NEW EXPENSE

	const handleAddDailyExpense = async (event) => {
		event.preventDefault()

		const gotToken = localStorage.getItem('authToken')
		const newDailyExpense = {
			date: event.target.date.value,
			category: event.target.category.value,
			name: event.target.name.value,
			amount: +event.target.amount.value,
		}
		try {
			event.target.name.value = ''
			event.target.amount.value = ''

			const response = await axios.post(`${API_URL}/budget/addexpense`, newDailyExpense, {
				headers: { authorization: `Bearer ${gotToken}` },
			})
			const createdExpense = response.data
			const newArr = [createdExpense, ...dailyExpensesArr].sort((a, b) => (a.date > b.date ? -1 : b.date > a.date ? 1 : 0))

			setDailyExpensesArr(newArr)
			setDailyExpensesTotal(calculateTotalAmount(newArr))
			setBudgetLeft(budgetTotal - calculateTotalAmount(newArr))
		} catch (err) {
			event.target.name.value = newDailyExpense.name
			event.target.amount.value = newDailyExpense.amount
			console.log('ERROR WHILE ADDING EXPENSE:', err)
		}
	}

	// DELETE EXPENSE

	const handleDeleteDailyExpense = async (index, event) => {
		event.preventDefault()

		const gotToken = localStorage.getItem('authToken')
		const expenseId = event.target.getAttribute('data-key')
		const filteredDailyExpensesArr = dailyExpensesArr.filter((elem, i) => {
			return i !== index ? elem : null
		})
		setDailyExpensesArr(filteredDailyExpensesArr)

		try {
			await axios.delete(`${API_URL}/budget/deleteexpense/${expenseId}`, {
				headers: { authorization: `Bearer ${gotToken}` },
			})
		} catch (err) {
			console.log('ERROR WHILE DELETING EXPENSE', err)
		}
		setDailyExpensesTotal(calculateTotalAmount(filteredDailyExpensesArr))
		setBudgetLeft(budgetTotal - calculateTotalAmount(filteredDailyExpensesArr))
		setEditExpenseId(0)
	}

	// EDIT EXPENSE

	const [editExpenseId, setEditExpenseId] = useState(0)
	const [editExpenseName, setEditExpenseName] = useState()
	const [editExpenseDate, setEditExpenseDate] = useState()
	const [editExpenseCategory, setEditExpenseCategory] = useState()
	const [editExpenseAmount, setEditExpenseAmount] = useState(0)

	const handleEditDailyExpense = (event) => {
		event.preventDefault()
		const expenseId = event.target.getAttribute('data-key')
		const expenseData = dailyExpensesArr.find((elem) => elem._id === expenseId)
		setEditExpenseId(expenseId)
		setEditExpenseDate(expenseData.date.slice(0, 10))
		setEditExpenseName(expenseData.name)
		setEditExpenseCategory(expenseData.category)
		setEditExpenseAmount(expenseData.amount.toFixed(2))
	}

	const handleUpdateDailyExpense = async (event) => {
		event.preventDefault()
		const expenseId = event.target.getAttribute('data-key')
		const gotToken = localStorage.getItem('authToken')
		const updatedExpense = {
			amount: +editExpenseAmount,
			category: editExpenseCategory,
			date: new Date(editExpenseDate),
			name: editExpenseName,
		}

		try {
			await axios.post(`${API_URL}/budget/updateexpense/${expenseId}`, updatedExpense, {
				headers: { authorization: `Bearer ${gotToken}` },
			})
			const expenseIndex = dailyExpensesArr.findIndex((elem) => elem._id === expenseId)
			const isInDateRange = firstDayISO <= editExpenseDate && editExpenseDate <= lastDayISO

			console.log('firstDayISO', firstDayISO)
			console.log('lastDayISO', lastDayISO)
			console.log('editExpenseDate', editExpenseDate)
			console.log('isInDateRange', isInDateRange)

			let updatedDailyExpenseArr = [...dailyExpensesArr]

			console.log('BEFORE CHECK', updatedDailyExpenseArr)

			if (isInDateRange) {
				updatedDailyExpenseArr[expenseIndex].amount = +editExpenseAmount
				updatedDailyExpenseArr[expenseIndex].category = editExpenseCategory
				updatedDailyExpenseArr[expenseIndex].date = editExpenseDate
				updatedDailyExpenseArr[expenseIndex].name = editExpenseName

				console.log('is in range, ARR:', updatedDailyExpenseArr)

				setDailyExpensesArr(updatedDailyExpenseArr)
				setDailyExpensesTotal(calculateTotalAmount(updatedDailyExpenseArr))
				setBudgetLeft(budgetTotal - calculateTotalAmount(updatedDailyExpenseArr))
			} else {
				updatedDailyExpenseArr.splice(expenseIndex, 1)

				console.log('is NOT IN RANGE, ARR:', updatedDailyExpenseArr)

				setDailyExpensesArr(updatedDailyExpenseArr)
				setDailyExpensesTotal(calculateTotalAmount(updatedDailyExpenseArr))
				setBudgetLeft(budgetTotal - calculateTotalAmount(updatedDailyExpenseArr))
			}
			setEditExpenseId(0)
		} catch (err) {
			console.log('ERROR WHILE UPDATING EXPENSE', err)
		}
	}

	return categoriesArr?.length <= 0 ? (
		<Alert
			content={
				<>
					<h4>No categories defined</h4>
					<p>You need to add at least one category to start your budget planning</p>
					<HashLink to="/settings#categories" className="btn-primary">
						add categories in Settings
					</HashLink>
				</>
			}
		/>
	) : (
		<section className="expenses">
			<h2>Your Expenses</h2>
			<form onSubmit={handleAddDailyExpense} className="form-inline form-add-expense" style={{ marginBottom: '1.5rem' }}>
				<input
					type="date"
					name="date"
					min={firstDayISO}
					max={lastDayISO}
					placeholder={`${isCurrentTime ? dateTodayISO : firstDayISO}`}
					required
				/>
				<select name="category">
					{existingBudget.categories
						? existingBudget.categories.map((elem) => {
								return (
									<option key={elem._id} value={elem._id}>
										{elem.name}
									</option>
								)
						  })
						: null}
				</select>
				<input type="text" name="name" placeholder="name"></input>
				<div className="input-group">
					<span className="text">–</span>
					<input type="number" name="amount" placeholder="0,00" step=".01" required></input>
					<span className="text">{currency}</span>
				</div>
				<button className="btn-add-item">
					<IconCheck />
				</button>
			</form>
			<div className="card">
				{dailyExpensesArr.length <= 0 ? (
					<CardEmpty
						headline={'No expenses yet.'}
						text={<p>Start adding some via the form above.</p>}
						imgSrc={dailyExpensesGif}
						imgPosition={'bottom'}
						imgAlt={
							'A parrot picks up gold coins with its beak and drops them into a small savings box that looks like a treasure chest.'
						}
					/>
				) : (
					<div className="table-wrapper">
						<table className="table-daily-expenses">
							<thead>
								<tr>
									<th style={{ width: '110px' }}>Date</th>
									<th>Category</th>
									<th>Name</th>
									<th style={{ textAlign: 'right' }}>Amount</th>
									<th style={{ textAlign: 'right' }}></th>
								</tr>
							</thead>
							<tbody>
								{dailyExpensesArr
									.sort((a, b) => (a.date > b.date ? -1 : b.date > a.date ? 1 : 0))
									.map((dailyExpense, index, arr) => {
										if (dailyExpense._id !== editExpenseId) {
											const categoryData = categoriesArr.find((category) => category._id === dailyExpense.category)
											return (
												<tr
													key={dailyExpense._id}
													className={
														index > 0 && arr[index - 1].date.slice(0, 10) === arr[index].date.slice(0, 10)
															? null
															: 'first-of-date'
													}>
													<td>
														<time dateTime={dailyExpense.date}>{writeOutDate(dailyExpense.date)}</time>
													</td>
													<td className="td-category">
														<strong
															style={{
																color: `var(--color-${categoryData.colour})`,
															}}>
															<span>{categoryData.name}</span>
														</strong>
													</td>
													<td>{dailyExpense.name}</td>
													<td style={{ textAlign: 'right' }}>
														-{dailyExpense.amount.toFixed(2)} {currency}
													</td>
													<td>
														<button
															data-key={dailyExpense._id}
															className="btn-edit-item"
															onClick={(event) => handleEditDailyExpense(event)}>
															<IconEdit />
														</button>
													</td>
												</tr>
											)
										} else {
											return (
												<tr key={dailyExpense._id}>
													<td colSpan="5">
														<form
															className="form-inline form-edit-expense"
															onSubmit={handleUpdateDailyExpense}
															data-key={dailyExpense._id}>
															<input
																type="date"
																name="date"
																max={lastDayFromTodayISO}
																value={editExpenseDate}
																onChange={(event) => setEditExpenseDate(event.target.value)}
																required
															/>
															<select
																name="category"
																value={editExpenseCategory}
																onChange={(event) => setEditExpenseCategory(event.target.value)}
																required>
																{existingBudget.categories.map((elem) => {
																	return (
																		<option key={elem._id} value={elem._id}>
																			{elem.name}
																		</option>
																	)
																})}
															</select>
															<input
																type="text"
																value={editExpenseName}
																onChange={(event) => setEditExpenseName(event.target.value)}
																name="name"
															/>
															<div className="input-group">
																<span className="text">–</span>
																<input
																	type="number"
																	name="amount"
																	value={editExpenseAmount}
																	placeholder="0,00"
																	step=".01"
																	onChange={(event) => setEditExpenseAmount(event.target.value)}
																	required
																/>
																<span className="text">{currency}</span>
															</div>
															<div className="btn-group">
																<button type="submit" className="btn-add-item" aria-label="save changes">
																	<IconCheck />
																</button>
																<button
																	data-key={dailyExpense._id}
																	className="btn-delete-item"
																	onClick={(event) => handleDeleteDailyExpense(index, event)}>
																	<IconMinus />
																</button>
																<button
																	onClick={() => setEditExpenseId(0)}
																	className="btn-close"
																	aria-label="cancel editing">
																	<IconClose />
																</button>
															</div>
														</form>
													</td>
												</tr>
											)
										}
									})}
							</tbody>
							<tfoot>
								<tr>
									<td></td>
									<td></td>
									<td></td>
									<td>
										<strong>
											{((budgetTotal - budgetLeft) * -1).toFixed(2)} {currency}
										</strong>
									</td>
									<td>spent</td>
								</tr>
								<tr className={`${budgetLeft < 0 ? 'is-negative' : null}`}>
									<td></td>
									<td></td>
									<td></td>
									<td>
										<strong>
											{budgetLeft.toFixed(2)} {currency}
										</strong>
									</td>
									<td>left</td>
								</tr>
							</tfoot>
						</table>
					</div>
				)}
			</div>
		</section>
	)
}
