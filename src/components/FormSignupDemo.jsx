import React from 'react'
import axios from 'axios'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/auth.context'
import { API_URL } from '../config'

import currenciesArr from '../data/currencies.json'
import Spinner from './Spinner'

export default function FormSignupDemo() {
	const { setToken, setIsLoggedIn } = useContext(AuthContext)
	const [isLoading, setIsLoading] = useState(false)
	const navigate = useNavigate()
	const indexDefaultCurrency = currenciesArr.findIndex((elem) => elem.symbol === '€')

	const handleRecruiterSubmit = async (e) => {
		setIsLoading((prev) => !prev)
		setIsLoading(true)
		e.preventDefault()
		try {
			const { data } = await axios.post(`${API_URL}/auth/one-click-signup`, {
				currency: currenciesArr[indexDefaultCurrency],
			})
			const actualToken = data.authToken
			setToken(actualToken)
			setIsLoggedIn(true)

			setIsLoading(false)
			navigate('/budget')
		} catch (err) {
			console.log('Error during no-signup signup:', err)
		}
		setIsLoading(false)
	}

	return (
		<>
			<p>A one-click, no-hassle solution for anyone reviewing Wiebke’s portfolio</p>
			<ul className="text-list">
				<li>instant login</li>
				<li>pre-filled with dummy data</li>
				<li>account self-deletes after 24h</li>
			</ul>
			<button type="button" onClick={handleRecruiterSubmit}>
				<span>One-Click Demo Signup</span>
				{isLoading ? <Spinner /> : null}
			</button>
		</>
	)
}
