function Alert(props) {
	const type = props.type
	const content = props.content

	return (
		<>
			<small class={type ? 'alert alert-' + type : 'alert'}>{content}</small>
		</>
	)
}

export default Alert
