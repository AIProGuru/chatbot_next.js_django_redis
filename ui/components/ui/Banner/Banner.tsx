import styles from "./Banner.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import CheckIcon from "@/components/ui/Icons/CheckIcon"

interface BannerProps {
	icon: JSX.Element
	titles: string[]
	items: string[]
	button: JSX.Element
}

function Banner(props: BannerProps) {
	const {icon, titles, items, button} = props

	return (
		<div className={cc([styles.Banner])}>
			<div className={cc([styles.Icon])}>{icon}</div>
			<div className={cc([styles.Title])}>
				{titles &&
					titles.map((title: any, index: number) => {
						return <h1 key={index}>{title}</h1>
					})}
			</div>
			<div className={cc([styles.Items])}>
				{items &&
					items.map((item: any, index: number) => {
						return (
							<div key={index}>
								<CheckIcon />
								<p>{item}</p>
							</div>
						)
					})}
			</div>
			<div className={cc([styles.Button])}>{button}</div>
		</div>
	)
}

export default Banner
