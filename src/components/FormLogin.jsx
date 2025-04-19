import React from 'react'
import axios from 'axios'
import { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/auth.context'
import { API_URL } from '../config'
import IconEmail from '../assets/icons/icon-email.svg?react'
import IconPassword from '../assets/icons/icon-password.svg?react'
import Alert from './Alert'

export default function FormLogin(props) {
	const [emailInput, setEmailInput] = useState('')
	const [passwordInput, setPasswordInput] = useState('')
	const [errorMessage, setErrorMessage] = useState('')
	const navigate = useNavigate()
	const { setToken, authenticateUser, setIsLoggedIn } = useContext(AuthContext)

	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			const { data } = await axios.post(`${API_URL}/auth/login`, {
				email: emailInput,
				password: passwordInput,
			})

			const actualToken = data.authToken
			setToken(actualToken)
			authenticateUser()
			setIsLoggedIn(true)
			setEmailInput('')
			setPasswordInput('')
			setErrorMessage('')
			navigate('/budget')
		} catch (err) {
			err.response && err.response.status === 400
				? setErrorMessage('Wrong username or password.')
				: setErrorMessage('An unexpected error occurred. Please try again.')
			setEmailInput(emailInput)
			setPasswordInput('')
		}
	}

	return (
		<form onSubmit={handleSubmit} className={props.classes ? 'form-login ' + props.classes : 'form-login'}>
			{errorMessage ? (
				<Alert type="danger">
					<p id="login-error" className="text-error" role="alert" aria-live="polite">
						{errorMessage} Don’t have an account yet? <Link to="/auth/signup">Sign up now</Link>
					</p>
				</Alert>
			) : null}
			<div className="input-group">
				<span className="text">
					<IconEmail />
				</span>
				<input
					type="email"
					name="email"
					autoComplete="email"
					value={emailInput}
					placeholder="Email"
					onChange={(e) => setEmailInput(e.target.value)}
					aria-invalid={!!errorMessage ? true : null}
					aria-errormessage="#login-error"
				/>
			</div>
			<div className="input-group">
				<span className="text">
					<IconPassword />
				</span>
				<input
					type="password"
					name="password"
					autoComplete="current-password"
					value={passwordInput}
					placeholder="Password"
					onChange={(e) => setPasswordInput(e.target.value)}
					aria-invalid={!!errorMessage ? true : null}
					aria-errormessage="#login-error"
				/>
			</div>
			<input type="submit" value="Login" />
			<p style={{ textAlign: 'center' }}>
				<small>
					Don’t have an account yet? <Link to="/auth/signup">Sign up now</Link>
				</small>
			</p>
		</form>
	)
}
