import styles from "./ItemLoader.module.scss"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {cc} from "@/components/ui/Functions/Classnames"

function ItemLoader() {
	const router = useRouter()
	const dir = getDirection(router)

	return (
		<div className={cc([styles.ItemLoader, styles[dir]])}>
			<div className={styles.Avatar} />
			<div className={styles.Info}>
				<div className={styles.Title} />
				<div className={styles.Message} />
			</div>
		</div>
	)
}

export default ItemLoader
