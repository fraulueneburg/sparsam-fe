import React from 'react'
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
	const [categoriesArr, setCategoriesArr] = useState([])
	const [currency, setCurrency] = useState('')
	const [dataLoaded, setDataLoaded] = useState(false)

	const [dailyExpensesArr, setDailyExpensesArr] = useState([])
	const [dailyExpensesTotal, setDailyExpensesTotal] = useState(0)
	const [budgetTotal, setBudgetTotal] = useState(0)
	const [monthlyBudget, setMonthlyBudget] = useState(0)
	const [budgetLeft, setBudgetLeft] = useState(0)

	// INITIAL RENDER, fetch data from database

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
				setCategoriesArr(fetchedBudget.categories)
				setCurrency(fetchedBudget.currency.symbol)
				setDataLoaded(true)
			} catch (err) {
				console.log('Error while fetching budget:', err)
				setDataLoaded(true)
			}
		}
		fetchBudgetData()
	}, [])

	// NAVIGATE BACK/FORTH
	// calculate new first and last day

	useEffect(() => {
		const currentFirstDay = new Date(firstDay)
		const currentLastDay = new Date(lastDay)
		const newDate = new Date()
		const timezoneOffsetHours = Math.floor(Math.abs(newDate.getTimezoneOffset()) / 60)
		const oneWeek = 7 * 24 * 60 * 60 * 1000

		let newFirstDay, newLastDay

		if (timePeriod === 'month') {
			newFirstDay = new Date(yearToday, monthToday + numOfItemsToNavigate, 1, timezoneOffsetHours)
			newLastDay = new Date(yearToday, monthToday + numOfItemsToNavigate + 1, 0, timezoneOffsetHours)
		} else {
			newFirstDay = new Date(currentFirstDay.getTime() + numOfItemsToNavigate * oneWeek)
			newLastDay = new Date(currentLastDay.getTime() + numOfItemsToNavigate * oneWeek)
		}

		const newFirstDayISO = convertToISO(newFirstDay)
		const newLastDayISO = convertToISO(newLastDay)
		setFirstDayISO(newFirstDayISO)
		setLastDayISO(newLastDayISO)

		setIsCurrentTime(
			(timePeriod === 'month' &&
				yearToday === +newLastDayISO.slice(0, 4) &&
				monthToday + 1 === +newLastDayISO.slice(5, 7)) ||
				(timePeriod === 'week' && convertToISO(new Date()) >= newFirstDayISO && convertToISO(new Date()) <= newLastDayISO)
				? true
				: false
		)
	}, [numOfItemsToNavigate, timePeriod])

	// RESET WEEK/MONTH TO TODAY ON TIME PERIOD CHANGE

	useEffect(() => {
		setNumOfItemsToNavigate(0)
	}, [timePeriod])

	// UPDATE DAILY EXPENSES ARRAY
	// filter items of new dates

	useEffect(() => {
		setDailyExpensesArr(
			existingDailyExpenses.filter(
				(element) => element.date.slice(0, 10) >= firstDayISO && element.date.slice(0, 10) <= lastDayISO
			)
		)
	}, [existingDailyExpenses, timePeriod, firstDayISO, lastDayISO])

	// CALCULATE TOTALS

	useEffect(() => {
		const calculateTotals = () => {
			const newMonthlyBudget = calculateTotalAmount(existingBudget.earnings) - calculateTotalAmount(existingBudget.expenses)
			const newDailyExpensesTotal = calculateTotalAmount(dailyExpensesArr)
			const newBudgetTotal = timePeriod === 'week' ? (newMonthlyBudget / 31) * 7 : newMonthlyBudget
			const newBudgetLeft = newBudgetTotal - newDailyExpensesTotal

			return { newMonthlyBudget, newDailyExpensesTotal, newBudgetLeft, newBudgetTotal }
		}
		const { newMonthlyBudget, newDailyExpensesTotal, newBudgetTotal, newBudgetLeft } = calculateTotals()

		setMonthlyBudget(newMonthlyBudget)
		setDailyExpensesTotal(newDailyExpensesTotal)
		setBudgetLeft(newBudgetLeft)
		setBudgetTotal(newBudgetTotal)
	}, [dailyExpensesArr, existingDailyExpenses, existingBudget])

	return (
		<BudgetContext.Provider
			value={{
				dataLoaded,
				timePeriod,
				currency,
				existingBudget,
				existingDailyExpenses,
				setExistingDailyExpenses,
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
