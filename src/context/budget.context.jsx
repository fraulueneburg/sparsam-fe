import { createContext, useEffect, useState } from 'react'
import { API_URL } from '../config'
import axios from 'axios'

import { useSearchParams } from 'react-router-dom'
import { calculateTotalAmount, writeOutDate } from '../context/utils/utilityFunctions'
import { useDateUtils } from '../hooks/useDateUtils'

const BudgetContext = createContext()

const BudgetContextWrapper = ({ children }) => {
	const [searchParams] = useSearchParams()
	const timePeriod = searchParams.get('timePeriod') || 'week'

	// TIME

	const { convertToISO, dayToday, monthToday, yearToday } = useDateUtils()

	const firstDay = new Date(new Date().setDate(new Date().getDate() + ((-dayToday - 2) % 7)))
	const lastDay = new Date(new Date().setDate(new Date().getDate() + (((-dayToday - 2) % 7) + 6)))
	const [firstDayISO, setFirstDayISO] = useState(convertToISO(firstDay))
	const [lastDayISO, setLastDayISO] = useState(convertToISO(lastDay))

	const [isCurrentTime, setIsCurrentTime] = useState(true)
	const [numOfItemsToNavigate, setNumOfItemsToNavigate] = useState(0)

	// FETCH EXISTING BUDGET

	const [existingBudget, setExistingBudget] = useState([])
	const [existingDailyExpenses, setExistingDailyExpenses] = useState([])
	const [monthlyBudget, setMonthlyBudget] = useState(0)
	const [categoriesArr, setCategoriesArr] = useState([])
	const [currency, setCurrency] = useState('')
	const [dataLoaded, setDataLoaded] = useState(false)

	useEffect(() => {
		const fetchBudgetData = async () => {
			try {
				const gotToken = localStorage.getItem('authToken')
				const resp = await axios.get(`${API_URL}/budget`, {
					headers: { authorization: `Bearer ${gotToken}` },
				})
				const fetchedBudget = resp.data.respMonthlyBudget
				const fetchedDailyExpenses = resp.data.respDailyExpenses

				setExistingDailyExpenses(fetchedDailyExpenses)
				setExistingBudget(fetchedBudget)
				setMonthlyBudget(calculateTotalAmount(fetchedBudget.earnings) - calculateTotalAmount(fetchedBudget.expenses))
				setCategoriesArr(fetchedBudget.categories)
				setCurrency(fetchedBudget.currency.symbol)

				setDataLoaded(true)
			} catch (err) {
				console.log('Error while fetching budget:', err)
				setDataLoaded(true)
			}
		}
		fetchBudgetData()
	}, [timePeriod])

	const [dailyExpensesArr, setDailyExpensesArr] = useState(
		existingDailyExpenses.filter(
			(element) => element.date.slice(0, 10) >= firstDayISO && element.date.slice(0, 10) <= lastDayISO
		)
	)

	const [dailyExpensesTotal, setDailyExpensesTotal] = useState(calculateTotalAmount(dailyExpensesArr))
	const [budgetTotal, setBudgetTotal] = useState((monthlyBudget / 31) * 7)
	const [budgetLeft, setBudgetLeft] = useState(budgetTotal - dailyExpensesTotal)

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

		// convert back to ISO format strings
		const newFirstDayISO = convertToISO(newFirstDay)
		const newLastDayISO = convertToISO(newLastDay)
		setFirstDayISO(newFirstDayISO)
		setLastDayISO(newLastDayISO)

		// update daily expenses array
		const updatedDailyExpArr = existingDailyExpenses.filter(
			(element) => element.date.slice(0, 10) >= firstDayISO && element.date.slice(0, 10) <= lastDayISO
		)
		setDailyExpensesArr(updatedDailyExpArr)
		setDailyExpensesTotal(calculateTotalAmount(updatedDailyExpArr))
		setBudgetLeft(budgetTotal - calculateTotalAmount(updatedDailyExpArr))

		// check if today’s week/month
		setIsCurrentTime(
			(timePeriod === 'month' && yearToday === +lastDayISO.slice(0, 4) && monthToday + 1 === +lastDayISO.slice(5, 7)) ||
				(timePeriod === 'week' && convertToISO(new Date()) >= firstDayISO && convertToISO(new Date()) <= lastDayISO)
				? true
				: false
		)
	}, [firstDayISO, lastDayISO, numOfItemsToNavigate, timePeriod, existingDailyExpenses])

	return (
		<BudgetContext.Provider
			value={{
				timePeriod,
				currency,
				existingBudget,
				existingDailyExpenses,
				monthlyBudget,
				budgetLeft,
				setBudgetLeft,
				budgetTotal,
				isCurrentTime,
				firstDayISO,
				lastDayISO,
				writeOutDate,
				numOfItemsToNavigate,
				setNumOfItemsToNavigate,
				dailyExpensesArr,
				setDailyExpensesArr,
				categoriesArr,
				dailyExpensesTotal,
				setDailyExpensesTotal,
			}}>
			{children}
		</BudgetContext.Provider>
	)
}

export { BudgetContext, BudgetContextWrapper }
