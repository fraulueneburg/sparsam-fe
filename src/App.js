import './css/pico.min.css'
import './css/styles.scss'
import { Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout'
import PrivatePage from './pages/PrivatePage'
import HomePage from './pages/HomePage'
import Signup from './pages/Signup'
import Login from './pages/Login'
import UserSettings from './pages/UserSettings'
import ProfileDeleted from './pages/ProfileDeleted'
import Budget from './pages/Budget'
import Settings from './pages/Settings'
import { BudgetContextWrapper } from './context/budget.context'

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route path="/" element={<HomePage />}></Route>
					<Route path="/auth/signup" element={<Signup />}></Route>
					<Route path="/auth/login" element={<Login />}></Route>
					<Route
						path="/auth/profile"
						element={
							<PrivatePage>
								<UserSettings />
							</PrivatePage>
						}
					/>
					<Route path="/profile-deleted" element={<ProfileDeleted />}></Route>
					<Route
						path="/budget"
						element={
							<PrivatePage>
								<BudgetContextWrapper>
									<Budget />
								</BudgetContextWrapper>
							</PrivatePage>
						}
					/>
					<Route
						path="/settings"
						element={
							<PrivatePage>
								<Settings />
							</PrivatePage>
						}
					/>
				</Route>
			</Routes>
		</>
	)
}

export default App
