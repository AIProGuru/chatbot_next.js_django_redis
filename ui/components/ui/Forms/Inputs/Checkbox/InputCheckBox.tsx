import styles from "./InputCheckBox.module.scss"
import React from "react"
import {cc} from "@/components/ui/Functions/Classnames"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"

interface InputCheckBoxProps {
	field?: any
	value?: string
	title?: string | any
	id?: string
	variant?: "signin"
}

function InputCheckBox(props: InputCheckBoxProps) {
	const {field, value, title, id, variant} = props
	const router = useRouter()
	const dir = getDirection(router)

	return (
		<div
			className={cc([
				styles.InputCheckBox,
				variant !== undefined && styles["Variant-" + variant],
				dir && styles[dir],
			])}
			{...(id && {id: id})}
		>
			<div className={styles.Switch}>
				<div className={styles.Input}>
					<input
						{...(field && {...field})}
						type="checkbox"
						id={value}
					/>
				</div>

				{!!title && (
					<div className={styles.Text}>
						<div className={cc([styles.Title])}>
							<p>{title}</p>
						</div>
					</div>
				)}
			</div>
			<label htmlFor={value} />
		</div>
	)
}

export default InputCheckBox
