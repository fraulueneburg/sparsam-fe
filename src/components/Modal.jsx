import { useModal } from '../context/ModalContext'
import { ReactComponent as IconClose } from '../assets/icons/icon-close.svg'

function Modal(props) {
	const { modalIsOpen, handleClose } = useModal()

	const handleClickOverlay = (event) => {
		if (event.target === event.currentTarget) {
			handleClose(event)
		}
	}

	return (
		<dialog onClick={handleClickOverlay} open={modalIsOpen} className={props.modalClassName}>
			<article>
				<header>
					{props.title && <h3>{props.title}</h3>}
					<button aria-label="Close" rel="prev" className="btn-close" onClick={handleClose}>
						<IconClose />
					</button>
				</header>
				{(props.description || props.image) && (
					<section>
						{props.image && <img src={props.image} alt={props.alt} />}
						{props.description}
					</section>
				)}
				<footer>
					<button
						onClick={(e) => {
							props.onConfirm(e)
							handleClose(e)
						}}>
						{props.buttonLabel}
					</button>
					<button className="secondary" onClick={handleClose}>
						cancel
					</button>
				</footer>
			</article>
		</dialog>
	)
}

export default Modal
