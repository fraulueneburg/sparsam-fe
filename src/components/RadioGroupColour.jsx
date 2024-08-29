import { useId, useEffect, useRef } from 'react'
import { ReactComponent as IconChevronDown } from '../assets/icons/icon-chevron-down.svg'
import { ReactComponent as IconCheck } from '../assets/icons/icon-check.svg'

export default function RadioGroupColour(props) {
	const selectedColour = props.selectedValue
	const setSelectedColour = props.setNewSelectedValue
	const coloursArr = props.coloursArr
	const isColourListOpen = props.dropdownState
	const setIsColourListOpen = props.setDropdownState

	const idPrefix = useId()
	const listId = `${idPrefix}-colour-list`

	const buttonRef = useRef(null)
	const fieldsetRef = useRef(null)

	const handleToggleColourOptions = (event) => {
		event.preventDefault()
		setIsColourListOpen(!isColourListOpen)

		if (!isColourListOpen) {
			buttonRef.current.focus()
		}
	}

	// Close colour list when focus moves outside

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (fieldsetRef.current && !fieldsetRef.current.contains(event.target)) {
				setIsColourListOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('focusin', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('focusin', handleClickOutside)
		}
	}, [setIsColourListOpen])

	// Close colour list on esc

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === 'Escape' && isColourListOpen) {
				setIsColourListOpen(false)
				buttonRef.current.focus()
			}
		}
		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isColourListOpen, setIsColourListOpen])

	return (
		<fieldset className="radio-group radio-group-colour" ref={fieldsetRef}>
			<legend>Colour</legend>
			<strong className="sr-only" aria-live="polite">
				selected colour: {selectedColour}
			</strong>
			<button
				type="button"
				className="btn-inline btn-toggle-colours"
				onClick={handleToggleColourOptions}
				aria-label="toggle colour options"
				aria-controls={listId}
				aria-expanded={isColourListOpen}
				ref={buttonRef}>
				<div className="colour-option" style={{ color: `var(--color-${selectedColour})` }}></div>
				<IconChevronDown aria-hidden="true" />
			</button>
			<div className="colour-list" id={listId}>
				{coloursArr.map((elem) => {
					const uniqueId = `${idPrefix}-${elem.hue.slice(1)}`
					const isChecked = selectedColour === elem.name

					return (
						<label key={uniqueId} htmlFor={uniqueId} className={isChecked ? 'checked' : null}>
							<input
								id={uniqueId}
								type="radio"
								name="newColour"
								value={elem.name}
								checked={isChecked}
								onChange={() => setSelectedColour(elem.name)}
							/>
							<div className="colour-option" style={{ color: `var(--color-${elem.name})` }}>
								{selectedColour === elem.name ? <IconCheck aria-hidden="true" /> : null}
							</div>
							<span className="sr-only">{elem.name}</span>
						</label>
					)
				})}
			</div>
		</fieldset>
	)
}
