import { useState, useContext } from 'react'
import { SettingsContext } from '../context/settings.context'
import { API_URL } from '../config'
import axios from 'axios'

import CardEmpty from '../components/CardEmpty'
import { ReactComponent as IconMinus } from '../assets/icons/icon-minus.svg'
import { ReactComponent as IconEdit } from '../assets/icons/icon-edit.svg'
import { ReactComponent as IconClose } from '../assets/icons/icon-close.svg'
import { ReactComponent as IconCheck } from '../assets/icons/icon-check.svg'
import noEarningsGif from '../assets/img/gif-no-earnings.gif'

export default function Earnings() {
	const { currency, handleChange, earningsArr, setEarningsArr, earningsTotal } = useContext(SettingsContext)

	// EDIT EARNING

	const [editEarningId, setEditEarningId] = useState('')
	const [editEarningName, setEditEarningName] = useState('')
	const [editEarningAmount, setEditEarningAmount] = useState('')

	const handleEditEarning = (id, name, amount) => {
		setEditEarningId(id)
		setEditEarningName(name)
		setEditEarningAmount(amount)
	}

	const handleCancelEditEarning = () => {
		setEditEarningId('')
		setEditEarningName('')
		setEditEarningAmount('')
	}

	// UPDATE EARNING

	const handleUpdateEarning = async (event) => {
		event.preventDefault()
		const gotToken = localStorage.getItem('authToken')
		const updatedEarning = { _id: editEarningId, name: editEarningName, amount: editEarningAmount }
		const itemIndex = earningsArr.findIndex((elem) => elem._id === updatedEarning._id)
		const newArr = [...earningsArr]
		newArr[itemIndex] = updatedEarning

		setEarningsArr(newArr)
		setEditEarningId('')
		setEditEarningName('')
		setEditEarningAmount('')

		try {
			const response = await axios.post(
				`${API_URL}/budget/earnings/update`,
				{ updatedEarning },
				{ headers: { authorization: `Bearer ${gotToken}` } }
			)
			setEarningsArr(response.data.earnings)
		} catch (err) {
			console.log('Error while updating earning:', err)
			setEditEarningId(editEarningId)
			setEditEarningName(editEarningName)
			setEditEarningAmount(editEarningAmount)
			setEarningsArr(earningsArr)
		}
	}

	// DELETE EARNING

	const handleDeleteEarning = async (event) => {
		event.preventDefault()
		const gotToken = localStorage.getItem('authToken')
		const earningId = editEarningId
		const newArr = earningsArr.filter((elem) => {
			return elem._id !== editEarningId ? elem : null
		})
		setEarningsArr(newArr)
		setEditEarningId('')
		setEditEarningName('')
		setEditEarningAmount('')
		try {
			const response = await axios.delete(`${API_URL}/budget/earnings/delete/${earningId}`, {
				headers: { authorization: `Bearer ${gotToken}` },
			})
			setEarningsArr(response.data.earnings)
		} catch (err) {
			setEditEarningId(editEarningId)
			setEditEarningName(editEarningName)
			setEditEarningAmount(editEarningAmount)
			setEarningsArr(earningsArr)
		}
	}

	// ADD NEW EARNING

	const [newEarningName, setNewEarningName] = useState('')
	const [newEarningAmount, setNewEarningAmount] = useState('')

	const handleAddNewEarning = async (event) => {
		event.preventDefault()
		const gotToken = localStorage.getItem('authToken')
		const newArr = [...earningsArr, { name: newEarningName, amount: newEarningAmount }]
		setEarningsArr(newArr)
		setNewEarningName('')
		setNewEarningAmount('')

		try {
			const response = await axios.post(
				`${API_URL}/budget/earnings/add`,
				{ earnings: newArr },
				{ headers: { authorization: `Bearer ${gotToken}` } }
			)
			setEarningsArr(response.data.earnings)
		} catch (err) {
			console.log('Error while adding new earning', err)
			setEarningsArr(earningsArr)
			setNewEarningName(newEarningName)
			setNewEarningAmount(newEarningAmount)
		}
	}

	return (
		<>
			<h2>
				Your monthly earnings:{' '}
				<strong style={{ float: 'right' }}>
					{earningsTotal} {currency.symbol}
				</strong>
			</h2>
			<div className="card" aria-live="polite">
				{!earningsArr || earningsArr.length === 0 ? (
					<CardEmpty
						headline={'No earnings yet. 😿'}
						text={<p>Start adding some via the form below.</p>}
						imgSrc={noEarningsGif}
						imgAlt={'A baby throws a packet of banknotes out of a window'}
					/>
				) : (
					<ul>
						{earningsArr.map((elem, index) => {
							const elemId = elem._id || index
							if (elemId !== editEarningId) {
								return (
									<li key={elemId}>
										<div className="name">{elem.name}</div>
										<div className="amount">
											{elem.amount} {currency.symbol}
										</div>
										<button className="btn-edit-item" onClick={() => handleEditEarning(elemId, elem.name, elem.amount)}>
											<IconEdit />
										</button>
									</li>
								)
							} else {
								return (
									<li key={elemId}>
										<form className="form-budget" onSubmit={handleUpdateEarning}>
											<div className="grid">
												<div>
													<label htmlFor="edit-earning-name" className="hidden">
														Earning Name
													</label>
													<input
														type="text"
														id="edit-earning-name"
														name="inputEditEarningName"
														placeholder="Name (i.e. »salary«)"
														value={editEarningName}
														onChange={handleChange(setEditEarningName)}
														required
													/>
												</div>
												<div>
													<label htmlFor="edit-earning-amount" className="hidden">
														Amount
													</label>
													<div className="input-group">
														<span className="text">+</span>
														<input
															type="number"
															id="edit-earning-amount"
															min="0"
															placeholder="0,00"
															step=".01"
															name="inputEditEarningAmount"
															value={editEarningAmount}
															onChange={handleChange(setEditEarningAmount)}
															required
														/>
														<span className="text">{currency.symbol}</span>
													</div>
												</div>
												<div className="btn-group">
													<button type="submit" className="btn-add-item" aria-label="save changes">
														<IconCheck />
													</button>
													<button className="btn-delete-item" aria-label="delete earning" onClick={handleDeleteEarning}>
														<IconMinus />
													</button>
													<button className="btn-close" aria-label="cancel editing" onClick={handleCancelEditEarning}>
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
				<form className="form-budget" onSubmit={handleAddNewEarning}>
					<strong className="sr-only">Add new Earning</strong>
					<div className="grid">
						<div>
							<label htmlFor="new-earning-name" className="hidden">
								Earning Name
							</label>
							<input
								type="text"
								id="new-earning-name"
								name="inputNewEarningName"
								placeholder="Name (i.e. »salary«)"
								value={newEarningName}
								onChange={handleChange(setNewEarningName)}
								required
							/>
						</div>
						<div>
							<label htmlFor="new-earning-amount" className="hidden">
								Amount
							</label>
							<div className="input-group">
								<span className="text">+</span>
								<input
									type="number"
									id="new-earning-amount"
									min="0"
									placeholder="0,00"
									step=".01"
									value={newEarningAmount}
									onChange={handleChange(setNewEarningAmount)}
									required
								/>
								<span className="text">{currency.symbol}</span>
							</div>
						</div>
						<button type="submit" className="btn-add-item" aria-label="add new earning">
							<IconCheck />
						</button>
					</div>
				</form>
			</div>
		</>
	)
}
