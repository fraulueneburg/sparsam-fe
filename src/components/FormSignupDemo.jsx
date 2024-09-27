import axios from 'axios'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/auth.context'
import { API_URL } from '../config'

import currenciesArr from '../data/currencies.json'

export default function FormSignupDemo() {
	const { setToken, setIsLoggedIn } = useContext(AuthContext)
	const navigate = useNavigate()
	const indexDefaultCurrency = currenciesArr.findIndex((elem) => elem.symbol === '€')

	const handleRecruiterSubmit = async (e) => {
		e.preventDefault()
		try {
			const { data } = await axios.post(`${API_URL}/auth/one-click-signup`, {
				currency: currenciesArr[indexDefaultCurrency],
			})

			const actualToken = data.authToken
			setToken(actualToken)
			setIsLoggedIn(true)
			navigate('/budget')
		} catch (err) {
			console.log('Error during no-signup signup:', err)
		}
	}

	return (
		<>
			<p>A one-click, no-hassle solution for anyone reviewing Wiebke’s portfolio:</p>
			<ul className="text-list">
				<li>instant login</li>
				<li>prefilled with dummy data</li>
				<li>account self-deletes after 24h</li>
			</ul>
			<button type="button" onClick={handleRecruiterSubmit}>
				One-Click Demo Signup
			</button>
		</>
	)
}
