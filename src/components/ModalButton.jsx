import { useModal } from '../context/ModalContext'

function ModalButton({ children, ...props }) {
	const { handleOpen } = useModal()

	return (
		<button onClick={handleOpen} {...props}>
			{children}
		</button>
	)
}

export default ModalButton
