import axios from 'axios'
import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/auth.context'
import { API_URL } from '../config'
import { ReactComponent as IconUser } from '../assets/icons/icon-user.svg'
import { ReactComponent as IconEmail } from '../assets/icons/icon-email.svg'
import { ReactComponent as IconPassword } from '../assets/icons/icon-password.svg'

function ProfilePage() {
	const [nameInput, setNameInput] = useState()
	const [emailInput, setEmailInput] = useState('')
	const [passwordInput, setPasswordInput] = useState('')
	const { setToken, setIsLoggedIn, logOutUser } = useContext(AuthContext)

	const navigate = useNavigate()

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const gotToken = localStorage.getItem('authToken')
				const resp = await axios.get(`${API_URL}/auth/profile`, {
					headers: { authorization: `Bearer ${gotToken}` },
				})

				setNameInput(resp.data.userNeeded.name)
				setEmailInput(resp.data.userNeeded.email)
			} catch (err) {
				console.log(err)
			}
		}
		fetchUserData()
	}, [])

	const handleSubmit = async (e) => {
		e.preventDefault()
		const gotToken = localStorage.getItem('authToken')
		try {
			const edit = await axios.post(
				`${API_URL}/auth/profile`,
				{
					name: nameInput,
					email: emailInput,
					password: passwordInput,
				},
				{ headers: { authorization: `Bearer ${gotToken}` } }
			)
			setNameInput(edit.data.updatedUser.name)
			setEmailInput(edit.data.updatedUser.email)
			setPasswordInput('')

			e.target.classList.add('is-saved')
			setTimeout(() => {
				e.target.classList.remove('is-saved')
			}, 5000)
		} catch (err) {
			console.log('THIS IS THE ERR', err)
			setNameInput('')
			setEmailInput('')
			setPasswordInput('')
		}
	}

	const handleDelete = async (e) => {
		e.preventDefault()
		const gotToken = localStorage.getItem('authToken')

		try {
			await axios.delete(
				`${API_URL}/auth/profile/delete`,

				{
					headers: { authorization: `Bearer ${gotToken}` },
				}
			)

			logOutUser()
			navigate('/')
		} catch (err) {
			console.log('DELETE USER ERROR', err)
		}
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				<h1>My Profile</h1>
				<div className="input-group">
					<span className="input-group-text">
						<IconUser />
					</span>
					<input
						type="text"
						name="name"
						value={nameInput}
						placeholder="Edit Name"
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
						autoComplete="username"
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
						autoComplete="current-password"
						required
					/>
				</div>
				<button type="submit">save</button>
			</form>
			<button className="btn-delete" type="submit" onClick={handleDelete}>
				delete
			</button>
		</>
	)
}

export default ProfilePage
