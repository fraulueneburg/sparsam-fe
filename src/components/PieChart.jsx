import React from 'react'
import { useContext, useRef, useEffect } from 'react'
import { BudgetContext } from '../context/budget.context'
import { Chart, ArcElement, CategoryScale, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import CardEmpty from './CardEmpty'
import noChartGif from '../assets/img/gif-gone.gif'
import coloursArr from '../data/colours_reduced.json'

Chart.register(CategoryScale, ArcElement, Tooltip, Legend)

export default function PieChart() {
	const chartRef = useRef(null)
	const { timePeriod, currency, dailyExpensesArr, categoriesArr, dailyExpensesTotal } = useContext(BudgetContext)

	const chartColorsArr = categoriesArr.map((category) => {
		const matchingColour = coloursArr.find((colour) => colour.name === category.colour)
		return matchingColour ? matchingColour.hue : '#2c3d49'
	})

	const chartCategoriesTotalArr = categoriesArr.map((category) =>
		dailyExpensesArr.reduce((acc, expense) => (expense.category === category._id ? acc + expense.amount : acc), 0)
	)

	const chartData = {
		labels: categoriesArr.map((category) => category.name),
		datasets: [
			{
				data: chartCategoriesTotalArr,
				backgroundColor: chartColorsArr,
				borderColor: '#11191f',
				borderWidth: 2,
			},
		],
	}

	const chartOptions = {
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
	}

	useEffect(() => {
		const chartInstance = chartRef.current?.chartInstance
		return () => {
			if (chartInstance) {
				chartInstance.destroy()
			}
		}
	}, [])

	return timePeriod !== 'month' ? null : (
		<>
			<section>
				<h2>Budget spent by Category:</h2>
				<div className="columns is-vcentered">
					<div className="column chart-container">
						{dailyExpensesTotal <= 0 ? (
							<div className="card">
								<CardEmpty
									imgSrc={noChartGif}
									headline={'No chart to display.'}
									text={
										<p>
											Wow. You spent 0,00{currency} this {timePeriod}.<br />
											Good job. But also: Are you sure? 🤔
										</p>
									}
								/>
							</div>
						) : (
							<Pie ref={chartRef} data={chartData} options={chartOptions} />
						)}
					</div>
					{chartCategoriesTotalArr?.length > 0 ? (
						<div className="column chart-legend">
							<table>
								<thead>
									<tr>
										<th>Category</th>
										<th style={{ textAlign: 'right' }}>Total</th>
									</tr>
								</thead>
								<tbody>
									{chartCategoriesTotalArr
										? chartCategoriesTotalArr.map((elem, index) => {
												return (
													<tr className={elem > 0 ? null : 'greyed-out'} key={index}>
														<td>
															<div className="color-indicator" style={{ backgroundColor: chartColorsArr[index] }}></div>{' '}
															<div className="text">{categoriesArr[index].name}</div>
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
											{chartCategoriesTotalArr
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
					) : null}
				</div>
			</section>
		</>
	)
}
