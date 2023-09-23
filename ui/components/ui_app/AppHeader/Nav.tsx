import {useRouter} from "next/router"
import ButtonGroup from "@/components/ui/Button/ButtonGroup/ButtonGroup"
import IconButton from "@/components/ui/Button/IconButton/IconButton"
import {BubbleProps} from "@/components/ui/Bubble/Bubble"

export type INav = {
	icon: JSX.Element
	authRequired: boolean
	id: string
	href?: string
	callback?: Function
	bubble?: BubbleProps
}

const Nav = (props: any) => {
	const {navList, auth} = props

	const router = useRouter()

	return (
		<ButtonGroup>
			{navList &&
				navList.map((nav: INav, index: number) => {
					if (nav.authRequired && !auth) return null

					return (
						<IconButton
							onClick={() => {
								nav.href && router.push(nav.href)
								nav.callback && nav.callback()
							}}
							icon={nav.icon}
							key={index}
							id={nav.id}
							bubble={nav.bubble}
							placement={"header"}
							fixedDir={true}
						/>
					)
				})}
		</ButtonGroup>
	)
}

export default Nav
