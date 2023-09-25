function Alert(props) {
	const type = props.type
	const content = props.content

	return (
		<>
			<p className={type ? 'alert alert-' + type : 'alert'}>{content}</p>
		</>
	)
}

export default Alert
