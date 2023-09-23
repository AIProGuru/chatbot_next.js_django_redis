import styles from "./InputRadioPayment.module.scss"
import React, {useCallback} from "react"
import {cc} from "@/components/ui/Functions/Classnames"

interface InputRadioProps {
	field?: any
	value: string
	title: string
	image?: Element
	id?: string
}

function InputRadioPayment(props: InputRadioProps) {
	const {field, value, title, id, image} = props

	const active = useCallback(() => {
		return field && field.value.toString() === value.toString()
	}, [field, value])

	return (
		<div
			className={cc([
				styles.InputRadioPayment,
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
					{
					// image && image
					}
				</div>
			</div>
			<label htmlFor={value} />
		</div>
	)
}

export default InputRadioPayment
