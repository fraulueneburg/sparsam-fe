import React from 'react'
import { useEffect, useState } from 'react'
import { API_URL } from '../config'
import axios from 'axios'
import { ModalProvider } from '../context/modal.context'
import Modal from './Modal'
import IconMinus from '../assets/icons/icon-minus.svg?react'
import IconEdit from '../assets/icons/icon-edit.svg?react'
import IconClose from '../assets/icons/icon-close.svg?react'
import IconCheck from '../assets/icons/icon-check.svg?react'
import IconXCircle from '../assets/icons/icon-x-circle.svg?react'
import DropdownListColour from './DropdownListColour'
import coloursArr from '../data/colours_reduced.json'
import noCategoriesGif from '../assets/img/gif-no-categories.webp'
import CardEmpty from './CardEmpty'
import Alert from './Alert'

export default function Categories(props) {
	const existingBudget = props.data
	const currency = props.data.currency?.symbol
	const [categoriesArr, setCategoriesArr] = useState([])
	const maxNumOfCategories = 24

	useEffect(() => {
		setCategoriesArr(existingBudget.categories)
	}, [existingBudget])

	// GENERAL

	const startTransition = (callback) => {
		if (document.startViewTransition) {
			document.startViewTransition(callback)
		} else {
			callback()
		}
	}

	// EDIT CATEGORY

	const [editCategoryId, setEditCategoryId] = useState('')
	const [editCategoryName, setEditCategoryName] = useState('')
	const [editCategoryColour, setEditCategoryColour] = useState('')
	const [editCategoryColourListIsOpen, setEditCategoryColourListIsOpen] = useState(false)
	const [editCategoryNameError, setEditCategoryNameError] = useState('')

	const handleChangeEditCategoryName = (event, index) => {
		const newValue = event.target.value
		setEditCategoryName(newValue)

		// ERROR IF NAME ALREADY EXISTS
		const checkDuplicatesArray = categoriesArr.toSpliced(index, 1)
		const isDuplicate = checkDuplicatesArray.some((category) => category.name.toLowerCase() === newValue.toLowerCase())
		isDuplicate ? setEditCategoryNameError(true) : setEditCategoryNameError('')
	}

	const handleEditCategory = (id, name, colour) => {
		startTransition(() => {
			setEditCategoryId(id)
			setEditCategoryName(name)
			setEditCategoryColour(colour)
		})
	}

	const handleCancelEditCategory = (event) => {
		event.preventDefault()
		startTransition(() => {
			setEditCategoryId('')
			setEditCategoryName('')
			setEditCategoryColour('')
			setEditCategoryColourListIsOpen(false)
		})
	}

	useEffect(() => {
		const nextColourIndex = categoriesArr?.length % coloursArr.length || 0
		setNewCategoryColour(coloursArr[nextColourIndex].name)
		setEditCategoryColourListIsOpen(false)
		setNewCategoryColourListIsOpen(false)
	}, [categoriesArr])

	// UPDATE CATEGORY

	const handleUpdateCategory = async (event) => {
		event.preventDefault()
		const gotToken = localStorage.getItem('authToken')
		const updatedCategory = { _id: editCategoryId, name: editCategoryName, colour: editCategoryColour }
		const itemIndex = categoriesArr.findIndex((elem) => elem._id === updatedCategory._id)
		const newArr = [...categoriesArr]
		newArr[itemIndex] = updatedCategory
		setCategoriesArr(newArr)
		setEditCategoryId('')
		setEditCategoryName('')
		setEditCategoryColour('')

		try {
			const response = await axios.post(
				`${API_URL}/budget/categories/update`,
				{ updatedCategory },
				{ headers: { authorization: `Bearer ${gotToken}` } }
			)
			setCategoriesArr(response.data.categories)
		} catch (err) {
			console.log('Error while updating category:', err)
			setEditCategoryId(editCategoryId)
			setEditCategoryName(editCategoryName)
			setEditCategoryColour(editCategoryColour)
			setCategoriesArr(categoriesArr)
		}
	}

	// ADD NEW CATEGORY

	const [newCategoryName, setNewCategoryName] = useState('')
	const [newCategoryColour, setNewCategoryColour] = useState(coloursArr[0].name)
	const [newCategoryColourListIsOpen, setNewCategoryColourListIsOpen] = useState(false)
	const [newCategoryNameError, setNewCategoryNameError] = useState('')

	const handleChangeNewCategoryName = (event) => {
		const newValue = event.target.value
		setNewCategoryName(newValue)

		if (categoriesArr.some((category) => category.name.toLowerCase() === newValue.toLowerCase())) {
			setNewCategoryNameError(true)
		} else {
			setNewCategoryNameError('')
		}
	}

	const handleAddNewCategory = async (event) => {
		event.preventDefault()
		const gotToken = localStorage.getItem('authToken')
		const newArr = [...categoriesArr, { name: newCategoryName, colour: newCategoryColour }]
		setCategoriesArr(newArr)
		setNewCategoryName('')
		setNewCategoryColour('')

		try {
			const response = await axios.post(
				`${API_URL}/budget/categories/add`,
				{ categories: newArr },
				{ headers: { authorization: `Bearer ${gotToken}` } }
			)
			setCategoriesArr(response.data.categories)
		} catch (err) {
			console.log('Error while adding new category', err)
			setCategoriesArr(categoriesArr)
			setNewCategoryName(newCategoryName)
			setNewCategoryColour(newCategoryColour)
		}
	}

	// DELETE CATEGORY

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [foundExpensesArr, setFoundExpensesArr] = useState([])
	const [remainingCategoriesArr, setRemainingCategoriesArr] = useState(categoriesArr)
	const [newCategoryToAssignId, setNewCategoryToAssignId] = useState('')

	const handleCloseDeleteModal = (event) => {
		event.preventDefault()
		setIsDeleteModalOpen(false)
		setNewCategoryToAssignId('')
		setRemainingCategoriesArr([])
	}

	// prepare delete, check if expenses exist

	const handlePrepareDeleteCategory = async (event) => {
		event.preventDefault()
		const gotToken = localStorage.getItem('authToken')
		const categoryId = editCategoryId

		try {
			const { data } = await axios.get(`${API_URL}/budget/${categoryId}/expenses`, {
				headers: { authorization: `Bearer ${gotToken}` },
			})
			setFoundExpensesArr(data.foundExpensesArr)

			if (data.foundExpensesArr?.length > 0) {
				setIsDeleteModalOpen(true)
				setRemainingCategoriesArr(
					categoriesArr.filter((elem) => {
						return elem._id !== categoryId ? elem : null
					})
				)
			} else {
				handleDeleteCategory(event)
			}
		} catch (err) {
			console.log('error while fetching category expenses ', err)
		}
	}

	// move expenses to new category

	const handleMoveExpenses = async (event) => {
		event.preventDefault()
		const gotToken = localStorage.getItem('authToken')
		const oldCategoryId = editCategoryId
		const newCategoryId = newCategoryToAssignId

		try {
			const response = await axios.post(
				`${API_URL}/budget/${oldCategoryId}/expenses/move/${newCategoryId}`,
				{},
				{
					headers: { authorization: `Bearer ${gotToken}` },
				}
			)
			if (response.status === 200) {
				handleDeleteCategory(event)
				handleCloseDeleteModal(event)
			}
		} catch (err) {
			console.log('error while deleting expenses in category: ', err)
			return
		}
	}

	// delete expenses in category

	const handleDeleteExpenses = async (event) => {
		event.preventDefault()
		const gotToken = localStorage.getItem('authToken')
		const categoryId = editCategoryId

		try {
			const response = await axios.delete(`${API_URL}/budget/${categoryId}/expenses/delete`, {
				headers: { authorization: `Bearer ${gotToken}` },
			})
		} catch (err) {
			console.log('error while deleting expenses in category: ', err)
		}

		handleDeleteCategory(event)
		handleCloseDeleteModal(event)
	}

	// delete category

	const handleDeleteCategory = async (event) => {
		event.preventDefault()

		const gotToken = localStorage.getItem('authToken')
		const categoryId = editCategoryId
		const newArr = categoriesArr.filter((elem) => {
			return elem._id !== editCategoryId ? elem : null
		})

		setCategoriesArr(newArr)
		setEditCategoryId('')
		setEditCategoryName('')
		setEditCategoryColour('')

		try {
			const response = await axios.delete(`${API_URL}/budget/categories/delete/${categoryId}`, {
				headers: { authorization: `Bearer ${gotToken}` },
			})
			setCategoriesArr(response.data.categories)
		} catch (err) {
			console.log('error while deleting category: ', err)
			setEditCategoryId(editCategoryId)
			setEditCategoryName(editCategoryName)
			setEditCategoryColour(editCategoryColour)
			setCategoriesArr(categoriesArr)
		}
	}

	return (
		<>
			<section id="categories" className="section-categories">
				<h2>Your categories</h2>
				<div className="card">
					{!categoriesArr || categoriesArr.length <= 0 ? (
						<CardEmpty
							imgSrc={noCategoriesGif}
							imgAlt={
								'Actress Mayim Bialik points her open palm to the right, in a service gesture, laughing. Subline: “any category you like”'
							}
							headline={'No categories yet.'}
							text={<p>Start adding some via the form below.</p>}
						/>
					) : (
						<ul>
							{categoriesArr.map((elem, index) => {
								const elemId = elem._id || index
								if (elemId !== editCategoryId) {
									return (
										<li key={elemId}>
											<div className="name">
												<div
													className="colour-option"
													style={{
														backgroundColor: `var(--color-${elem.colour})`,
														display: 'inline-block',
														width: '2rem',
														height: '2rem',
														borderRadius: '50%',
													}}></div>
												<div className="text">{elem.name}</div>
											</div>
											<button
												aria-label={`edit ${elem.name} category`}
												className="btn-edit-item"
												onClick={() => handleEditCategory(elemId, elem.name, elem.colour)}>
												<IconEdit />
											</button>
										</li>
									)
								} else {
									return (
										<li key={elemId}>
											<form className="form-categories" onSubmit={handleUpdateCategory}>
												<div className="grid">
													<DropdownListColour
														label={'Colour'}
														selectedValue={editCategoryColour}
														setNewSelectedValue={setEditCategoryColour}
														coloursArr={coloursArr}
														dropdownState={editCategoryColourListIsOpen}
														setDropdownState={setEditCategoryColourListIsOpen}
													/>
													<fieldset>
														<label htmlFor="edit-category-name" className="hidden">
															Category Name
														</label>
														<input
															type="text"
															id="edit-category-name"
															name="inputEditCategoryName"
															placeholder="Category Name (i.e. »food«)"
															maxLength={70}
															value={editCategoryName}
															onChange={(event) => handleChangeEditCategoryName(event, index)}
															aria-invalid={editCategoryNameError ? true : null}
															aria-errormessage="edit-category-name-error"
															required
														/>
														{editCategoryNameError ? (
															<small className="error-text" id="edit-category-name-error">
																<IconXCircle /> This category already exists. Please choose a unique name.
															</small>
														) : null}
													</fieldset>
													<div className="btn-group">
														<button
															type="submit"
															className="btn-add-item"
															aria-label="save changes"
															disabled={!!editCategoryNameError}>
															<IconCheck />
														</button>
														<button
															type="button"
															className="btn-delete-item"
															aria-label="delete category"
															onClick={handlePrepareDeleteCategory}>
															<IconMinus />
														</button>
														<button
															type="button"
															className="btn-close"
															aria-label="cancel editing"
															onClick={handleCancelEditCategory}>
															<IconClose />
														</button>
													</div>
												</div>
											</form>
											{isDeleteModalOpen ? (
												<ModalProvider>
													<Modal
														modalClassName=""
														title={`Deleting “${editCategoryName}”`}
														modalIsOpen={isDeleteModalOpen}
														onCancel={handleCloseDeleteModal}
														description={
															remainingCategoriesArr.length === 0 ? (
																<>
																	<p>
																		There are <strong>{foundExpensesArr.length}</strong> expenses in this category.
																		<br />
																		Deleting the category, will also delete these expenses. <br />
																		Do you want to proceed?
																	</p>
																	<button className="btn-centered btn-inline btn-delete" onClick={handleDeleteExpenses}>
																		Yes, delete “{editCategoryName}” and its expenses
																	</button>
																	<small className="text-delete">
																		<button className="btn-as-text" onClick={handleCloseDeleteModal}>
																			Oh no. Cancel!
																		</button>
																	</small>
																</>
															) : (
																<>
																	<p>
																		You have <strong>{foundExpensesArr.length}</strong> expenses in “{editCategoryName}
																		”.
																		<br />
																		Do you want assign them to a new category?
																	</p>
																	<select
																		aria-label="new category"
																		value={newCategoryToAssignId}
																		onChange={(event) => {
																			setNewCategoryToAssignId(event.target.value)
																		}}>
																		<option key="0" value=""></option>
																		{remainingCategoriesArr.map((elem) => (
																			<option key={elem._id} value={elem._id}>
																				{elem.name}
																			</option>
																		))}
																	</select>
																	<button
																		disabled={newCategoryToAssignId === '' ? true : false}
																		className="btn-centered btn-inline"
																		onClick={handleMoveExpenses}>
																		assign new category, <br />
																		then delete “{elem.name}”
																	</button>
																	<small className="text-delete">
																		<button className="btn-as-text" onClick={handleDeleteExpenses}>
																			No, thanks,
																			<br />
																			delete “{editCategoryName}” and its expenses.
																		</button>
																	</small>
																</>
															)
														}
													/>
												</ModalProvider>
											) : null}
										</li>
									)
								}
							})}
						</ul>
					)}
					{categoriesArr?.length >= maxNumOfCategories ? (
						<Alert type="primary">
							<>
								<h5>You created the maximum number of categories.</h5>
								<p>
									Need more? Get in touch with us about our{' '}
									<strong className="rainbow-text">whopping bargain 999{currency}</strong> premium subscription pla… — no,
									seriously: just delete a few.
								</p>
							</>
						</Alert>
					) : (
						<form className="form-categories" onSubmit={handleAddNewCategory}>
							<h3 className="sr-only">Add new category</h3>
							<div className="grid">
								<DropdownListColour
									selectedValue={newCategoryColour}
									setNewSelectedValue={setNewCategoryColour}
									coloursArr={coloursArr}
									dropdownState={newCategoryColourListIsOpen}
									setDropdownState={setNewCategoryColourListIsOpen}
								/>
								<fieldset>
									<label htmlFor="new-category-name" className="sr-only">
										Category Name
									</label>
									<input
										type="text"
										id="new-category-name"
										name="newCategoryName"
										placeholder="Category Name (i.e. »food«)"
										maxLength={70}
										value={newCategoryName}
										onChange={handleChangeNewCategoryName}
										aria-invalid={newCategoryNameError ? true : null}
										aria-errormessage="new-category-name-error"
										required
									/>
									{newCategoryNameError ? (
										<small className="error-text" id="new-category-name-error">
											<IconXCircle /> This category already exists. Please choose a unique name.
										</small>
									) : null}
								</fieldset>
								<button
									type="submit"
									className="btn-add-item"
									aria-label="add new category"
									disabled={!!newCategoryNameError}>
									<IconCheck />
								</button>
							</div>
						</form>
					)}
				</div>
			</section>
		</>
	)
}
