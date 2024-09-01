import { useEffect, useState } from 'react'
import { API_URL } from '../config'
import axios from 'axios'
import { ReactComponent as IconMinus } from '../assets/icons/icon-minus.svg'
import { ReactComponent as IconEdit } from '../assets/icons/icon-edit.svg'
import { ReactComponent as IconClose } from '../assets/icons/icon-close.svg'
import { ReactComponent as IconCheck } from '../assets/icons/icon-check.svg'
import { ReactComponent as IconXCircle } from '../assets/icons/icon-x-circle.svg'
import RadioGroupColour from './RadioGroupColour'
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

		// check if name already exists
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
								'Actress Mayim Biyalik points her open palm to the right, in a service gesture, laughing. Subline: “any category you like”'
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
													style={{
														backgroundColor: `var(--color-${elem.colour})`,
														display: 'inline-block',
														width: '2rem',
														height: '2rem',
														borderRadius: '50%',
													}}></div>
												{elem.name}
											</div>
											<button className="btn-edit-item" onClick={() => handleEditCategory(elemId, elem.name, elem.colour)}>
												<IconEdit />
											</button>
										</li>
									)
								} else {
									return (
										<li key={elemId}>
											<form className="form-categories" onSubmit={handleUpdateCategory}>
												<div className="grid">
													<RadioGroupColour
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
															onClick={handleDeleteCategory}>
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
										</li>
									)
								}
							})}
						</ul>
					)}
					{categoriesArr?.length >= maxNumOfCategories ? (
						<Alert
							type="primary"
							content={
								<>
									<h5>You created the maximum number of categories.</h5>
									<p>
										Need more? Get in touch with us about our{' '}
										<strong className="rainbow-text">whopping bargain 999{currency}</strong> premium subscription plan! 🤗
										<br />
									</p>
									<small>(No, seriously, just delete a few.)</small>
								</>
							}
						/>
					) : (
						<form className="form-categories" onSubmit={handleAddNewCategory}>
							<h3 className="sr-only">Add new category</h3>
							<div className="grid">
								<RadioGroupColour
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