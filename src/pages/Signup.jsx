import Alert from '../components/Alert'
import FormSignup from '../components/FormSignup'

function Signup() {
	return (
		<>
			<h1>Sign up</h1>
			<Alert
				type="primary"
				content={
					<>
						<strong>☝️ Coming soon:&nbsp;</strong>
						No-signup demo for anyone reviewing Wiebke’s portfolio.
						<br /> For now, just sign up with x@y.z or something. We won’t shame you, promise.
					</>
				}
			/>
			<FormSignup />
		</>
	)
}

export default Signup
