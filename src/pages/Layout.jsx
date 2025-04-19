import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Layout() {
	return (
		<>
			<header className="container site-header">
				<Navbar />
			</header>
			<main className="container">
				<Outlet />
			</main>
			<Footer />
		</>
	)
}
