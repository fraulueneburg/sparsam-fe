import Alert from '../components/Alert'
import FormSignup from '../components/FormSignup'

export default function Signup() {
	return (
		<>
			<title>Signup | sparsam</title>
			<h1>Signup</h1>
			<Alert
				type="primary"
				content={
					<>
						<p>
							<strong>☝️ Coming soon:&nbsp;</strong>
							No-signup demo for anyone reviewing Wiebke’s portfolio.
							<br /> For now, just sign up with x@y.z or something. We won’t shame you, promise.
						</p>
					</>
				}
			/>
			<FormSignup />
		</>
	)
}
