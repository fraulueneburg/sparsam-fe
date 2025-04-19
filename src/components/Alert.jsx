import React from 'react'

export default function Alert({ children, ...props }) {
	const { type } = props

	return (
		<>
			<div className={type ? 'alert alert-' + type : 'alert'}>{children}</div>
		</>
	)
}
