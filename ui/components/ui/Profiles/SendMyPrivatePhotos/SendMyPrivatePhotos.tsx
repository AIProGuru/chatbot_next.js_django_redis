import styles from "./SendMyPrivatePhotos.module.scss"
import Button from "@/components/ui/Button/Button/Button"
import React from "react"
import {useTranslation} from "next-i18next"

interface SendMyPrivatePhotosProps {
	callback: Function
	status: boolean
	disabled: boolean
}

function SendMyPrivatePhotos(props: SendMyPrivatePhotosProps) {
	const {t} = useTranslation("site")
	const {callback, status, disabled} = props

	const handleButtonClick = () => {
		if (disabled || status) return
		callback && callback()
	}

	// console.log("cant_send_messages", cant_send_messages)

	return (
		<div className={styles.SendMyPrivatePhotos}>
			<Button
				type={"button"}
				prevent={true}
				onClick={handleButtonClick}
				id={"profile_button_request_photos"}
				variant={"outline"}
				border={"medium"}
				// {...(status && {disabled: status})}
				disabled={disabled || status ? true : false}
			>
				<p className={styles.ButtonText}>
					{status
						? t("site.Approval sent")
						: t("site.Send private images")}
				</p>
			</Button>
		</div>
	)
}

export default SendMyPrivatePhotos
