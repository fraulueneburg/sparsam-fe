import React from 'react'
import IconGithub from '../assets/icons/icon-github.svg?react'

export default function Footer() {
	return (
		<>
			<footer className="site-footer">
				<small>
					built by{' '}
					<a href="https://github.com/fraulueneburg/" target="_blank" rel="noreferrer">
						Wiebke
					</a>{' '}
				</small>
				<a
					href="https://github.com/fraulueneburg/sparsam-fe"
					target="_blank"
					rel="noreferrer"
					aria-label="view the sparsam github repository">
					<IconGithub className="svg-icon icon-github" />
				</a>
			</footer>
		</>
	)
}
