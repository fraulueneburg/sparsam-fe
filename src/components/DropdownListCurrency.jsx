import React from 'react'
import { useId, useState, useEffect, useMemo, useRef } from 'react'
import IconChevronDown from '../assets/icons/icon-chevron-down.svg?react'
import IconGlobe from '../assets/icons/icon-globe.svg?react'

export default function DropdownListCurrency({
	legend,
	selectedValue,
	setNewSelectedValue,
	listArr,
	dropdownState: isListOpen,
	setDropdownState: setIsListOpen,
	...props
}) {
	const idPrefix = useId()
	const listId = `${idPrefix}-radio-group`
	const buttonRef = useRef(null)
	const fieldsetRef = useRef(null)
	const searchInputRef = useRef(null)
	const [searchQuery, setSearchQuery] = useState('')

	const filteredList = useMemo(() => {
		const lowerCaseQuery = searchQuery.toLowerCase()
		return listArr.filter(
			(elem) => elem.name.toLowerCase().includes(lowerCaseQuery) || elem.code.toLowerCase().includes(lowerCaseQuery)
		)
	}, [searchQuery, listArr])

	const handleToggleListOptions = (event) => {
		event.preventDefault()
		setIsListOpen((prevState) => !prevState)
	}

	useEffect(() => {
		if (!isListOpen) {
			setSearchQuery('')
		}
	}, [isListOpen])

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
		<fieldset className="radio-group" ref={fieldsetRef}>
			<div className="dropdown-list-option-content" aria-live="polite">
				<div
					aria-hidden={true}
					className={
						selectedValue.flag && typeof selectedValue.flag === 'string' && selectedValue.flag.length === 2
							? `fi fi-${selectedValue.flag.toLowerCase()} fis`
							: `fi fi-no-flag fis`
					}>
					{selectedValue.flag && typeof selectedValue.flag === 'string' && selectedValue.flag.length === 2 ? null : (
						<IconGlobe />
					)}
				</div>
				<div className="left">
					<span className="sr-only">selected currency:</span>
					{selectedValue.name}
					<br />
					<small>{selectedValue.code}</small>
				</div>
				<div className="right">{selectedValue.symbol}</div>
			</div>
			<button
				type="button"
				className="btn-inline btn-toggle-list"
				onClick={handleToggleListOptions}
				aria-label={`toggle ${legend.toLowerCase()} list`}
				aria-controls={listId}
				aria-expanded={isListOpen}
				ref={buttonRef}>
				<IconChevronDown aria-hidden="true" />
			</button>
			<div className="dropdown-list" id={listId}>
				<div className="dropdown-list-livesearch">
					<input
						type="search"
						value={searchQuery}
						aria-label="Search for a currency or country"
						placeholder="Search for a currency or country"
						onChange={(e) => setSearchQuery(e.target.value)}
						ref={searchInputRef}
					/>
				</div>
				<div className="dropdown-list-option-list">
					{filteredList.map((elem, index) => {
						const uniqueId = `${idPrefix}-${index}`
						const isChecked = selectedValue.code === elem.code

						return (
							<label key={uniqueId} htmlFor={uniqueId} className={isChecked ? 'checked' : null}>
								<input
									type="radio"
									id={uniqueId}
									className={isChecked ? 'checked' : null}
									checked={isChecked}
									value={elem.code}
									onChange={setNewSelectedValue}
								/>
								<div className="dropdown-list-option-content">
									<div
										aria-hidden={true}
										className={
											elem.flag && typeof elem.flag === 'string' && elem.flag.length === 2
												? `fi fi-${elem.flag.toLowerCase()} fis`
												: `fi fi-no-flag fis`
										}>
										{elem.flag && typeof elem.flag === 'string' && elem.flag.length === 2 ? null : <IconGlobe />}
									</div>
									<div className="left">
										{elem.name}
										<br />
										<small>{elem.code}</small>
									</div>
									<div className="right">{elem.symbol}</div>
								</div>
							</label>
						)
					})}
				</div>
			</div>
		</fieldset>
	)
}
