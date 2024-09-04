import { useEffect, useState } from 'react'
import YourExpenses from '../components/YourExpenses'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { API_URL } from '../config'
import gifGone from '../assets/img/gif-gone.gif'

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
				console.log('Error while fetching budget:', err)
				setDataLoaded(true)
			}
		}
		fetchBudgetData()
	}, [])

	if (dataLoaded && (!existingBudget || (existingBudget.earnings.length === 0 && !existingDailyExpenses))) {
		return (
			<>
				<div className="card">
					<img
						src={gifGone}
						alt={`Movie Scene from Pulp Fiction: Vincent Vega turns around in confusion and makes a hand gesture, reacting to Mia Wallace's sudden disappearance.`}
					/>
					<h1>You don’t have a budget yet</h1>
					<p>Start by defining some monthly earnings, expenses and categories.</p>
					<Link to="/settings" className="btn-primary">
						Set up your budget now
					</Link>
				</div>
			</>
		)
	} else if (dataLoaded && existingBudget) {
		return (
			<>
				<h1>Your Budget</h1>
				<YourExpenses budgetData={existingBudget} dailyExpensesData={existingDailyExpenses} />
			</>
		)
	}
}

export default Budget
