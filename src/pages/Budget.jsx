import { useEffect, useState } from 'react'
import YourExpenses from '../components/YourExpenses'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { API_URL } from '../config'

function Budget() {
	const [existingBudget, setExistingBudget] = useState([])
	const [dataLoaded, setDataLoaded] = useState(false)
	const [existingDailyExpenses, setExistingDailyExpenses] = useState([])

	useEffect(() => {
		const fetchBudgetData = async () => {
			try {
				const gotToken = localStorage.getItem('authToken')
				const resp = await axios.get(`${API_URL}/budget`, {
					headers: { authorization: `Bearer ${gotToken}` },
				})
				setExistingDailyExpenses(resp.data.respDailyExpenses)
				setExistingBudget(resp.data.respMonthlyBudget)
				setDataLoaded(true)
			} catch (err) {
				console.log('catch block error:', err)
			}
		}
		fetchBudgetData()
	}, [])

	if (!dataLoaded || !existingBudget) {
		return (
			<>
				<h1>You don’t have a budget yet</h1>
				<Link to="/settings">Set up your budget now</Link>
			</>
		)
	} else {
		return (
			<>
				<h1>Your Budget</h1>
				<YourExpenses budgetData={existingBudget} dailyExpensesData={existingDailyExpenses} />
			</>
		)
	}
}

export default Budget
