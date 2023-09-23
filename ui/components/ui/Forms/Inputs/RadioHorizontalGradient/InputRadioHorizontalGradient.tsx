import styles from "./InputRadioHorizontalGradient.module.scss"
import React, {useCallback} from "react"
import {cc} from "@/components/ui/Functions/Classnames"

interface InputRadioHorizontalGradientProps {
	field?: any
	value: string
	title: string
	id?: string
}

function InputRadioHorizontalGradient(
	props: InputRadioHorizontalGradientProps
) {
	const {field, value, title, id} = props

	const active = useCallback(() => {
		return field.value.toString() === value.toString()
	}, [field.value, value])

	return (
		<div
			className={cc([
				styles.InputRadioHorizontalGradient,
				active() && styles.Active,
			])}
			{...(id && {id: id})}
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

export default InputRadioHorizontalGradient
