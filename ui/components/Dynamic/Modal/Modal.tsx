import styles from "@/components/ui/Profiles/ProfileAd/ProfileAd.module.scss"
import Modal from "react-modal"
// import Profile from "@/components/ui_pages/Profile/Profile"
import {useRouter} from "next/router"
import {useEffect, useState} from "react"

interface DynamicModalProps {
	component: any
	isOpen: boolean
}

function DynamicModal(props: DynamicModalProps) {
	const {component, isOpen} = props
	const router = useRouter()
	const [scroll, setScroll] = useState(0)

	useEffect(() => {
		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	})

	const handleScroll = () => {
		if (window.scrollY > 0) {
			setScroll(window.scrollY)
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			ariaHideApp={false}
			onRequestClose={() => {
				router.push("/").then(() => {
					setTimeout(() => {
						window.scrollTo(0, scroll)
					}, 100)
				})
			}}
			// contentLabel="Profile modal"
			onAfterClose={() => {
				setTimeout(() => {
					window.scrollTo(0, scroll)
				}, 100)
			}}
			// preventScroll={true}
		>
			<div className={styles.ProfileModal} id={"modal_profile"}>
				{/*<Profile modalProfileID={router.query.profile_list_uid} />*/}
				{component}
			</div>
		</Modal>
	)
}

export default DynamicModal
