import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Layout() {
	return (
		<>
			<header className="container">
				<Navbar />
			</header>
			<main className="container">
				<Outlet />
			</main>
			<Footer />
		</>
	)
}

export default Layout
