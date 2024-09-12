import highFiveGif from '../assets/img/gif-high-five.gif'
import { useNavigate } from 'react-router-dom'

export default function ProfileDeleted() {
	const navigate = useNavigate()
	const handleBackToHome = () => {
		navigate('/')
	}

	return (
		<>
			<h1>High Five!</h1>
			<h2 style={{ marginBottom: '1rem' }}>
				Your profile was successfully deleted.
				<br />
				Hope to see you again soon.
			</h2>
			<img src={highFiveGif} alt="A smiling woman giving herself a high five" style={{ marginBottom: '2rem' }} />
			<button onClick={handleBackToHome} className="btn-centered btn-inline">
				back to homepage
			</button>
		</>
	)
}
