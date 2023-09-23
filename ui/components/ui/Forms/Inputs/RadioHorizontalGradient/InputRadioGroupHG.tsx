import styles from "./InputRadioGroupHG.module.scss"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {cc} from "@/components/ui/Functions/Classnames"

interface InputRadioGroupHGProps {
	children: any
}

function InputRadioGroupHG(props: InputRadioGroupHGProps) {
	const {children} = props
	const router = useRouter()
	const dir = getDirection(router)

	return (
		<div className={cc([styles.InputRadioGroupHG, dir && styles[dir]])}>
			<div className={styles.Children}>{children}</div>
			<div className={styles.Line} />
		</div>
	)
}

export default InputRadioGroupHG
