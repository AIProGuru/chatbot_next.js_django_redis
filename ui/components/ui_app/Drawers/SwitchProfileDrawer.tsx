import SwitchProfileItem from "@/components/ui/Drawer/SwitchProfile/SwitchProfileItem"
import Drawer from "@/components/ui/Drawer/Drawer/Drawer"
import {useRouter} from "next/router"
import {useTranslation} from "next-i18next"
import {useSetCurrentProfileMutation} from "@/services/users.service"
import React, {useState} from "react"
import SubscriptionNotification from "@/components/ui/Subscripbtions/Notification/SubscriptionNotification"
import InputRadioSubscription from "@/components/ui/Forms/Inputs/RadioSubscription/InputRadioSubscription"
import {Controller, useForm} from "react-hook-form"
import Link from "@/components/ui/Button/Link/Link"
import {doRefresh} from "@/app/axiosInstance"
import AddProfileIcon from "@/components/ui/Icons/AddProfile/AddProfileIcon"
import {
	checkSubscription,
	Flag,
} from "@/components/ui/Functions/CheckSubscription"

interface SwitchProfileDrawerProps {
	switchProfileDrawer: boolean
	closeProfileSwitchDrawer: Function
	userProfilesData: any
	getProfileImage: Function
	currentProfileState?: any
	saveCurrentProfileInfo?: any
}

function SwitchProfileDrawer(props: SwitchProfileDrawerProps) {
	const {
		switchProfileDrawer,
		closeProfileSwitchDrawer,
		userProfilesData,
		getProfileImage,
	} = props

	const router = useRouter()
	const {t} = useTranslation("site")
	const {handleSubmit, control} = useForm()

	const [subscriptionDrawer, setSubscriptionDrawer] = useState(false)

	const [setCurrentProfile] = useSetCurrentProfileMutation({})

	// set current profile
	function applySelectedProfile(id: number, doReload = true) {
		setCurrentProfile({
			profileId: id,
		})
			.unwrap()
			.then((r: any) => {
				// removeCookies("accessToken")
				// router.push("/")
				// doReload && router.reload()
			})
			.catch((e: any) => {
				console.log(e)
				alert("Something went wrong")
			})
			.finally(() => {
				// doReload && router.reload()
				doRefresh()
					.then((dR: any) => {
						console.log("token do refresh after switch finally")
					})
					.catch((dE: any) => {
						console.log("token do refresh after switch catch")
					})
					.finally(() => {
						doReload && router.reload()
					})
			})
	}

	function switchToAnotherProfile(id: number) {
		// check for user data
		if (!userProfilesData) return

		const mainProfile = userProfilesData.main_profile_id

		if (
			userProfilesData.subscription &&
			userProfilesData.subscription.subscription &&
			checkSubscription(
				userProfilesData.subscription.subscription,
				Flag.createProfile
			)
		) {
			applySelectedProfile(id)
		} else {
			if (mainProfile && id === mainProfile) {
				applySelectedProfile(id)
			} else {
				router.push("/profiles/my/subscriptions")
			}
		}

		return

		// if (
		// 	userProfilesData.subscription_id === 1 ||
		// 	userProfilesData.subscription_type === "MULTIPLE"
		// ) {
		// 	// if subscribed, switch profiles
		// 	applySelectedProfile(id)
		// } else {
		// 	const mainProfile = userProfilesData.main_profile_id

		// 	if (mainProfile && id === mainProfile) {
		// 		applySelectedProfile(id)
		// 	} else {
		// 		// alert("Please subscribe")
		// 		setSubscriptionDrawer(true)
		// 		return
		// 	}
		// }
	}

	function switchToCreate(link: string) {
		// check for user data
		if (!userProfilesData) return
		if (
			userProfilesData.subscription &&
			userProfilesData.subscription.subscription &&
			checkSubscription(
				userProfilesData.subscription.subscription,
				Flag.createProfile
			)
		) {
			router.push(link).then()
		} else {
			router.push("/profiles/my/subscriptions")
		}

		return
	}

	function onFormSubmit(data: any) {
		console.log(data)
	}

	function getProfileNickname(profile: any): string {
		const profileType = profile.profile_type

		switch (profileType) {
			case "MAN":
				return profile.man?.nickname || "-"

			case "WOMAN":
				return profile.woman?.nickname || "-"

			case "COUPLE":
				return profile.couple_nickname || "-"

			default:
				return "-"
		}
	}

	return (
		<>
			<Drawer
				show={switchProfileDrawer}
				setShow={closeProfileSwitchDrawer}
				position={"bottom"}
				trigger={subscriptionDrawer}
				title={t("site.Profiles")}
			>
				<div className="SwitchProfileContainer">
					{userProfilesData &&
						userProfilesData.profiles &&
						userProfilesData.profiles.map((profile: any) => {
							// if (
							// 	profile.id ===
							// 	userProfilesData.current_profile_id
							// )
							// 	return (
							// 		<SwitchProfileItem
							// 			key={"edit_current_profile"}
							// 			title={`${t(
							// 				"site.Edit current profile"
							// 			)} (${getProfileNickname(
							// 				profile
							// 			)}, ${profile.profile_type
							// 				.toString()
							// 				.toLowerCase()})`}
							// 			onClick={() => {
							// 				switchToEdit()
							// 			}}
							// 			icon={<EditProfileIcon />}
							// 		/>
							// 	)
							if (
								profile.id ===
								userProfilesData.current_profile_id
							)
								return null

							return (
								<SwitchProfileItem
									key={profile.id}
									title={profile.profile_type}
									onClick={() => {
										// applySelectedProfile(profile.id)
										switchToAnotherProfile(profile.id)
									}}
									image={getProfileImage(
										userProfilesData.profiles,
										profile.id
									)}
								/>
							)
						})}

					{userProfilesData &&
						userProfilesData.profiles &&
						userProfilesData.profiles.length < 3 && (
							<SwitchProfileItem
								key={"create_new_profile"}
								title={t("site.Create new profile")}
								// href={"/auth/signup/0/step/1"}
								onClick={() => {
									switchToCreate(`/auth/signup/0/step/1`)
								}}
								icon={<AddProfileIcon />}
							/>
						)}
				</div>
			</Drawer>
			{/*/!* subscription *!/*/}
			<Drawer
				show={subscriptionDrawer}
				setShow={setSubscriptionDrawer}
				position={"bottom"}
			>
				<div className="SubscriptionDrawerContainer">
					<SubscriptionNotification
						subscription={{
							type: "VIP SWINGERS",
							valid_until: "2022-03-10",
						}}
					/>

					<form onSubmit={handleSubmit(onFormSubmit)}>
						<div className="PriceList">
							<Controller
								render={({field}) => (
									<>
										<InputRadioSubscription
											value={"0"}
											price={"100"}
											title={"abc"}
											field={field}
										/>

										<InputRadioSubscription
											value={"1"}
											price={"200"}
											title={"def"}
											field={field}
										/>

										<InputRadioSubscription
											value={"2"}
											price={"300"}
											title={"ghi"}
											field={field}
										/>
									</>
								)}
								name={"subscription"}
								control={control}
								defaultValue={""}
							/>
						</div>
					</form>

					<div className="Unsubscribe">
						<Link styled={true}>{t("site.Unsubscribe")}</Link>
					</div>
				</div>
			</Drawer>
		</>
	)
}

export default SwitchProfileDrawer
