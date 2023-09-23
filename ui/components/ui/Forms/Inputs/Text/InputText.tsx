import styles from "./InputText.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {useRouter} from "next/router"
import OKIcon from "@/components/ui/Icons/OKIcon"
import {useTranslation} from "next-i18next"

interface InputTextProps {
	field?: any
	required?: boolean | false
	placeholder?: string
	type?: "text" | "number" | "password" | "email"
	id?: string
	disabled?: boolean
	maxLength?: number
	error?: string
	autoComplete?: string
	spellCheck?: boolean
	showOKIcon?: boolean
	isSaved?: boolean
}

function InputText(props: InputTextProps) {
	const {
		field,
		required,
		placeholder,
		type,
		id,
		disabled,
		maxLength,
		error,
		autoComplete,
		spellCheck,
		showOKIcon,
		isSaved,
	} = props
	const router = useRouter()
	const dir = getDirection(router)
	const {t} = useTranslation("site")
	const isLeft = dir === "ltr"

	const activeSpan = required
		? isLeft
			? styles.ActiveSpanLeftRequired
			: styles.ActiveSpanRightRequired
		: isLeft
		? styles.ActiveSpanLeft
		: styles.ActiveSpanRight
	const isRequiredStyle = isLeft ? styles.LeftRequired : styles.RightRequired
	const noRequiredStyle = isLeft ? styles.Left : styles.Right

	// function allowOnlyNumbers(e: any) {
	// 	const regex = RegExp(/[0-9]+/g)
	// 	const test_result = regex.test(e.target.value)
	//
	// 	if (test_result) {
	// 		e.target.defaultValue = e.target.value
	// 	} else {
	// 		e.target.value = e.target.defaultValue
	// 	}
	// }

	return (
		<div className={styles.InputTextContainer}>
			<label
				className={cc([
					styles.InputText,
					required ? isRequiredStyle : noRequiredStyle,
					required && styles.Required,
					required && dir && styles["Required-" + dir],
					maxLength && styles["Counter"],
					maxLength && dir && styles["Counter-" + dir],
					dir && styles[dir],
				])}
				style={{opacity: disabled ? 0.45 : 1 , marginLeft:"0px"}}
				{...(id && {id: id})}
			>
				<input
					className={field?.value && styles.ActiveInput}
					{...(field && {...field})}
					{...(type !== undefined ? {type: type} : {type: "text"})}
					{...(type === "number" && {
						inputMode: "decimal",
						// onChange: (e) => {
						// 	allowOnlyNumbers(e)
						// 	field && field.onChange(e)
						// },
					})}
					// {...(placeholder && {placeholder: placeholder})}
					disabled={disabled ? disabled : false}
					// autoComplete={autoComplete ? "on" : "off"}
					{...(autoComplete && {autoComplete: autoComplete})}
					spellCheck={!!spellCheck}
					{...(maxLength && {maxLength: maxLength})}
				/>
				{placeholder && (
					<span className={field?.value && activeSpan}>
						{placeholder}
					</span>
				)}
				{field && field.value && maxLength && (
					<div className={styles.Count}>
						{isSaved && t("site.Saved")}{" "}
						{field.value.toString().length} / {maxLength}
					</div>
				)}
				{showOKIcon &&
					!error &&
					field &&
					field.value.toString().length > 0 && (
						<div
							className={cc([
								styles.OK,
								!maxLength && styles["OK-center"],
							])}
						>
							<OKIcon />
						</div>
					)}
			</label>
			<div className={styles.ErrorContainer}>
				{error && <p className={styles.InputTextError}>{error}</p>}
			</div>
		</div>
	)
}

export default InputText
