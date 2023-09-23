import styles from "./InputRadioHorizontalDefault.module.scss"
import React, {useCallback} from "react"
import {cc} from "@/components/ui/Functions/Classnames"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"

interface InputRadioHorizontalDefaultProps {
	field?: any
	value: string
	title: string
	id?: string
	drawerTrigger?: Function
}

function InputRadioHorizontalDefault(props: InputRadioHorizontalDefaultProps) {
	const {field, value, title, id, drawerTrigger} = props
	const router = useRouter()
	const dir = getDirection(router)

	const active = useCallback(() => {
		if (!field) return false
		return field.value.toString() === value.toString()
	}, [field, value])

	return (
		<div
			className={cc([
				styles.InputRadioHorizontalDefault,
				dir && styles[dir],
				active() && styles.Active,
			])}
			{...(id && {id: id})}
			{...(drawerTrigger && {
				onClick: () => {
					drawerTrigger()
				},
			})}
		>
			<div className={styles.Radio}>
				<div className={styles.Input}>
					<input
						{...(field && {...field})}
						type="radio"
						value={value}
						id={value}
						{...(active() ? {checked: true} : {checked: false})}
					/>
				</div>

				<div className={styles.Text}>
					<div>
						<p
							className={cc([
								styles.Title,
								active() && styles.TitleActive,
							])}
						>
							{title}
						</p>
					</div>
				</div>
			</div>
			<label htmlFor={value} />
		</div>
	)
}

export default InputRadioHorizontalDefault
