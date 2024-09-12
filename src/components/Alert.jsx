export default function Alert(props) {
	const type = props.type
	const content = props.content

	return (
		<>
			<div className={type ? 'alert alert-' + type : 'alert'}>{content}</div>
		</>
	)
}
