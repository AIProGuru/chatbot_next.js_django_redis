import {useTranslation} from "next-i18next"
import {SwipeAction, TrailingActions} from "react-swipeable-list"
import {cc} from "@/components/ui/Functions/Classnames"
import styles from "@/components/ui/Chats/ChatsContainer/ChatsContainer.module.scss"
import DeleteIcon from "@/components/ui/Icons/DeleteIcon"
import React from "react"

interface TrailingActionsProps {
	deleteConversation: () => void
	isGroup: () => boolean
	isGroupAdmin: () => boolean | undefined
}

const ItemActions = (props: TrailingActionsProps) => {
	const {t} = useTranslation("site")
	const {deleteConversation, isGroup, isGroupAdmin} = props

	return (
		<TrailingActions>
			<SwipeAction
				destructive={true}
				onClick={() => {
					deleteConversation()
				}}
			>
				<div className={cc([styles.SwipeButton, styles.SwipeDelete])}>
					<DeleteIcon />
					<p>
						{!isGroup()
							? t("site.Hide chat")
							: isGroupAdmin()
							? t("site.Delete chat")
							: t("site.Leave chat")}
					</p>
				</div>
			</SwipeAction>
		</TrailingActions>
	)
}

export default ItemActions
