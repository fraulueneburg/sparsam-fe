import { useEffect, useState, useId } from 'react'
import { HashLink } from 'react-router-hash-link'

export default function NavAnchor(props) {
	const links = props.links
	const idPrefix = useId()

	const [activeId, setActiveId] = useState('')

	useEffect(() => {
		const getHeaderHeight = () => {
			const header = document.querySelector('.site-header')
			return header ? parseFloat(getComputedStyle(header).height) : 0
		}
		const headerHeight = getHeaderHeight()

		const handleIntersection = (entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setActiveId(entry.target.id)
				}
			})
		}

		const observer = new IntersectionObserver(handleIntersection, {
			root: null,
			rootMargin: `${headerHeight}px 0px -50% 0px`,
			threshold: 0.1,
		})

		links.forEach((link) => {
			const target = document.querySelector(link.to)
			if (target) observer.observe(target)
		})

		const handleScroll = () => {
			const scrollPosition = window.scrollY + window.innerHeight
			const documentHeight = document.body.scrollHeight

			if (documentHeight - scrollPosition < 100) {
				setActiveId(links[links.length - 1].to.substring(1))
			}
		}
		window.addEventListener('scroll', handleScroll)

		return () => {
			observer.disconnect()
			window.removeEventListener('scroll', handleScroll)
		}
	}, [links])

	if (links) {
		return (
			<>
				<nav className="nav-anchor">
					<ul>
						{links.map((item, index) => {
							const uniqueId = `${idPrefix}-${index}`

							return (
								<li key={uniqueId} className={activeId === item.to.substring(1) ? 'active' : ''}>
									<HashLink smooth to={item.to}>
										{item.title}
									</HashLink>
								</li>
							)
						})}
					</ul>
				</nav>
			</>
		)
	} else {
		return <>error loading anchor links</>
	}
}
