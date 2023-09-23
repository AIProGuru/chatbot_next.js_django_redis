import styles from "./InputCheckboxHorizontalTransparent.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import React, {useCallback} from "react"
import Divider from "@/components/ui/Divider/Divider"

interface InputCheckboxHorizontalTransparentProps {
	field?: any
	value?: string
	title?: string
	id?: string
	disabled?: boolean
}

function InputCheckboxHorizontalTransparent(
	props: InputCheckboxHorizontalTransparentProps
) {
	const {field, value, title, id, disabled} = props

	const active = useCallback(() => {
		if (!field) return false
		return field.value
	}, [field])

	return (
		<div
			className={cc([styles.InputCheckboxHorizontalTransparent])}
			{...(id && {id: id})}
			style={{opacity: disabled ? 0.45 : 1}}
		>
			<div className={styles.Switch}>
				<div className={styles.Input}>
					<input
						{...(field && {...field})}
						type="checkbox"
						id={value}
						{...(active() ? {checked: true} : {checked: false})}
						disabled={disabled ? disabled : false}
					/>
				</div>

				{!!title && (
					<div className={styles.Text}>
						<div
							className={cc(
								active()
									? [styles.Title, styles.TitleActive]
									: [styles.Title]
							)}
						>
							<p>{title}</p>
						</div>
					</div>
				)}
			</div>
			<label htmlFor={value} />
			<Divider />
		</div>
	)
}

export default InputCheckboxHorizontalTransparent
