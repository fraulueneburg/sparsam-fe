import './css/pico.min.css'
import './css/grid.css'
import './css/App.css'
import { Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout'
import HomePage from './pages/Home'
import SignupPage from './pages/Signup'
import ProfilePage from './pages/Settings_User'
import BudgetOverview from './pages/Budget'
import SettingsBudget from './pages/Settings_Budget'
import PrivatePage from './pages/PrivatePage'

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route path="/" element={<HomePage />}></Route>
					<Route path="/auth/signup" element={<SignupPage />}></Route>
					<Route
						path="/auth/profile"
						element={
							<PrivatePage>
								<ProfilePage />
							</PrivatePage>
						}
					/>
					<Route
						path="/budget"
						element={
							<PrivatePage>
								<BudgetOverview />
							</PrivatePage>
						}
					/>
					<Route
						path="/budget/settings"
						element={
							<PrivatePage>
								<SettingsBudget />
							</PrivatePage>
						}
					/>
				</Route>
			</Routes>
		</div>
	)
}

export default App
