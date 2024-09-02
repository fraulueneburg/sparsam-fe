import { useModal } from '../context/ModalContext'
import { ReactComponent as IconClose } from '../assets/icons/icon-close.svg'

export default function Modal(props) {
	const { modalIsOpen, handleClose } = useModal()

	const handleClickOverlay = (event) => {
		if (event.target === event.currentTarget) {
			console.log('props.onCancel', props.onCancel)
			handleClose(event)
			props.onCancel && props.onCancel(event)
		}
	}

	return (
		<dialog onClick={handleClickOverlay} open={props.modalIsOpen || modalIsOpen} className={props.modalClassName}>
			<article>
				<header>
					{props.title && <h3>{props.title}</h3>}
					<button
						aria-label="Close"
						rel="prev"
						className="btn-close"
						onClick={(e) => {
							props.onCancel && props.onCancel(e)
							handleClose(e)
						}}>
						<IconClose />
					</button>
				</header>
				{(props.description || props.image) && (
					<section>
						{props.image && <img src={props.image} alt={props.alt} />}
						{props.description}
					</section>
				)}
				{props.buttonLabel ? (
					<footer>
						<button
							onClick={(e) => {
								props.onConfirm(e)
								handleClose(e)
							}}>
							{props.buttonLabel}
						</button>
					</footer>
				) : null}
			</article>
		</dialog>
	)
}
