import styles from "./CreateGroupHeader.module.scss"
import {useTranslation} from "next-i18next"
import BlogNewHeader from "@/components/ui/Blog/New/Header/BlogNewHeader"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"

interface CreateGroupHeaderProps {
	setCreateGroupModal?: Function
}

const CreateGroupHeader = (props: CreateGroupHeaderProps) => {
	const {setCreateGroupModal} = props
	const {t} = useTranslation("site")

	return (
		<div className={styles.CreateGroupHeader}>
			<BlogNewHeader
				callback={() => {
					setCreateGroupModal && setCreateGroupModal(false)
				}}
				icon={<GoBackIcon />}
				title={"Create group"}
			/>
		</div>
	)
}

export default CreateGroupHeader
