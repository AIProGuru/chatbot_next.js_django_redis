import styles from "./InputRadioSubscriptionType.module.scss"
import React, {useCallback} from "react"
import {cc} from "@/components/ui/Functions/Classnames"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"

interface InputRadioSubscriptionTypeProps {
	field?: any
	value: string
	title: string
	id?: string
	disabled?: boolean
	signup?: boolean
}

function InputRadioSubscriptionType(props: InputRadioSubscriptionTypeProps) {
	const {field, value, title, id, disabled, signup} = props
	const router = useRouter()
	const dir = getDirection(router)

	const active = useCallback(() => {
		if (disabled === true) {
			return
		}
		if (!field.value) return false
		return field.value.toString() === value.toString()
	}, [disabled, field, value])

	return (
		<div
			className={cc([
				styles.InputRadioSubscriptionType,
				dir && styles[dir],
				active() && styles.Active,
				disabled && styles.Disabled,
			])}
			{...(id && {id: id})}
		>
			<div className={styles.Radio}>
				<div className={styles.Input}>
					{!signup && value === "without" ? (
						<input
							type="radio"
							value={value}
							id={value}
							checked={true}
							{...(disabled && {disabled: true})}
						/>
					) : (
						<input
							{...(field && {...field})}
							type="radio"
							value={value}
							id={value}
							{...(active() ? {checked: true} : {checked: false})}
							{...(disabled && {disabled: true})}
						/>
					)}
				</div>

				<div className={styles.Text}>
					<div>
						<p
							className={cc([
								styles.Title,
								(active() || (!signup && value === "without")) && styles.TitleActive,
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

export default InputRadioSubscriptionType
