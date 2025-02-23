import axios from 'axios'
import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/auth.context'
import { API_URL } from '../config'

import currenciesArr from '../data/currencies.json'
import { ReactComponent as IconUser } from '../assets/icons/icon-user.svg'
import { ReactComponent as IconEmail } from '../assets/icons/icon-email.svg'
import { ReactComponent as IconPassword } from '../assets/icons/icon-password.svg'

export default function FormSignup() {
	const { setToken, setIsLoggedIn } = useContext(AuthContext)
	const navigate = useNavigate()
	const indexDefaultCurrency = currenciesArr.findIndex((elem) => elem.symbol === '€')

	const [nameInput, setNameInput] = useState('')
	const [emailInput, setEmailInput] = useState('')
	const [passwordInput, setPasswordInput] = useState('')

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const { data } = await axios.post(`${API_URL}/auth/signup`, {
				name: nameInput,
				email: emailInput,
				password: passwordInput,
				currency: currenciesArr[indexDefaultCurrency],
			})

			const actualToken = data.authToken
			setToken(actualToken)

			setIsLoggedIn(true)
			setNameInput('')
			setEmailInput('')
			setPasswordInput('')
			navigate('/budget')
		} catch (err) {
			console.log('im in the catch block')
			console.log('THIS IS THE ERR', err)
			setNameInput('')
			setEmailInput('')
			setPasswordInput('')
		}
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				<div className="input-group">
					<span className="text">
						<IconUser />
					</span>
					<input
						type="text"
						name="name"
						value={nameInput}
						placeholder="Name"
						onChange={(e) => setNameInput(e.target.value)}
						autoComplete="username"
						required
					/>
				</div>
				<div className="input-group">
					<span className="text">
						<IconEmail />
					</span>
					<input
						type="email"
						name="email"
						value={emailInput}
						placeholder="Email"
						autoComplete="email"
						onChange={(e) => setEmailInput(e.target.value)}
						required
					/>
				</div>
				<div className="input-group">
					<span className="text">
						<IconPassword />
					</span>
					<input
						type="password"
						name="password"
						value={passwordInput}
						placeholder="*********"
						autoComplete="new-password"
						onChange={(e) => setPasswordInput(e.target.value)}
						required
					/>
				</div>
				<input type="submit" value="Sign up and login" />
			</form>
			<p style={{ textAlign: 'center' }}>
				<small>
					Already have an account? <Link to="/auth/login">Login now</Link>
				</small>
			</p>
		</>
	)
}
