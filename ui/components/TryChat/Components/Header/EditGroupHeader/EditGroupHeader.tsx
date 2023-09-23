import styles from "./EditGroupHeader.module.scss"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"
import {useTranslation} from "next-i18next"

interface EditGroupHeaderProps {
	closeModal: () => void
	emitDeleteConversation: (isGroup: boolean) => void
	isGroupAdmin: () => boolean | undefined
}

function EditGroupHeader(props: EditGroupHeaderProps) {
	const {closeModal, emitDeleteConversation, isGroupAdmin} = props
	const {t} = useTranslation("site")

	return (
		<div className={styles.EditGroupHeader}>
			<div className={styles.HeaderGroup}>
				<div
					className={styles.GoBack}
					onClick={() => {
						closeModal()
					}}
				>
					<div className={styles.Icon}>
						<GoBackIcon />
					</div>
				</div>
				<div className={styles.Title}>Edit group details</div>
			</div>
			<div
				className={styles.LeaveGroup}
				onClick={() => {
					emitDeleteConversation(true)
				}}
			>
				{isGroupAdmin() ? t("site.Delete chat") : t("site.Leave chat")}
			</div>
		</div>
	)
}

export default EditGroupHeader
