import styles from "./TryChatLayer.module.scss"
import {ReactNode} from "react"
// import ChatHeader from "@/components/TryChat/Components/Header/ChatHeader/ChatHeader"
// import ChatListHeader from "@/components/TryChat/Components/Header/ChatListHeader/ChatListHeader"
// import ChatInput from "@/components/TryChat/Components/ChatInput/ChatInput"
import {cc} from "@/components/ui/Functions/Classnames"

interface TryChatLayerProps {
	children: ReactNode
}

const TryChatLayer = ({children}: TryChatLayerProps) => {
	return (
		<div className={styles.TryChatLayer}>
			<div className={cc([styles.TryChatContainer])}>{children}</div>
		</div>
	)
}

export default TryChatLayer
