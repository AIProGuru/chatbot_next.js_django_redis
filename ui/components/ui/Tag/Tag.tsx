import styles from "./Tag.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"

interface TagProps {
	children: any
}

function Tag(props: TagProps) {
	const {children} = props
	const router = useRouter()
	const dir = getDirection(router)

	return (
		<div className={cc([styles.Tag, dir && styles[dir]])}>
			<p>{children}</p>
		</div>
	)
}

export default Tag
