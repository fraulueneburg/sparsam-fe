import React from 'react'
import { Link } from 'react-router-dom'

export default function CardEmpty(props) {
	const headline = props.headline
	const text = props.text
	const imgSrc = props.imgSrc
	const imgAlt = props.imgAlt || ''
	const imgPosition = props.imgPosition || 'top'
	const buttonText = props.buttonText
	const buttonLink = props.buttonLink

	return (
		<div className="card-empty-text">
			{imgSrc && imgPosition !== 'bottom' ? <img src={imgSrc} alt={imgAlt} width="300" /> : null}
			{headline ? <h4>{headline}</h4> : null}
			{text ? text : null}
			{buttonText && buttonLink ? (
				<Link className="btn-primary" to={buttonLink}>
					{buttonText}
				</Link>
			) : null}
			{imgSrc && imgPosition === 'bottom' ? <img src={imgSrc} alt={imgAlt} width="300" /> : null}
		</div>
	)
}
