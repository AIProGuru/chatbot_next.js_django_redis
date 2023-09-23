import React from "react"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {toggleChatMode, toggleEditMode} from "@/redux/slices/EditProfileSlice"
import {connect} from "react-redux"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"

const DynamicProfile = dynamic(
	() => import("@/components/ui_pages/Profile/Profile")
)

function ProfilePage(props: any) {
	const router = useRouter()
	const {uid} = router.query
	return uid ? <DynamicProfile modalProfileID={uid} /> : null
}

ProfilePage.requireAuth = true

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

// export default ProfilePage
const mapStateToProps = (state: any) => ({
	editProfileState: state.EditProfileSlice,
})

const mapDispatchToProps = {
	toggleEditMode: toggleEditMode,
	toggleChatMode: toggleChatMode,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
