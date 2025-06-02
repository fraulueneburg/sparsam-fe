import React from 'react'
import axios from 'axios'
import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/auth.context'
import { API_URL } from '../config'

import currenciesArr from '../data/currencies.json'
import IconUser from '../assets/icons/icon-user.svg?react'
import IconEmail from '../assets/icons/icon-email.svg?react'
import IconPassword from '../assets/icons/icon-password.svg?react'
import Spinner from './Spinner'
import Alert from './Alert'

export default function FormSignup() {
	const { setToken, setIsLoggedIn } = useContext(AuthContext)
	const navigate = useNavigate()
	const indexDefaultCurrency = currenciesArr.findIndex((elem) => elem.symbol === '€')
	const [isLoading, setIsLoading] = useState(false)

	const [nameInput, setNameInput] = useState('')
	const [emailInput, setEmailInput] = useState('')
	const [passwordInput, setPasswordInput] = useState('')
	const [errorMessage, setErrorMessage] = useState('')

	const handleSubmit = async (e) => {
		setIsLoading(true)
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

			setIsLoading(false)
			navigate('/budget')
		} catch (err) {
			console.log('THIS IS THE ERR', err)
			setNameInput('')
			setEmailInput('')
			setPasswordInput('')
			setIsLoading(false)

			err.response && err.response.status === 400
				? setErrorMessage('Wrong username or password.')
				: setErrorMessage('An unexpected error occurred. Please try again.')
			setNameInput(nameInput)
			setEmailInput(emailInput)
			setPasswordInput('')
			setIsLoading(false)
		}
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				{errorMessage ? (
					<Alert type="danger">
						<p id="login-error" className="text-error" role="alert" aria-live="polite">
							{errorMessage} Don’t have an account yet? <Link to="/auth/signup">Sign up now</Link>
						</p>
					</Alert>
				) : null}
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
						aria-invalid={!!errorMessage ? true : null}
						aria-errormessage="#login-error"
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
						aria-invalid={!!errorMessage ? true : null}
						aria-errormessage="#login-error"
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
						aria-invalid={!!errorMessage ? true : null}
						aria-errormessage="#login-error"
						required
					/>
				</div>
				<button type="submit">
					Sign up and login
					{isLoading ? <Spinner /> : null}
				</button>
			</form>
			<p style={{ textAlign: 'center' }}>
				<small>
					Already have an account? <Link to="/auth/login">Login now</Link>
				</small>
			</p>
		</>
	)
}
