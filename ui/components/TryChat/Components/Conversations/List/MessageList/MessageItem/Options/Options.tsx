import styles from "./Options.module.scss"
// import {TFunction, useTranslation} from "next-i18next"
// import {useMemo} from "react"
import MessageComponent from "@/components/TryChat/Components/Conversations/List/MessageList/MessageItem/Message/MessageComponent"
import {cc} from "@/components/ui/Functions/Classnames"
import {Message} from "@/TryChat/@types/Conversations/Conversation"

interface OptionsProps {
	setShowOptions: Function
	isAuthor: boolean
	message: Message
	options: any[]
	subscriptionOrCredits: () => boolean
}

function Options(props: OptionsProps) {
	const {setShowOptions, isAuthor, message, options, subscriptionOrCredits} =
		props

	return (
		<div
			className={cc([
				styles.MessageWithOptions,
				isAuthor && styles["MessageWithOptions-author"],
			])}
		>
			<div
				className={styles.Backdrop}
				onClick={() => {
					setShowOptions(false)
				}}
			/>
			<div
				className={styles.Container}
				onClick={() => {
					setShowOptions(false)
				}}
			>
				<MessageComponent
					setShowOptions={setShowOptions}
					isAuthor={isAuthor}
					isOptions={true}
					message={message}
					subscriptionOrCredits={subscriptionOrCredits}
				/>
				<div className={styles.Options}>
					<div className={styles.List}>
						{options.map((option) => {
							return (
								<div
									className={styles.Option}
									key={option.id}
									onClick={option.onClick}
								>
									<p>{option.title}</p>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Options
