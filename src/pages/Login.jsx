import Alert from '../components/Alert'
import FormLogin from '../components/FormLogin'

function Login() {
	return (
		<>
			<h1>Login</h1>
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
			<FormLogin />
		</>
	)
}

export default Login
