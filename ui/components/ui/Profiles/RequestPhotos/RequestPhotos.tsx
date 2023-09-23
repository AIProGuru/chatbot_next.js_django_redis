import styles from "./RequestPhotos.module.scss"
import Button from "@/components/ui/Button/Button/Button"
import React from "react"
import {useTranslation} from "next-i18next"

interface RequestPhotosProps {
	callback: Function
	status: boolean
	disabled: boolean
}

function RequestPhotos(props: RequestPhotosProps) {
	const {t} = useTranslation("site")
	const {callback, status, disabled} = props

	const handleButtonClick = () => {
		if (disabled || status) return
		callback && callback()
	}

	return (
		<div className={styles.RequestPhotos}>
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
						? t("site.Request sent")
						: t("site.Hi Im happy to get private photos")}
				</p>
			</Button>
		</div>
	)
}

export default RequestPhotos
