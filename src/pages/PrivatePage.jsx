import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/auth.context'
import { Navigate } from 'react-router-dom'

export default function PrivatePage({ children }) {
	const { isLoading, isLoggedIn } = useContext(AuthContext)
	if (isLoading) {
		return <p>Loading...</p>
	}
	if (isLoggedIn) {
		return children
	} else {
		return <Navigate to="/" />
	}
}
