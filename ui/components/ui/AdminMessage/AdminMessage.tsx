import styles from "./AdminMessage.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {useTranslation} from "next-i18next"
import TransparentButton from "../Button/TransparentButton/TransparentButton"
import CloseIcon from "../Icons/CloseIcon"
interface AdminMessageProps {
	open: boolean
	setOpen: any
	text: JSX.Element
}

function AdminMessage(props: AdminMessageProps) {
	const {t} = useTranslation("site")

	const {open, setOpen, text} = props
	const router = useRouter()
	const dir = getDirection(router)

	const onClose = () => {
		setOpen(false)
	}

	return (
		<div
			style={{display: open ? "display" : "none"}}
			className={cc([styles.AdminMessage, dir && styles[dir]])}
		>
			<div className={styles.Text}>{text}</div>
			<div className={styles.GoBack}>
				<TransparentButton
					icon={<CloseIcon style={"light"} />}
					id={"transparent_button_go_back"}
					onClick={onClose}
				/>
			</div>
		</div>
	)
}

export default AdminMessage
