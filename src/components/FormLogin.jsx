import axios from 'axios'
import { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/auth.context'
import { API_URL } from '../config'
import { ReactComponent as IconEmail } from '../assets/icons/icon-email.svg'
import { ReactComponent as IconPassword } from '../assets/icons/icon-password.svg'

function FormLogin(props) {
	const [emailInput, setEmailInput] = useState('')
	const [passwordInput, setPasswordInput] = useState('')
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
			navigate('/budget')
		} catch (err) {
			console.log('catch block err', err)
			setEmailInput('')
			setPasswordInput('')
		}
	}

	return (
		<form onSubmit={handleSubmit} className={props.classes ? 'form-login ' + props.classes : 'form-login'}>
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
					placeholder="*********"
					onChange={(e) => setPasswordInput(e.target.value)}
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

export default FormLogin
