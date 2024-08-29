import { AuthContext } from '../context/auth.context'
import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { ReactComponent as IconUser } from '../assets/icons/icon-user.svg'
import { ReactComponent as IconSettings } from '../assets/icons/icon-settings.svg'

function Navbar() {
	const { logOutUser, isLoggedIn } = useContext(AuthContext)

	return (
		<>
			<a className="logo" href={isLoggedIn ? '/budget' : '/'}>
				<span className="icon">🐽</span>
				<span className="name">sparsam</span>
			</a>
			<nav className="nav-main" id="nav-main">
				{isLoggedIn ? (
					<ul>
						<li>
							<NavLink to="/budget" end {...({ isActive }) => (isActive ? 'aria-current="page"' : null)}>
								Budget
							</NavLink>
						</li>
					</ul>
				) : (
					<ul>
						<li>
							<NavLink to="/auth/login" end {...({ isActive }) => (isActive ? 'aria-current="page"' : null)}>
								Login
							</NavLink>
						</li>
					</ul>
				)}
			</nav>

			{isLoggedIn ? (
				<nav className="nav-secondary">
					<ul>
						<li>
							<NavLink to="/settings" end {...({ isActive }) => (isActive ? 'aria-current="page"' : null)}>
								<IconSettings />
								<span className="hidden">Settings</span>
							</NavLink>
						</li>
						<li>
							<NavLink to="/auth/profile" end {...({ isActive }) => (isActive ? 'aria-current="page"' : null)}>
								<IconUser />
								<span className="hidden">User Settings</span>
							</NavLink>
						</li>
						<li>
							<button onClick={logOutUser}>Logout</button>
						</li>
					</ul>
				</nav>
			) : null}
		</>
	)
}

export default Navbar
