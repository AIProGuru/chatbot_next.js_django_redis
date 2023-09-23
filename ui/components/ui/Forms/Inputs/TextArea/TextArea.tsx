import React from "react"
import styles from "./TextArea.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {useRouter} from "next/router"
import {useTranslation} from "next-i18next"

interface InputTextProps {
	onChange?: any
	onPaste?: any
	field?: any
	required?: boolean | false
	placeholder?: string
	type?: "text" | "number"
	id?: string
	maxLength?: number
	row?: number
	error?: string
	isSaved?: boolean
}

function TextArea(props: InputTextProps) {
	const {
		onChange,
		onPaste,
		field,
		required,
		placeholder,
		type,
		id,
		maxLength,
		row,
		error,
		isSaved,
	} = props
	const router = useRouter()
	const dir = getDirection(router)
	const {t} = useTranslation("site")

	return (
		<>
			<label
				className={cc([
					styles.TextArea,
					required && styles.Required,
					dir && styles[dir],
				])}
				{...(id && {id: id})}
			>
				<textarea
					// maxLength={!!maxLength && maxLength}
					{...(maxLength && {maxLength: maxLength})}
					rows={row ? row : 6}
					{...(field && {...field})}
					{...(type !== undefined ? {type: type} : {type: "text"})}
					{...(type === "number" && {inputMode: "decimal"})}
					{...(placeholder && {placeholder: placeholder})}
					{...(onPaste && {onPaste: onPaste})}
					{...(onChange && {onChange: onChange})}
				/>
				<span
					className={
						dir === "ltr" ? styles.SpanLeft : styles.SpanRight
					}
				>
					{maxLength && field && (
						<>
							{isSaved && t("Saved")} {field?.value.length}/
							{maxLength}
						</>
					)}
				</span>
			</label>
			<div className={styles.ErrorContainer}>
				{error && <p className={styles.InputTextError}>{error}</p>}
			</div>
		</>
	)
}

export default TextArea
