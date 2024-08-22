import { AuthContext } from '../context/auth.context'
import { useContext, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { ReactComponent as IconMenu } from '../assets/icons/icon-menu.svg'

function Navbar() {
	const { logOutUser, isLoggedIn } = useContext(AuthContext)
	const navRef = useRef()
	const showNavbar = () => {
		navRef.current.classList.toggle('active')
	}

	return (
		<>
			<a className="logo" href={isLoggedIn ? '/budget' : '/'}>
				<span className="icon">🐽</span>
				<span className="name">sparsam</span>
			</a>
			<button className="btn-toggle-menu" onClick={showNavbar}>
				<IconMenu />
			</button>
			<nav className="nav_main" ref={navRef}>
				{isLoggedIn ? (
					<ul>
						<li>
							<NavLink
								onClick={showNavbar}
								to="/budget"
								end
								{...({ isActive }) => (isActive ? 'aria-current="page"' : null)}>
								Budget
							</NavLink>
						</li>
						<li>
							<NavLink
								onClick={showNavbar}
								to="/settings"
								end
								{...({ isActive }) => (isActive ? 'aria-current="page"' : null)}>
								Settings
							</NavLink>
						</li>
						<li>
							<NavLink
								onClick={showNavbar}
								to="/auth/profile"
								end
								{...({ isActive }) => (isActive ? 'aria-current="page"' : null)}>
								My Profile
							</NavLink>
						</li>
					</ul>
				) : (
					<ul>
						<li>
							<NavLink onClick={showNavbar} to="/auth/login">
								Login
							</NavLink>
						</li>
					</ul>
				)}
			</nav>
			{isLoggedIn ? <button onClick={logOutUser}>Logout</button> : null}
		</>
	)
}

export default Navbar
