import {useRouter} from "next/router"
import styles from "./Link.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"

interface LinkProps {
	children: any
	href?: string
	styled?: boolean
	id?: string
	variant?: "signin" | "agreement" | "purple"
	onClick?: Function
}

function Link(props: LinkProps) {
	const {children, href, styled, id, variant, onClick} = props
	const router = useRouter()

	function handleLinkClick(e: any) {
		e.preventDefault()
		href && router.push(href)
		onClick && onClick()
	}

	return (
		<a
			{...(href ? {href: href} : {href: "#"})}
			onClick={handleLinkClick}
			className={cc([
				styles.Link,
				styled && styles.LinkStyled,
				variant !== undefined && styles["Variant-" + variant],
			])}
			{...(id && {id: id})}
		>
			{children}
		</a>
	)
}

export default Link
