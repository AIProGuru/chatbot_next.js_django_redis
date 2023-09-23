import styles from "./StoriesButton.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"
// import ProfilePage from "../../../../pages/profiles/[uid]"
// import {useState} from "react"
import Link from "next/link"

interface StoriesButtonProps {
	image: string
	href?: string
	mode?: "text"
	text?: string
	profileId?: string
}

function StoriesButton(props: StoriesButtonProps) {
	const {image, href, mode, text, profileId} = props
	const router = useRouter()
	const dir = getDirection(router)

	function handleClick() {
		href && router.push(href)
	}

	const container = (
		<a
			className={cc([styles.StoriesButton, dir && styles[dir]])}
			{...(href && {onClick: () => handleClick()})}
			id={"stories_button"}
		>
			{mode === "text" ? (
				<div className={cc([styles.TextMode])}>{text}</div>
			) : (
				<img src={image} alt="" />
			)}
		</a>
	)

	return href ? (
		container
	) : (
		<Link
            href={`/?profile_list_uid=${profileId}`}
            as={`/profiles/${profileId}`}
            legacyBehavior>
			{container}
		</Link>
	);
}

export default StoriesButton
