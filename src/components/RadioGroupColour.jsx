import { useId } from 'react'
import { ReactComponent as IconChevronDown } from '../assets/icons/icon-chevron-down.svg'
import { ReactComponent as IconCheck } from '../assets/icons/icon-check.svg'

export default function RadioGroupColour(props) {
	const selectedColour = props.selectedValue
	const setSelectedColour = props.setNewSelectedValue
	const coloursArr = props.coloursArr
	const dropdownState = props.dropdownState
	const setDropdownState = props.setDropdownState

	const idPrefix = useId()
	const listId = `${idPrefix}-colour-list`

	const handleToggleColourOptions = (event) => {
		event.preventDefault()
		setDropdownState(!dropdownState)
	}

	return (
		<fieldset className="radio-group radio-group-colour">
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
				aria-expanded={dropdownState}>
				<div className="colour-option" style={{ color: `var(--color-${selectedColour})` }}></div>
				<IconChevronDown aria-hidden="true" />
			</button>
			<div className="colour-list" id={listId}>
				{coloursArr.map((elem) => {
					const uniqueId = `${idPrefix}-${elem.hue.slice(1)}`

					return (
						<label key={uniqueId} htmlFor={uniqueId} className={selectedColour === elem.name ? 'checked' : null}>
							<input
								id={uniqueId}
								type="radio"
								name="newColour"
								value={elem.name}
								checked={selectedColour === elem.name}
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
