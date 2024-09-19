import { createContext, useEffect, useState } from 'react'
import { API_URL } from '../config'
import axios from 'axios'
import currenciesArr from '../data/currencies.json'

import { calculateTotalAmount } from '../context/utils/utilityFunctions'

const SettingsContext = createContext()

const SettingsContextWrapper = ({ children }) => {
	const [existingBudget, setExistingBudget] = useState([])
	const [dataLoaded, setDataLoaded] = useState(false)

	const handleChange = (changeFunction) => (event) => {
		changeFunction(event.target.value)
	}

	const indexDefaultCurrency = currenciesArr.findIndex((elem) => elem.symbol === '€')
	const [currency, setCurrency] = useState(() => existingBudget.currency || currenciesArr[indexDefaultCurrency])

	const [earningsArr, setEarningsArr] = useState(existingBudget.earnings || [])
	const [earningsTotal, setEarningsTotal] = useState(calculateTotalAmount(earningsArr))
	const [expensesArr, setExpensesArr] = useState(existingBudget.expenses || [])
	const [expensesTotal, setExpensesTotal] = useState(calculateTotalAmount(expensesArr))
	const maxLengthTextInput = 70

	// FETCH BUDGET DATA

	const [monthlyBudget, setMonthlyBudget] = useState((earningsTotal - expensesTotal).toFixed(2))
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

					setEarningsTotal(calculateTotalAmount(budget.earnings))
					setExpensesTotal(calculateTotalAmount(budget.expenses))
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
		setMonthlyBudget((calculateTotalAmount(earningsArr) - calculateTotalAmount(expensesArr)).toFixed(2))
		setEarningsTotal(calculateTotalAmount(earningsArr))
		setExpensesTotal(calculateTotalAmount(expensesArr))
	}, [earningsArr, expensesArr])

	return (
		<SettingsContext.Provider
			value={{
				dataLoaded,
				handleChange,

				currency,
				setCurrency,
				currenciesArr,

				monthlyBudget,
				existingBudget,

				earningsArr,
				setEarningsArr,
				earningsTotal,
				expensesArr,
				setExpensesArr,
				expensesTotal,
				maxLengthTextInput,
			}}>
			{children}
		</SettingsContext.Provider>
	)
}

export { SettingsContext, SettingsContextWrapper }
