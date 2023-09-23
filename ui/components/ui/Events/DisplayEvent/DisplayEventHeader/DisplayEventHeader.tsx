import styles from "./DisplayEventHeader.module.scss"
import CircleButton from "@/components/ui/Button/CircleButton/CircleButton"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import {useRouter} from "next/router"

interface DisplayEventHeaderProps {
	image: string
	closeCallback?: Function
}

function DisplayEventHeader(props: DisplayEventHeaderProps) {
	const {image, closeCallback} = props
	const router = useRouter()

	function closeButtonClick(event: any) {
		// router.back()
		closeCallback && closeCallback()
	}

	return (
		<div className={styles.DisplayEventHeader}>
			<div className={styles.CloseButton}>
				<CircleButton
					icon={<CloseIcon />}
					onClick={closeButtonClick}
					id={"circle_button_close_event"}
				/>
			</div>
			<div className={styles.Image}>
				<img src={image} alt="" />
			</div>
		</div>
	)
}

export default DisplayEventHeader
