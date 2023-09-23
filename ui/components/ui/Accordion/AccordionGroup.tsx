import styles from "./AccordionGroup.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"

interface AccordionGroupProps {
	children: any
}

function AccordionGroup(props: AccordionGroupProps) {
	const {children} = props

	return <div className={cc([styles.AccordionGroup])}>{children}</div>
}

export default AccordionGroup
