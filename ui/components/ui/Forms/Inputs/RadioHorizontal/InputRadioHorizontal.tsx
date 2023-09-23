import styles from "./InputRadioHorizontal.module.scss"
import React, {useCallback} from "react"
import {cc} from "@/components/ui/Functions/Classnames"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"

interface InputRadioHorizontalProps {
	field?: any
	value: string
	title: string
	id?: string
}

function InputRadioHorizontal(props: InputRadioHorizontalProps) {
	const {field, value, title, id} = props
	const router = useRouter()
	const dir = getDirection(router)

	const active = useCallback(() => {
		if (!field) return false
		return field.value.toString() === value.toString()
	}, [field, value])

	return (
		<div
			className={cc([
				styles.InputRadioHorizontal,
				dir && styles[dir],
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

export default InputRadioHorizontal
