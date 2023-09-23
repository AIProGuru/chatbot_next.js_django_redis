import styles from "./TryTabButton.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import {useCallback} from "react"

export enum TryTabButtonVariants {
	signIn = "sign-in",
}

interface TryTabButtonProps {
	title: string
	value: number
	currentValue: number
	onClick: Function
	variant?: TryTabButtonVariants
}

function TryTabButton(props: TryTabButtonProps) {
	const {title, onClick, value, currentValue, variant} = props

	const isActive = useCallback(() => {
		return value === currentValue
	}, [value, currentValue])

	const handleButtonClick = () => {
		onClick && onClick(value)
	}

	return (
		<button
			className={cc([
				styles.TryTabButton,
				isActive() && styles["TryTabButton-active"],
				variant && styles[`Variant-${variant}`],
			])}
			onClick={handleButtonClick}
		>
			<div className={styles.Label}>
				<div className={styles.Text}>{title}</div>
			</div>
			<div className={styles.Border} />
		</button>
	)
}

export default TryTabButton
