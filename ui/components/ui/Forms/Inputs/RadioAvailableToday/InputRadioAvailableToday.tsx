import styles from "./InputRadioAvailableToday.module.scss"
import React, {useCallback} from "react"
import {cc} from "@/components/ui/Functions/Classnames"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"

interface InputRadioProps {
	field?: any
	value: string
	title: string
	disabled?: boolean
	id: string
	error?: string
}

function InputRadioAvailableToday(props: InputRadioProps) {
	const {field, title, value, disabled, id, error} = props

	const router = useRouter()
	const dir = getDirection(router)

	const active = useCallback(() => {
		return field.value === value
	}, [field.value, value])

	return (
		<div
			className={cc([
				styles.InputRadioAvailableToday,
				active() && styles.Active,
				dir && styles[dir],
			])}
			style={{opacity: disabled ? 0.45 : 1}}
			{...(id && {id: id})}
		>
			<div className={styles.Radio}>
				<div className={styles.Text}>
					<p
						className={cc([
							styles.Title,
							active() && styles.TitleActive,
						])}
					>
						{title}
					</p>
				</div>
				<div className={styles.Input}>
					<input
						{...(field && {...field})}
						type="radio"
						value={value}
						id={value}
						disabled={disabled ? disabled : false}
						{...(active() ? {checked: true} : {checked: false})}
					/>
				</div>
			</div>
			<label htmlFor={value} />
		</div>
	)
}

export default InputRadioAvailableToday
