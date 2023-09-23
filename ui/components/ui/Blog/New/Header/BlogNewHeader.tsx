import styles from "./BlogNewHeader.module.scss"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {cc} from "@/components/ui/Functions/Classnames"

interface BlogNewHeaderProps {
	title?: string
	callback: Function
	icon: any
}

function BlogNewHeader(props: BlogNewHeaderProps) {
	const {title, callback, icon} = props
	const router = useRouter()
	const dir = getDirection(router)

	function close() {
		callback && callback()
	}

	return (
		<div className={cc([styles.BlogNewHeader, dir && styles[dir]])}>
			<div className={styles.Close}>
				<TransparentButton icon={icon} onClick={close} />
			</div>
			<div className={styles.Title}>{title && title}</div>
		</div>
	)
}

export default BlogNewHeader
