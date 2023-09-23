import styles from "./EditProfileListItem.module.scss"
import ArrowIcon from "@/components/ui/Icons/ArrowIcon"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {cc} from "@/components/ui/Functions/Classnames"

interface EditProfileListItemProps<T> {
	title: string
	value?: T
	callback?: Function
}

function EditProfileListItem<T>(props: EditProfileListItemProps<T>) {
	const {title, value, callback} = props
	const router = useRouter()
	const dir = getDirection(router)

	function handleOnClick() {
		callback && callback()
	}

	return (
		<div
			className={cc([styles.EditProfileListItem, dir && styles[dir]])}
			{...(callback && {onClick: handleOnClick})}
		>
			<div className={styles.Title}>{title}</div>
			<div className={styles.Other}>
				{value && <div className={styles.Value}>{value}</div>}
				<div className={styles.Icon}>
					<ArrowIcon />
				</div>
			</div>
		</div>
	)
}

export default EditProfileListItem
