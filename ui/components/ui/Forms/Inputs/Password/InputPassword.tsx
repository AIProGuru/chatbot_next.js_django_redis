import styles from "./InputPassword.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {useRouter} from "next/router"
import ShowPassIcon from "@/components/ui/Icons/ShowPassIcon"
import UnShownPassIcon from "@/components/ui/Icons/UnShownPassIcon"
import {useState} from "react"
import OKIcon from "@/components/ui/Icons/OKIcon"

interface InputPasswordProps {
	field?: any
	required?: boolean | false
	placeholder?: string
	id?: string
	disabled?: boolean
	showPass?: boolean
	setShowPass?: any
	// todo: showPass & setShowPass is for backward compatibility, it is not used anymore...
	// remove this prop and update usage of this component everywhere
	error?: string
	autoComplete?: string
	spellCheck?: boolean
	showOKIcon?: boolean
}

function InputPassword(props: InputPasswordProps) {
	const {
		field,
		required,
		placeholder,
		id,
		disabled,
		error,
		autoComplete,
		spellCheck,
		showOKIcon,
	} = props
	const router = useRouter()
	const dir = getDirection(router)
	const isLeft = dir === "ltr"

	const [show, setShow] = useState(false)

	function toggle() {
		setShow((prevState) => !prevState)
	}

	const activeSpan = required
		? isLeft
			? styles.ActiveSpanLeftRequired
			: styles.ActiveSpanRightRequired
		: isLeft
		? styles.ActiveSpanLeft
		: styles.ActiveSpanRight
	const isRequiredStyle = isLeft ? styles.LeftRequired : styles.RightRequired
	const noRequiredStyle = isLeft ? styles.Left : styles.Right

	return (
		<>
			<label
				className={cc([
					styles.InputPassword,
					required ? isRequiredStyle : noRequiredStyle,
					required && styles.Required,
					required && dir && styles["Required-" + dir],
					dir && styles[dir],
				])}
				{...(id && {id: id})}
			>
				<input
					className={cc([
						field?.value && styles.ActiveInput,
						isLeft ? styles.InputLeft : styles.InputRight,
					])}
					{...(field && {...field})}
					{...{type: show ? "text" : "password"}}
					// {...(placeholder && {placeholder: placeholder})}
					disabled={disabled ? disabled : false}
					// autoComplete={autoComplete ? "on" : "off"}
					{...(autoComplete && {autoComplete: autoComplete})}
					spellCheck={!!spellCheck}
				/>
				{placeholder && (
					<span className={field?.value && activeSpan}>
						{placeholder}
					</span>
				)}
				<div
					onClick={toggle}
					className={cc([
						styles.ShowPass,
						isLeft ? styles.ShowPassLeft : styles.ShowPassRight,
						showOKIcon &&
							!error &&
							field &&
							field.value.toString().length > 0 &&
							dir &&
							styles["Move-" + dir],
					])}
				>
					{!show ? <ShowPassIcon /> : <UnShownPassIcon />}
				</div>

				{showOKIcon &&
					!error &&
					field &&
					field.value.toString().length > 0 && (
						<div
							className={cc([
								styles.OK,
								dir && styles["OK-" + dir],
							])}
						>
							<OKIcon />
						</div>
					)}
			</label>
			{error && <p className={styles.InputTextError}>{error}</p>}
		</>
	)
}

export default InputPassword
