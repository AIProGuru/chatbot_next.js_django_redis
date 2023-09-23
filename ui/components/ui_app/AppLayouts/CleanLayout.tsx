import DefaultLayout from "@/components/ui/Layout/DefaultLayout"
import AppTabBar from "@/components/ui_app/AppTabBar/AppTabBar"
import {useEffect, useState} from "react"
import {useTranslation} from "next-i18next"
import {useAppDispatch} from "@/redux/store"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"

interface CleanLayoutProps {
	children: any
	useTabBar?: boolean
	fullHeight?: boolean
}

function CleanLayout(props: CleanLayoutProps) {
	// props and constants
	const {t} = useTranslation("site")
	const {children, useTabBar, fullHeight} = props
	const dispatch = useAppDispatch()

	// state
	const [openMenu, setOpenMenu] = useState(false)
	const [myID, setMyID] = useState<string | undefined>(undefined)
	const [myProfileIDs, setMyProfileIDs] = useState<string[]>([])

	// rtk
	const userProfilesData = useGetUserProfilesInfo()

	// current profile id
	useEffect(() => {
		if (userProfilesData) {
			// set my id as current profile id
			if (userProfilesData.current_profile_id) {
				setMyID(userProfilesData.current_profile_id.toString())
			}

			// set my profiles ids as ids of all my profiles
			if (userProfilesData && userProfilesData.profiles) {
				const ids = userProfilesData.profiles.map((el: any) => {
					return el.id
				})

				if (ids && ids.length > 0) {
					setMyProfileIDs(ids)
				}
			}
		}
	}, [dispatch, userProfilesData])

	return (
		<DefaultLayout fullHeight={fullHeight}>
			{useTabBar && (
				<AppTabBar openMenu={openMenu} setOpenMenu={setOpenMenu} />
			)}

			{children}
		</DefaultLayout>
	)
}

export default CleanLayout
