import axios from 'axios'
import { API_URL } from '../config'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { ReactComponent as IconEdit } from '../assets/icons/icon-edit.svg'
import { ReactComponent as IconCheck } from '../assets/icons/icon-check.svg'
import { ReactComponent as IconChevronLeft } from '../assets/icons/icon-chevron-left.svg'
import { ReactComponent as IconChevronRight } from '../assets/icons/icon-chevron-right.svg'
import { ReactComponent as IconClose } from '../assets/icons/icon-close.svg'
import { ReactComponent as IconMinus } from '../assets/icons/icon-minus.svg'
import dailyExpensesGif from '../assets/img/gif-no-daily-expenses.gif'
import noChartGif from '../assets/img/gif-no-chart.gif'

function YourExpenses(props) {
	const gotToken = localStorage.getItem('authToken')
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const propBudgetData = props.budgetData

	const currency = propBudgetData.currency.symbol
	const propDailyExpensesData = props.dailyExpensesData
	const categoriesArr = propBudgetData.categories
	const chartCategoriesArr = categoriesArr.map((elem) => elem.name)

	const chartColorsArr = [
		'#00acc1',
		'#8e24aa',
		'#7cb342',
		'#f3ba2f',
		'#2a71d0',
		'#546e7a',
		'#00897b',
		'#5e35b1',
		'#d81b60',
		'#c0ca33',
		'#f4511e',
	]

	// GENERAL FUNCTIONS

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

	const writeOutDate = (ISOdate) => {
		let writtenDate
		if (+ISOdate.slice(0, 4) === yearToday) {
			writtenDate = new Date(ISOdate).toLocaleDateString('en-US', {
				weekday: 'short',
				month: 'short',
				day: 'numeric',
			})
		} else {
			writtenDate = new Date(ISOdate).toLocaleDateString('en-US', {
				year: 'numeric',
				weekday: 'short',
				month: 'short',
				day: 'numeric',
			})
		}
		return `${writtenDate.slice(0, 2)}, ${writtenDate.slice(4)}`
	}

	// VARIABLES
	// WEEKLY/MONTHLY BUDGET

	const timePeriod = searchParams.get('timePeriod') || 'week'

	const [monthlyBudget, setMonthlyBudget] = useState(
		calculateTotal(propBudgetData.earnings) - calculateTotal(propBudgetData.expenses)
	)

	// TIME PERIOD

	const dayToday = new Date().getDay()
	const monthToday = new Date().getMonth()
	const yearToday = new Date().getFullYear()
	const dateTodayISO = new Date().toISOString().slice(0, 10)
	const lastDayFromToday = new Date(new Date().setDate(new Date().getDate() + (((-dayToday - 2) % 7) + 6)))
	const lastDayFromTodayISO = lastDayFromToday.toISOString().slice(0, 10)

	const [isCurrentTime, setIsCurrentTime] = useState(true)

	const [firstDay, setFirstDay] = useState(new Date(new Date().setDate(new Date().getDate() + ((-dayToday - 2) % 7))))
	const [lastDay, setLastDay] = useState(new Date(new Date().setDate(new Date().getDate() + (((-dayToday - 2) % 7) + 6))))
	const [firstDayISO, setFirstDayISO] = useState(firstDay.toISOString().slice(0, 10))
	const [lastDayISO, setLastDayISO] = useState(lastDay.toISOString().slice(0, 10))

	// DAILY EXPENSES

	const [dailyExpensesArr, setDailyExpensesArr] = useState(
		propDailyExpensesData.filter(
			(element) => element.date.slice(0, 10) >= firstDayISO && element.date.slice(0, 10) <= lastDayISO
		)
	)

	const [dailyExpensesTotal, setDailyExpensesTotal] = useState(calculateTotal(dailyExpensesArr))
	const [budgetTotal, setBudgetTotal] = useState((monthlyBudget / 31) * 7)
	const [budgetLeft, setBudgetLeft] = useState(budgetTotal - dailyExpensesTotal)
	const [numOfItemsToNavigate, setNumOfItemsToNavigate] = useState(0)

	// SUM SPENT PER CATEGORY

	const [categoriesTotalArr, setCategoriesTotalArr] = useState(
		categoriesArr.map((oneCategory) => {
			return dailyExpensesArr.reduce((acc, curr) => {
				return curr.category === oneCategory.name ? acc + curr.amount : acc
			}, 0)
		})
	)

	// NAVIGATE BACK/FORTH

	useEffect(() => {
		setNumOfItemsToNavigate(0)
		timePeriod === 'week' ? setBudgetTotal((monthlyBudget / 31) * 7) : setBudgetTotal(monthlyBudget)
	}, [timePeriod, monthlyBudget])

	useEffect(() => {
		// Convert ISO format strings to JavaScript Date objects
		let currentFirstDay = new Date(firstDay)
		let currentLastDay = new Date(lastDay)
		const oneWeek = 7 * 24 * 60 * 60 * 1000 // One week in milliseconds

		// Calculate new first and last day
		let newFirstDay = new Date(currentFirstDay.getTime() + numOfItemsToNavigate * oneWeek)
		let newLastDay = new Date(currentLastDay.getTime() + numOfItemsToNavigate * oneWeek)

		if (timePeriod === 'month') {
			const newDate = new Date()
			const timezoneOffsetHours = Math.floor(Math.abs(newDate.getTimezoneOffset()) / 60)
			newFirstDay = new Date(yearToday, monthToday + numOfItemsToNavigate, 1, timezoneOffsetHours)
			newLastDay = new Date(yearToday, monthToday + numOfItemsToNavigate + 1, 0, timezoneOffsetHours)
		}

		// convert back to ISO format strings + update state
		const newFirstDayISO = newFirstDay.toISOString().slice(0, 10)
		const newLastDayISO = newLastDay.toISOString().slice(0, 10)
		setFirstDayISO(newFirstDayISO)
		setLastDayISO(newLastDayISO)
		setDailyExpensesArr(
			propDailyExpensesData.filter(
				(element) => element.date.slice(0, 10) >= firstDayISO && element.date.slice(0, 10) <= lastDayISO
			)
		)

		// check if today’s week/month
		setIsCurrentTime(
			(timePeriod === 'month' && yearToday === +lastDayISO.slice(0, 4) && monthToday + 1 === +lastDayISO.slice(5, 7)) ||
				(timePeriod === 'week' &&
					new Date().toISOString().slice(0, 10) >= firstDayISO &&
					new Date().toISOString().slice(0, 10) <= lastDayISO)
				? true
				: false
		)
	}, [firstDayISO, lastDayISO, numOfItemsToNavigate, timePeriod, propDailyExpensesData])

	useEffect(() => {
		setDailyExpensesTotal(calculateTotal(dailyExpensesArr))
		setBudgetLeft(budgetTotal - calculateTotal(dailyExpensesArr))
	}, [dailyExpensesArr, budgetTotal, categoriesArr])

	// ADD NEW EXPENSE

	const handleAddDailyExpense = async (event) => {
		event.preventDefault()

		const newDailyExpense = {
			date: event.target.date.value,
			category: event.target.category.value,
			name: event.target.name.value,
			amount: +event.target.amount.value,
		}
		try {
			const response = await axios.post(`${API_URL}/budget/addexpense`, newDailyExpense, {
				headers: { authorization: `Bearer ${gotToken}` },
			})
			const createdExpense = response.data
			const newArr = [createdExpense, ...dailyExpensesArr].sort((a, b) => (a.date > b.date ? -1 : b.date > a.date ? 1 : 0))

			setDailyExpensesArr(newArr)
			setDailyExpensesTotal(calculateTotal(newArr))
			setBudgetLeft(budgetTotal - calculateTotal(newArr))

			setCategoriesTotalArr(
				categoriesArr.map((oneCategory) => {
					return newArr.reduce((acc, curr) => {
						return curr.category === oneCategory.name ? acc + curr.amount : acc
					}, 0)
				})
			)
			event.target.name.value = ''
			event.target.amount.value = ''
		} catch (err) {
			console.log('ERROR WHILE ADDING EXPENSE:', err)
		}
	}

	// DELETE EXPENSE

	const handleDeleteDailyExpense = async (index, event) => {
		event.preventDefault()

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
		setDailyExpensesTotal(calculateTotal(filteredDailyExpensesArr))
		setBudgetLeft(budgetTotal - calculateTotal(filteredDailyExpensesArr))
		setCategoriesTotalArr(
			categoriesArr.map((oneCategory) => {
				return filteredDailyExpensesArr.reduce((acc, curr) => {
					return curr.category === oneCategory.name ? acc + curr.amount : acc
				}, 0)
			})
		)
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
			let updatedDailyExpenseArr = [...dailyExpensesArr]
			updatedDailyExpenseArr[expenseIndex].amount = +editExpenseAmount
			updatedDailyExpenseArr[expenseIndex].category = editExpenseCategory
			updatedDailyExpenseArr[expenseIndex].date = editExpenseDate
			updatedDailyExpenseArr[expenseIndex].name = editExpenseName
			setDailyExpensesArr(updatedDailyExpenseArr)
			setDailyExpensesTotal(calculateTotal(updatedDailyExpenseArr))
			setBudgetLeft(budgetTotal - calculateTotal(updatedDailyExpenseArr))
			setEditExpenseId(0)
		} catch (err) {
			console.log('ERROR WHILE UPDATING EXPENSE', err)
		}
	}

	// CHART

	useEffect(() => {
		setCategoriesTotalArr(
			categoriesArr.map((oneCategory) => {
				return dailyExpensesArr.reduce((acc, curr) => {
					return curr.category === oneCategory.name ? acc + curr.amount : acc
				}, 0)
			})
		)
	}, [categoriesArr, dailyExpensesArr, timePeriod])

	Chart.register(CategoryScale)
	const [chartData, setChartData] = useState({
		labels: chartCategoriesArr,
		datasets: [
			{
				data: categoriesTotalArr,
				backgroundColor: chartColorsArr,
				borderColor: '#11191f',
				borderWidth: 2,
			},
		],
	})

	useEffect(() => {
		setChartData({
			labels: chartCategoriesArr,
			datasets: [
				{
					data: categoriesTotalArr,
					backgroundColor: chartColorsArr,
					borderColor: '#11191f',
					borderWidth: 2,
				},
			],
		})
	}, [categoriesArr, categoriesTotalArr, dailyExpensesArr, dailyExpensesTotal])

	return (
		<>
			<section>
				<div className={`card card-budget ${timePeriod}-active`}>
					<div className="nav-tabs">
						<button
							onClick={() => navigate('?timePeriod=week')}
							className={`btn-week ${timePeriod === 'week' ? 'active' : ''}`}>
							week view
						</button>
						<button
							onClick={() => navigate('?timePeriod=month')}
							className={`btn-month ${timePeriod === 'month' ? 'active' : ''}`}>
							month view
						</button>
					</div>
					<small>
						{isCurrentTime ? <mark>current {timePeriod}</mark> : null}
						<div>
							<time dateTime={firstDayISO}>{writeOutDate(firstDayISO)}</time>
							{' – '}
							<time dateTime={lastDayISO}>{writeOutDate(lastDayISO)}</time>
						</div>
					</small>
					<h2>Budget left this {timePeriod}:</h2>
					<p>
						<big className={`${budgetLeft < 0 ? 'is-negative' : null}`}>
							{budgetLeft.toFixed(2)} {currency}
						</big>
						of {budgetTotal.toFixed(2)} {currency}
					</p>
					<div className="btn-group nav-prev-next">
						<button onClick={() => setNumOfItemsToNavigate((prev) => prev - 1)} aria-label={`go to previous ${timePeriod}`}>
							<IconChevronLeft />
						</button>
						{!isCurrentTime ? (
							<button onClick={() => setNumOfItemsToNavigate((prev) => prev - numOfItemsToNavigate)}>
								see current {timePeriod}
							</button>
						) : (
							<div></div>
						)}
						<button
							onClick={() => setNumOfItemsToNavigate((prev) => prev + 1)}
							aria-label={`go to next ${timePeriod}`}
							disabled={isCurrentTime}>
							<IconChevronRight />
						</button>
					</div>
				</div>
			</section>
			{timePeriod === 'month' ? (
				<>
					<section>
						<h2>Budget spent by Category:</h2>
						<div className="columns is-vcentered">
							<div className="column chart-container">
								{dailyExpensesTotal <= 0 ? (
									<div className="card">
										<div className="card-empty-text">
											<img src={noChartGif} alt="" />
											<h4>No chart to display.</h4>
											<p>
												Wow. You spent 0,00{currency} this {timePeriod}.<br />
												Good job. But also: Are you sure? 🤔
											</p>
										</div>
									</div>
								) : (
									<Pie
										data={chartData}
										options={{
											responsive: true,
											plugins: {
												title: { display: true },
												legend: { display: false },
												tooltip: {
													displayColors: false,
													padding: 12,
													callbacks: {
														label: (item) => `${item.formattedValue}${currency}`,
													},
													titleFont: {
														size: 16,
														family: 'system-ui',
													},
													bodyFont: {
														size: 16,
														family: 'system-ui',
													},
												},
											},
										}}
									/>
								)}
							</div>
							<div className="column">
								<table>
									<thead>
										<tr>
											<th>Category</th>
											<th style={{ textAlign: 'right' }}>Total</th>
										</tr>
									</thead>
									<tbody>
										{categoriesTotalArr
											? categoriesTotalArr.map((elem, index) => {
													return (
														<tr className={elem > 0 ? null : 'greyed-out'} key={index}>
															<td>
																<div className="color-indicator" style={{ backgroundColor: chartColorsArr[index] }}></div>{' '}
																{categoriesArr[index].name}
															</td>
															<td style={{ textAlign: 'right' }}>
																{elem.toFixed(2)} {currency}
															</td>
														</tr>
													)
											  })
											: null}
									</tbody>
									<tfoot>
										<tr>
											<td></td>
											<td>
												{categoriesTotalArr
													.reduce((acc, curr) => {
														return acc + curr
													})
													.toFixed(2)}
												{` ${currency}`}
											</td>
										</tr>
									</tfoot>
								</table>
							</div>
						</div>
					</section>
				</>
			) : null}
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
						{propBudgetData.categories
							? propBudgetData.categories.map((elem) => {
									return <option key={elem._id}>{elem.name}</option>
							  })
							: null}
					</select>
					<input type="text" name="name" placeholder="name"></input>
					<div className="input-group">
						<span className="text">–</span>
						<input type="number" name="amount" placeholder="0,00" step=".01" required></input>
						<span className="text">€</span>
					</div>
					<button className="btn-add-item">
						<IconCheck />
					</button>
				</form>
				<div className="card">
					{dailyExpensesArr.length <= 0 ? (
						<div className="card-empty-text">
							<h4>No expenses yet.</h4>
							<p>Start adding some via the form above.</p>
							<img src={dailyExpensesGif} alt="" width="300" />
						</div>
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
												return (
													<tr
														key={dailyExpense._id}
														className={index > 0 && arr[index - 1].date === arr[index].date ? null : 'first-of-date'}>
														<td>
															<time dateTime={dailyExpense.date}>{writeOutDate(dailyExpense.date)}</time>
														</td>
														<td>
															<strong>{dailyExpense.category}</strong>
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
																	{propBudgetData.categories.map((elem) => {
																		return <option key={elem._id}>{elem.name}</option>
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
																	<span className="text">€</span>
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
																	{/* <ModalProvider>
																		<ModalButton className="btn-delete-item" data-key={dailyExpense._id}>
																			<IconMinus />
																		</ModalButton>
																		<Modal
																			modalClassName="modal-delete"
																			title="Delete item?"
																			onConfirm={''}
																			buttonLabel={'yes'}
																		/>
																	</ModalProvider> */}

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
		</>
	)
}

export default YourExpenses
