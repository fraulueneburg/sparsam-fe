import { useState, useContext } from 'react'
import { SettingsContext } from '../context/settings.context'
import { API_URL } from '../config'
import axios from 'axios'

import Alert from './../components/Alert'
import DropdownListCurrency from '../components/DropdownListCurrency'

export default function Currency() {
	const { currency, setCurrency, currenciesArr } = useContext(SettingsContext)
	const [currencyListIsOpen, setCurrencyListIsOpen] = useState(false)

	const handleUpdateCurrency = async (event) => {
		event.preventDefault()
		const gotToken = localStorage.getItem('authToken')
		const updatedCurrency = currenciesArr.find((elem) => elem.code === event.target.value)
		setCurrency(updatedCurrency)

		try {
			const response = await axios.post(
				`${API_URL}/budget/currency/update`,
				{ currency: updatedCurrency },
				{ headers: { authorization: `Bearer ${gotToken}` } }
			)
			setCurrency(response.data.currency)
		} catch (err) {
			console.log('Error while submitting new currency', err)
			setCurrency(currency)
		}
	}

	return (
		<>
			<h2>General</h2>
			<div className="grid">
				<label htmlFor="currency">Your currency</label>
				<DropdownListCurrency
					legend={'Currency'}
					listArr={currenciesArr}
					selectedValue={currency}
					setNewSelectedValue={handleUpdateCurrency}
					dropdownState={currencyListIsOpen}
					setDropdownState={setCurrencyListIsOpen}
				/>
			</div>
			<div className="grid">
				<label htmlFor="startday" className="disabled">
					budget week starts on
				</label>
				<select id="startday" defaultValue="5" disabled>
					<option value="5">Friday (default)</option>
					<option value="6">Saturday</option>
					<option value="0">Sunday</option>
					<option value="1">Monday</option>
					<option value="2">Tuesday</option>
					<option value="3">Wednesday</option>
					<option value="4">Thursday</option>
				</select>
			</div>
			<Alert
				type="success"
				content={
					<>
						<p>
							<strong>Tipp:</strong> Weekends are usually when we spend the most money. So we recommend starting your budget
							week on friday. You’ll be able to adapt this soon.
						</p>
					</>
				}
			/>
		</>
	)
}
