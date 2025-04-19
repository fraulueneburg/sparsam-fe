import React from 'react'
import { useContext } from 'react'
import { BudgetContext } from '../context/budget.context'
import { Link } from 'react-router-dom'

import TabsTimePeriod from '../components/TabsTimePeriod'
import PieChart from '../components/PieChart'
import TableDailyExpenses from '../components/TableDailyExpenses'
import gifGone from '../assets/img/gif-gone.gif'

export default function Budget() {
	const { dataLoaded, existingBudget, existingDailyExpenses } = useContext(BudgetContext)

	if (dataLoaded && (!existingBudget || (existingBudget.earnings?.length === 0 && existingDailyExpenses?.length === 0))) {
		return (
			<>
				<title>Budget | sparsam</title>
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
				<title>Budget | sparsam</title>
				<h1>Your Budget</h1>
				<TabsTimePeriod />
				<PieChart />
				<TableDailyExpenses />
			</>
		)
	}
}
