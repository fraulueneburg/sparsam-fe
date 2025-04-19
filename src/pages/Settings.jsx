import React from 'react'
import { useContext } from 'react'

import Expenses from '../components/Expenses'
import Earnings from '../components/Earnings'
import NavAnchor from './../components/NavAnchor'
import Categories from '../components/Categories'
import Currency from '../components/Currency'
import { SettingsContext } from '../context/settings.context'

export default function Settings() {
	const { currency, dataLoaded, monthlyBudget, existingBudget } = useContext(SettingsContext)

	const navLinksArr = [
		{ title: 'General', to: '#general', end: true },
		{ title: 'Earnings', to: '#earnings', end: true },
		{ title: 'Expenses', to: '#expenses', end: true },
		{ title: 'Categories', to: '#categories', end: true },
	]

	if (dataLoaded) {
		return (
			<>
				<title>Settings | sparsam</title>
				<div className="columns">
					<aside className="column is-3">
						<NavAnchor links={navLinksArr} />
					</aside>
					<div className="column is-9">
						<h1>Settings</h1>
						<p>Add your monthly earnings, expenses and spending categories here:</p>
						<section id="general" className="section-settings">
							<Currency />
						</section>
						<section id="earnings" className="section-settings">
							<Earnings />
						</section>
						<section id="expenses" className="section-settings">
							<Expenses />
						</section>
						<section className="section-settings">
							<h2>Monthly Budget</h2>
							<big>
								{monthlyBudget} <span className="currency">{currency.symbol}</span>
							</big>
						</section>
						<Categories data={existingBudget} />
					</div>
				</div>
			</>
		)
	} else {
		return <>loading</>
	}
}
