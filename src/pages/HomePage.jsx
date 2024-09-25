import { Link } from 'react-router-dom'
import Tabs from '../components/Tabs'
import FormSignup from '../components/FormSignup'
import FormSignupDemo from '../components/FormSignupDemo'

export default function HomePage() {
	return (
		<>
			<title>Welcome | sparsam</title>
			<h1>Welcome to Sparsam</h1>
			<h2>An awesome budgeting app</h2>
			<div className="columns">
				<div className="column">
					<h3>
						Budgeting made easy. <br />
						Sign up and …
					</h3>
					<ul className="list-emoji">
						<li>
							<span className="emoji sr-hidden">💻&nbsp; </span>calculate your weekly budget
						</li>
						<li>
							<span className="emoji sr-hidden">🗒️&nbsp; </span>define custom spending categories
						</li>
						<li>
							<span className="emoji sr-hidden">🤓&nbsp; </span>see neat weekly/monthly overviews
						</li>
						<li>
							<span className="emoji sr-hidden">🍰&nbsp; </span>admire beautiful charts
						</li>
						<li>
							<span className="emoji sr-hidden">😻&nbsp; </span>chuckle at our edge case memes
						</li>
					</ul>
				</div>
				<div className="column">
					<Tabs
						tabs={[
							{
								label: 'Demo Signup',
								content: <FormSignupDemo />,
							},
							{
								label: 'Regular Signup',
								content: <FormSignup />,
							},
						]}
					/>
					<center>
						<small>
							Already have an account? <Link to="/auth/login">Login now</Link>
						</small>
					</center>
				</div>
			</div>
		</>
	)
}
