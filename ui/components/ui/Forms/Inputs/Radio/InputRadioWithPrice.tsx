import styles from "./InputRadioWithPrice.module.scss"
import React, {useCallback} from "react"
import {cc} from "@/components/ui/Functions/Classnames"

interface InputRadioProps {
	field?: any
	value: string
	price: string
	title: string
	description?: string[]
	id?: string
}

function InputRadioWithPrice(props: InputRadioProps) {
	const {field, value, price, title, description, id} = props

	const active = useCallback(() => {
		return field && field.value.toString() === value.toString()
	}, [field, value])

	return (
		<div
			className={cc([
				styles.InputRadioWithPrice,
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
						{description &&
							description.length > 0 &&
							description.map((row: string, index: number) => (
								<p
									className={cc([
										styles.Description,
										active() && styles.DescriptionActive,
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
							active() && styles.ValueActive,
						])}
					>
						{price}
					</span>
				</div>
			</div>
			<label htmlFor={value} />
		</div>
	)
}

export default InputRadioWithPrice
