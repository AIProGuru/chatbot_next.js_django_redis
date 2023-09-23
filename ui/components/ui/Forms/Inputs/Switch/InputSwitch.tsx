import styles from "./InputSwitch.module.scss"
import React from "react"
import {cc} from "@/components/ui/Functions/Classnames"

interface InputSwitchProps {
	field?: any
	value: string
	price?: string
	title: string
	id?: string
	textAlign?: "right"
	disabled?: boolean
	discountVariant?: boolean
}

function InputSwitch(props: InputSwitchProps) {
	const {
		field,
		value,
		price,
		title,
		id,
		textAlign,
		disabled,
		discountVariant,
	} = props

	return (
		<div
			style={{opacity: disabled ? 0.45 : 1}}
			className={cc([styles.InputSwitch])}
			{...(id && {id: id})}
		>
			<div
				className={cc([
					styles.Switch,
					discountVariant && styles.SwitchDiscount,
				])}
			>
				<div
					className={cc([
						styles.Text,
					])}
				>
					<div>
						<p className={styles.Title}>{title}</p>
					</div>
				</div>
				{!!price && (
					<div className={styles.Price}>
						<span className={styles.Value}>{price}</span>
					</div>
				)}
				<div className={styles.Input}>
					<input
						{...(field && {...field})}
						{...(field && {checked: field.value})}
						type="checkbox"
						id={value}
						disabled={disabled && disabled}
					/>
				</div>
			</div>
			<label htmlFor={value} />
		</div>
	)
}

export default InputSwitch
