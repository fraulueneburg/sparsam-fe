import Alert from '../components/Alert'
import FormLogin from '../components/FormLogin'
import cuteDog from '../assets/cute-dog.jpg'

function HomePage() {
	return (
		<>
			<h1>Welcome to Sparsam</h1>
			<h2>An awesome budgeting app with a cute dog on its cover</h2>
			<Alert
				content={
					<>
						<strong>
							Coming <u>so</u> soon:
						</strong>
						Demo Login for anyone reviewing Wiebke’s portfolio.
						<br /> For now, just sign up with x@y.z or something. We won’t shame you, promise.
					</>
				}
			/>
			<div className="columns">
				<div className="column">
					<img src={cuteDog} alt="" />
				</div>
				<div className="column">
					<FormLogin />
				</div>
			</div>
		</>
	)
}

export default HomePage
