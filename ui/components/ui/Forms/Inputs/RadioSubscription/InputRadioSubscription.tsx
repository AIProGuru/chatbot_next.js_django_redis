import styles from "./InputRadioSubscription.module.scss"
import React, {useCallback} from "react"
import {cc} from "@/components/ui/Functions/Classnames"

interface InputRadioSubscriptionProps {
	field?: any
	value: string
	price: string
	title: string
	description?: string[]
	id?: string
	disabled?: boolean
	currentPrice?: string
}

function InputRadioSubscription(props: InputRadioSubscriptionProps) {
	const {
		field,
		value,
		price,
		title,
		description,
		id,
		disabled,
		currentPrice,
	} = props

	const active = useCallback(() => {
		if (disabled === true) {
			return
		}
		return field && field.value.toString() === value.toString()
	}, [disabled, field, value])

	return (
		<div
			className={cc([
				styles.InputRadioSubscription,
				active() && styles.Active,
				currentPrice === value && styles.Active,
				disabled && styles.Disabled,
			])}
			{...(id && {id: id})}
		>
			<div className={styles.Radio}>
				<div className={styles.Input}>
					{currentPrice === value ? (
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
								(active() || currentPrice === value) &&
									styles.TitleActive,
							])}
						>
							{title}
						</p>
						{description &&
							description.length > 0 &&
							description.map((row: string, index: number) => (
								<p
									className={cc([
										styles.Description,
										(active() || currentPrice === value) &&
											styles.DescriptionActive,
									])}
									key={index}
								>
									{row}
								</p>
							))}
					</div>
				</div>
				<div className={styles.Price}>
					<span
						className={cc([
							styles.Value,
							(active() || currentPrice === value) &&
								styles.ValueActive,
						])}
					>
						{price} ₪
					</span>
				</div>
			</div>
			<label htmlFor={value} />
		</div>
	)
}

export default InputRadioSubscription
