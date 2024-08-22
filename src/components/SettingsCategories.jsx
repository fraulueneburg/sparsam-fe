import { useEffect, useState } from 'react'
import { API_URL } from '../config'
import axios from 'axios'
import { ReactComponent as IconMinus } from '../assets/icons/icon-minus.svg'
import { ReactComponent as IconEdit } from '../assets/icons/icon-edit.svg'
import { ReactComponent as IconClose } from '../assets/icons/icon-close.svg'
import { ReactComponent as IconCheck } from '../assets/icons/icon-check.svg'
import coloursArr from '../data/colours.json'
import noCategoriesGif from '../assets/img/gif-no-categories.webp'

export default function SettingsCategories(props) {
	const existingBudget = props.data
	const colourOptionsArr = coloursArr.map((elem) => {
		return {
			value: elem.name,
			label: elem.name,
		}
	})
	const [categoriesArr, setCategoriesArr] = useState([])

	useEffect(() => {
		setCategoriesArr(existingBudget.categories)
	}, [existingBudget])

	// GENERAL

	const handleChange = (changeFunction) => (event) => {
		changeFunction(event.target.value)
	}

	const startTransition = (callback) => {
		if (document.startViewTransition) {
			document.startViewTransition(callback)
		} else {
			callback() // Fallback for unsupported browsers
		}
	}

	// EDIT CATEGORY

	const [editCategoryId, setEditCategoryId] = useState('')
	const [editCategoryName, setEditCategoryName] = useState('')
	const [editCategoryColour, setEditCategoryColour] = useState('')

	const handleEditCategory = (id, name, colour) => {
		startTransition(() => {
			setEditCategoryId(id)
			setEditCategoryName(name)
			setEditCategoryColour(colour)
		})
	}

	const handleCancelEditCategory = () => {
		startTransition(() => {
			setEditCategoryId('')
			setEditCategoryName('')
			setEditCategoryColour('')
		})
	}

	// CHANGE CATEGORY COLOUR

	const handleChangeCategoryColour = async (event) => {
		event.preventDefault()
		setNewCategoryColour(event.target.value)
	}

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
			<section className="section-categories">
				<h2>Your categories</h2>
				<div className="card">
					{!categoriesArr || categoriesArr.length <= 0 ? (
						<div className="card-empty-text">
							<img src={noCategoriesGif} alt="" width="300" />
							<h4>No categories yet.</h4>
							<p>Start adding some via the form below.</p>
						</div>
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
														width: '30px',
														height: '30px',
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
													<div>
														<label htmlFor="edit-category-colour" className="hidden">
															Colour
														</label>
														<select
															id="edit-category-colour"
															name="inputEditCategoryColour"
															value={editCategoryColour}
															onChange={handleChange(setEditCategoryColour)}
															required>
															{coloursArr.map((elem, index) => (
																<option key={elem._id || index}>{elem.name}</option>
															))}
														</select>
													</div>
													<div>
														<label htmlFor="edit-category-name" className="hidden">
															Category Name
														</label>
														<input
															type="text"
															id="edit-category-name"
															name="inputEditCategoryName"
															placeholder="Category Name (i.e. »food«)"
															value={editCategoryName}
															onChange={handleChange(setEditCategoryName)}
															required
														/>
													</div>
													<div className="btn-group">
														<button type="submit" className="btn-add-item" aria-label="save changes">
															<IconCheck />
														</button>
														<button className="btn-delete-item" aria-label="delete category" onClick={handleDeleteCategory}>
															<IconMinus />
														</button>
														<button className="btn-close" aria-label="cancel editing" onClick={handleCancelEditCategory}>
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
					<form className="form-categories" onSubmit={handleAddNewCategory}>
						<strong className="sr-only">Add new category</strong>
						<div className="grid">
							<div>
								<label htmlFor="new-category-colour" className="sr-only">
									Colour
								</label>
								<select
									id="new-category-colour"
									name="newCategoryColour"
									value={newCategoryColour}
									onChange={handleChangeCategoryColour}>
									{coloursArr.map((elem, index) => (
										<option key={elem._id || index}>{elem.name}</option>
									))}
								</select>
							</div>
							<div>
								<label htmlFor="new-category-name" className="sr-only">
									Category Name
								</label>
								<input
									type="text"
									id="new-category-name"
									name="newCategoryName"
									placeholder="Category Name (i.e. »food«)"
									value={newCategoryName}
									onChange={handleChange(setNewCategoryName)}
									required
								/>
							</div>
							<button type="submit" className="btn-add-item" aria-label="add new category">
								<IconCheck />
							</button>
						</div>
					</form>
				</div>
			</section>
		</>
	)
}