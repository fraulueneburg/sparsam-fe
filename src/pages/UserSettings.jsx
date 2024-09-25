import axios from 'axios'
import { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/auth.context'
import { API_URL } from '../config'
import { ReactComponent as IconUser } from '../assets/icons/icon-user.svg'
import { ReactComponent as IconEmail } from '../assets/icons/icon-email.svg'
import { ReactComponent as IconPassword } from '../assets/icons/icon-password.svg'
import { ModalProvider } from '../context/modal.context'
import ModalButton from '../components/ModalButton'
import Modal from '../components/Modal'
import cryingGif from '../assets/img/gif-crying.gif'
import Alert from '../components/Alert'

export default function UserSettings() {
	const [nameInput, setNameInput] = useState('')
	const [emailInput, setEmailInput] = useState('')
	const [passwordInput, setPasswordInput] = useState('')
	const [isTemporaryAccount, setIsTemporaryAccount] = useState(false)
	const { logOutUser } = useContext(AuthContext)

	const navigate = useNavigate()

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const gotToken = localStorage.getItem('authToken')
				const response = await axios.get(`${API_URL}/auth/profile`, {
					headers: { authorization: `Bearer ${gotToken}` },
				})

				const { name, email, isTemporary, createdAt } = response.data.userNeeded

				setNameInput(name)
				setEmailInput(email)
				setIsTemporaryAccount(isTemporary)
				console.log('createdAt', createdAt)
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
			navigate('/profile-deleted')
		} catch (err) {
			console.log('DELETE USER ERROR', err)
		}
	}

	return (
		<>
			<title>User Settings</title>
			<h1>User Settings</h1>
			{isTemporaryAccount ? (
				<Alert type="success">
					<p>
						You are using a demo account which will be deleted in less than <strong>24 hours.</strong> <br />
						If you fancy a permanent account, <Link to="/auth/signup">sign up here.</Link>
					</p>
				</Alert>
			) : null}
			<form onSubmit={handleSubmit} className="edit-profile">
				<div className="input-group">
					<span className="text">
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
					<span className="text">
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
					<span className="text">
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
			<ModalProvider>
				<ModalButton className="btn-delete">delete profile</ModalButton>
				<Modal
					modalClassName="modal-delete"
					title="Are you sure?"
					description={
						<>
							<p>
								{`Oh, ${nameInput}, we hate to see you go.`}
								<br />
								{`But, no worries. As long as you’re happy, we’re happy.`}
								<br />
								{`Click the button below to delete your profile for good.`}
							</p>
						</>
					}
					image={cryingGif}
					alt="A crying man in a suit dabbs away tears with a wad of banknotes"
					onConfirm={handleDelete}
					buttonLabel={'delete profile'}
				/>
			</ModalProvider>
		</>
	)
}
