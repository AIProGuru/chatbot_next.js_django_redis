import styles from "./FiltersButton.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import MaleIcon from "@/components/ui/Icons/MaleIcon"
import FemaleIcon from "@/components/ui/Icons/FemaleIcon"

interface FiltersButtonProps {
	el_key: string
	title: string
	callback: Function
	profileType?: string[]
}

function FiltersButton(props: FiltersButtonProps) {
	const {el_key, title, callback, profileType} = props
	const router = useRouter()
	const dir = getDirection(router)

	const manKeys = [
		"man_body_type",
		"man_sexual_orientation",
		"man_smoking_habits",
	]
	const womanKeys = [
		"woman_body_type",
		"woman_sexual_orientation",
		"woman_smoking_habits",
	]

	function handleClick(e: any) {
		e.preventDefault()
	}

	return (
		<div className={cc([styles.FiltersButton, dir && styles[dir]])}>
			{profileType && (
				<div className={styles.Icon}>
					{manKeys.includes(el_key) && <MaleIcon />}
					{womanKeys.includes(el_key) && <FemaleIcon />}
					{/*{(profileType.includes("MAN") ||*/}
					{/*	profileType.includes("COUPLE")) && <MaleIcon />}*/}

					{/*{(profileType.includes("WOMAN") ||*/}
					{/*	profileType.includes("COUPLE")) && <FemaleIcon />}*/}
				</div>
			)}
			<div className={styles.Text}>{title}</div>
			<div className={styles.CloseButton}>
				<button
					onClick={() => {
						callback && callback()
					}}
				>
					<CloseIcon style={"light"} size={"small"} />
				</button>
			</div>
		</div>
		// <>
		// 	<a
		// 		className={cc([styles.FiltersButton, dir && styles[dir]])}
		// 		onClick={handleClick}
		// 		id={"stories_button"}
		// 	>
		// 		<div className={cc([styles.TextMode])}>{text}</div>
		// 	</a>
		// </>
	)
}

export default FiltersButton
