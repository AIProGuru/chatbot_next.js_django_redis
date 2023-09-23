import styles from "./GoBackIcon.module.scss"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {cc} from "@/components/ui/Functions/Classnames"

function GoBackIcon() {
	const router = useRouter()
	const dir = getDirection(router)

	return <div className={cc([styles.GoBackIcon, dir && styles[dir]])} />
}

export default GoBackIcon
