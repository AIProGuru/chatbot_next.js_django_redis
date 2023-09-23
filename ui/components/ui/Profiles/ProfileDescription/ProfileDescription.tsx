import styles from "./ProfileDescription.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"

interface ProfileDescriptionProps {
	rows: string[]
}

function ProfileDescription(props: ProfileDescriptionProps) {
	const {rows} = props

	return (
		<div className={cc([styles.ProfileDescription])} dir={"auto"}>
			{rows &&
				rows.map((row: string, index: number) => {
					return <p key={index}>{row}</p>
				})}
		</div>
	)
}

export default ProfileDescription
