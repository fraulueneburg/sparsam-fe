import React from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { BudgetContext } from '../context/budget.context'
import IconChevronLeft from '../assets/icons/icon-chevron-left.svg?react'
import IconChevronRight from '../assets/icons/icon-chevron-right.svg?react'

export default function TabsTimePeriod() {
	const {
		timePeriod,
		currency,
		budgetLeft,
		budgetTotal,
		isCurrentTime,
		firstDayISO,
		lastDayISO,
		writeOutDate,
		numOfItemsToNavigate,
		setNumOfItemsToNavigate,
	} = useContext(BudgetContext)

	const navigate = useNavigate()

	return (
		<>
			<section>
				<div className={`card card-tabs card-budget ${timePeriod}-active`}>
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
						<big
							className={
								budgetLeft === 0 || budgetLeft?.toFixed(2) === '-0.00' || budgetLeft?.toFixed(2) === '0.00'
									? 'is-zero'
									: budgetLeft < 0 && budgetLeft?.toFixed(2) !== '-0.00'
									? 'is-negative'
									: ''
							}>
							{budgetLeft?.toFixed(2) === '-0.00' ? '0.00' : budgetLeft?.toFixed(2)} {currency}
						</big>
						of {budgetTotal?.toFixed(2)} {currency}
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
		</>
	)
}
