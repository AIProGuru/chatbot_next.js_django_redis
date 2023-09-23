import styles from "./RecommendationSwitch.module.scss"
import React from "react"
import {cc} from "@/components/ui/Functions/Classnames"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"

interface RecommendationSwitchProps {
	// field?: any
	value: string
	title: string
	id?: string
	state?: boolean
	toggleCallback?: Function
}

function RecommendationSwitch(props: RecommendationSwitchProps) {
	const {value, title, id, state, toggleCallback} = props
	const router = useRouter()
	const dir = getDirection(router)

	function onSwitchClick() {
		toggleCallback && toggleCallback()
	}

	return (
		<div
			className={cc([styles.RecommendationSwitch, dir && styles[dir]])}
			{...(id && {id: id})}
		>
			<div className={cc([styles.Switch])}>
				<div className={styles.Input}>
					<input
						{...(state !== undefined && {checked: state})}
						type="checkbox"
						id={value}
						onChange={() => {}}
					/>
				</div>

				<div className={cc([styles.Text])}>
					<div>
						<p className={styles.Title}>{title}</p>
					</div>
				</div>
			</div>
			<label htmlFor={value} onClick={onSwitchClick} />
		</div>
	)
}

export default RecommendationSwitch
