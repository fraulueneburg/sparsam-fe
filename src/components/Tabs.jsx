import { useState, useId } from 'react'

export default function Tabs({ ...props }) {
	const { tabs } = props
	const [activeTabIndex, setActiveTabIndex] = useState(0)

	const idPrefix = useId()

	return (
		<>
			<section className="tabs">
				<div className={`card card-tabs`}>
					<div className="nav-tabs">
						{tabs.map((tab, i) => (
							<button
								key={`${idPrefix}-${i}`}
								onClick={() => setActiveTabIndex(i)}
								className={`${activeTabIndex === i ? 'active' : ''}`}>
								{tab.label}
							</button>
						))}
					</div>
					{tabs[activeTabIndex].content}
				</div>
			</section>
		</>
	)
}
