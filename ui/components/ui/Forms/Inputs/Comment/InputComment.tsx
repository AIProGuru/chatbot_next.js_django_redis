import React, {useEffect} from "react"
import styles from "./InputComment.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {useRouter} from "next/router"
import autosize from "autosize"
import Button from "@/components/ui/Button/Button/Button"
import {useTranslation} from "next-i18next"

interface InputTextProps {
	field?: any
	required?: boolean | false
	placeholder?: string
	type?: "text" | "number"
	id?: string
	onClick: Function
	icon: JSX.Element
}

function InputComment(props: InputTextProps) {
	const {t} = useTranslation("site")
	const {field, required, placeholder, type, id, onClick, icon} = props
	const router = useRouter()
	const dir = getDirection(router)

	useEffect(() => {
		autosize(document.querySelectorAll("textarea"))
	})

	return (
		<label
			className={cc([
				styles.InputComment,
				required && styles.Required,
				dir && styles[dir],
			])}
			{...(id && {id: id})}
		>
			<div className={styles.Icon}>{icon}</div>
			<textarea
				rows={1}
				{...(field && {...field})}
				{...(type !== undefined ? {type: type} : {type: "text"})}
				{...(type === "number" && {inputMode: "decimal"})}
				{...(placeholder && {placeholder: placeholder})}
			/>
			<div className={cc([styles.Actions, dir && styles[dir]])}>
				{/* submit form */}
				<Button
					id="button_send"
					type={"button"}
					fullWidth={true}
					onClick={onClick}
					disabled={!field.value}
				>
					<p className={"SubmitButtonText"}>{t("site.Sent")}</p>
				</Button>
			</div>
		</label>
	)
}

export default InputComment
