import axios from 'axios'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/auth.context'
import { API_URL } from '../config'
import { ReactComponent as IconUser } from '../assets/icons/icon-user.svg'
import { ReactComponent as IconEmail } from '../assets/icons/icon-email.svg'
import { ReactComponent as IconPassword } from '../assets/icons/icon-password.svg'

function FormSignup() {
	const [nameInput, setNameInput] = useState('')
	const [emailInput, setEmailInput] = useState('')
	const [passwordInput, setPasswordInput] = useState('')
	const navigate = useNavigate()
	const { setToken, setIsLoggedIn } = useContext(AuthContext)

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const { data } = await axios.post(`${API_URL}/auth/signup`, {
				name: nameInput,
				email: emailInput,
				password: passwordInput,
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
					<span className="input-group-text">
						<IconUser />
					</span>
					<input
						type="text"
						name="name"
						value={nameInput}
						placeholder="Name"
						onChange={(e) => setNameInput(e.target.value)}
					/>
				</div>
				<div className="input-group">
					<span className="input-group-text">
						<IconEmail />
					</span>
					<input
						type="email"
						name="email"
						value={emailInput}
						placeholder="Email"
						onChange={(e) => setEmailInput(e.target.value)}
					/>
				</div>
				<div className="input-group">
					<span className="input-group-text">
						<IconPassword />
					</span>
					<input
						type="password"
						name="password"
						value={passwordInput}
						placeholder="*********"
						onChange={(e) => setPasswordInput(e.target.value)}
					/>
				</div>
				<input type="submit" value="Sign up now" />
			</form>
		</>
	)
}

export default FormSignup
