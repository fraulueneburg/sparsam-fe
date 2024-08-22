import Alert from '../components/Alert'
import FormSignup from '../components/FormSignup'

function HomePage() {
	return (
		<>
			<h1>Welcome to Sparsam</h1>
			<h2>An awesome budgeting app</h2>
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
			<div className="columns">
				<div className="column">
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
					<FormSignup />
				</div>
			</div>
		</>
	)
}

export default HomePage
