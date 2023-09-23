import styles from "./ChatListHeader.module.scss"
import Header from "@/components/ui/Header/Header"
import CreateGroupIcon from "@/components/ui/Icons/CreateGroupIcon"
import Nav, {INav} from "@/components/ui_app/AppHeader/Nav"
import {useAuth} from "@/components/auth/AuthProvider"
import {useTranslation} from "next-i18next"
import {UserInfo} from "@/redux/slices/UserInfoSlice"
import {
	checkSubscription,
	Flag,
} from "@/components/ui/Functions/CheckSubscription"

// import ActiveStarIcon from "@/components/ui/Icons/ActiveStarIcon"

interface ChatListHeaderProps {
	setCreateGroupModal: Function
	userProfilesData: UserInfo
}

const ChatListHeader = (props: ChatListHeaderProps) => {
	const {setCreateGroupModal, userProfilesData} = props
	const {t} = useTranslation("site")
	const auth = useAuth() || false

	const navChatListRight: INav[] = [
		{
			icon: <CreateGroupIcon />,
			authRequired: false,
			href:
				userProfilesData.subscription &&
				userProfilesData.subscription.subscription &&
				checkSubscription(
					userProfilesData.subscription.subscription,
					Flag.chatCreateGroup
				)
					? "/chat/create/group"
					: "/profiles/my/subscriptions",
			id: "icon_button_create_group",
			// callback: () => {
			// 	setCreateGroupModal(true)
			// },
		},
	]

	const navChatListLeft: INav[] = [
		// {
		// 	icon: <ActiveStarIcon />,
		// 	authRequired: false,
		// 	href: "/trychat/creator",
		// 	id: "icon_button_create_conv",
		// },
	]

	return (
		<div className={styles.ChatListHeader}>
			<Header
				buttonGroupLeft={<Nav navList={navChatListLeft} auth={auth} />}
				buttonGroupRight={
					<Nav navList={navChatListRight} auth={auth} />
				}
				textInCenter={t("site.Chat")}
			/>
		</div>
	)
}

export default ChatListHeader
