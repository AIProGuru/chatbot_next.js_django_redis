import React, {ReactNode} from "react"

import styles from "./ButtonGroup.module.scss"

interface ButtonGroupProps {
	children: ReactNode // Use the ReactNode type to represent any valid children
}

function ButtonGroup({children}: ButtonGroupProps) {
	return <div className={styles.ButtonGroup}>{children}</div>
}

export default ButtonGroup
