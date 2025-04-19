import React from 'react'
import { useId, useEffect, useRef } from 'react'
import IconChevronDown from '../assets/icons/icon-chevron-down.svg?react'
import IconCheck from '../assets/icons/icon-check.svg?react'

export default function DropdownListColour(props) {
	const label = props.label
	const selectedColour = props.selectedValue
	const setSelectedColour = props.setNewSelectedValue
	const coloursArr = props.coloursArr
	const isListOpen = props.dropdownState
	const setIsListOpen = props.setDropdownState

	const idPrefix = useId()
	const listId = `${idPrefix}-colour-list`

	const buttonRef = useRef(null)
	const fieldsetRef = useRef(null)

	const handleToggleColourOptions = (event) => {
		event.preventDefault()
		setIsListOpen((prevState) => !prevState)
	}

	// Close list when focus moves outside
	// Close list on esc

	const handleClickOutside = (event) => {
		if (fieldsetRef.current && !fieldsetRef.current.contains(event.target)) {
			setIsListOpen(false)
		}
	}

	const handleKeyDown = (event) => {
		if (event.key === 'Escape' && isListOpen) {
			setIsListOpen(false)
			if (buttonRef.current) buttonRef.current.focus()
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('focusin', handleClickOutside)
		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('focusin', handleClickOutside)
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isListOpen, setIsListOpen])

	return (
		<fieldset className="radio-group radio-group-colour" ref={fieldsetRef}>
			<legend className="hidden">{label}</legend>
			<strong className="sr-only" aria-live="polite">
				selected colour: {selectedColour}
			</strong>
			<button
				type="button"
				className="btn-inline btn-toggle-colours"
				onClick={handleToggleColourOptions}
				aria-label="toggle colour options"
				aria-controls={listId}
				aria-expanded={isListOpen}
				ref={buttonRef}>
				<div className="colour-option" style={{ color: `var(--color-${selectedColour})` }}></div>
				<IconChevronDown aria-hidden="true" />
			</button>
			<div className="dropdown-list colour-list" id={listId}>
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
