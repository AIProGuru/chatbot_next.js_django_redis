import React, {useEffect, useState} from "react"
import SplashScreen from "@/components/ui/Splash/SplashScreen"
import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import ProfileAd from "@/components/ui/Profiles/ProfileAd/ProfileAd"
import {
	useLazyUpdatePeekProfileQuery,
	useRemoveFromPeekProfileMutation,
	useLazyGetPeekProfilesQuery,
	useGetProfilesWithImagesMutation,
} from "@/services/users.service"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"
import {
	useChangeStatusRequestMutation,
	useLazyGetRequestsProfileQuery,
} from "@/services/images.service"
import {useGetProfileAvatarsMutation} from "@/services/images.service"
import {getNickName} from "@/components/ui/Functions/GetNickname"
import {NextSeo} from "next-seo"
import LoadMoreButton from "@/components/ui/Button/LoadMoreButton/LoadMoreButton"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"
import {format} from "date-fns"
import {uniqueArrayByParam} from "@/components/ui/Functions/UniqueArray"
import TryTabs from "@/components/ui/Tabs/TryTabs/TryTabs"
import {useRouter} from "next/router"
import { getDirection } from "@/components/ui/Functions/GetDirection"

function PeekAtMePage() {
	const {t} = useTranslation("site")
	// loading prop demo
	const [isLoading, setIsLoading] = useState(true)
	const [showSplash, setShowSplash] = useState(true)
	const [countPages, setCountPages] = useState(1)
	const [peekProfiles, setPeekProfiles] = useState<object[]>([])
	const router = useRouter()
	const dir = getDirection(router)
	// const [profilesPeekAtMeAvatar, setProfilesPeekAtMeAvatar] = useState<
	// 	object[]
	// >([])
	const [requestProfiles, setRequestProfiles] = useState<object[]>([])
	const [requestedProfiles, setRequestedProfiles] = useState<object[]>([])
	const [profilesRequestProfileAvatar, setProfilesRequestProfileAvatar] =
		useState<object[]>([])

	// tabs state & function
	const [value, setValue] = useState(1)

	// rtk get user data
	const userProfilesData = useGetUserProfilesInfo()

	const [triggerRequestsProfile, privateImageRequests] =
		useLazyGetRequestsProfileQuery()

	// rtk
	const [triggerUpdatePeekProfile, responseUpdatePeekProfile] =
		useLazyUpdatePeekProfileQuery()
	const [registerRemovePeekProfile] = useRemoveFromPeekProfileMutation()
	const [triggerPeek, getPeekProfiles] = useLazyGetPeekProfilesQuery<any>()
	const [registerGetProfilesAvatar] = useGetProfileAvatarsMutation()
	const [registerChangeStatusRequest] = useChangeStatusRequestMutation()
	const [triggerGetProfilesWithImages] = useGetProfilesWithImagesMutation()

	useEffect(() => {
		triggerPeek({
			page: countPages,
			pageSize: 10,
		})
	}, [countPages])

	useEffect(() => {
		if (userProfilesData && userProfilesData?.current_profile_id) {
			triggerRequestsProfile({})
		}
	}, [userProfilesData])

	useEffect(() => {
		if (privateImageRequests && privateImageRequests.data) {
			const requestingProfiles = privateImageRequests.data.filter(
				(item: any) => {
					return (
						userProfilesData.current_profile_id === item.profile_id
					)
				}
			)
			const requestingProfileIds = requestingProfiles.map((item: any) => {
				return item.requesting_profile_id
			})

			const requestedProfiles: string[] =
				privateImageRequests.data.filter((item: any) => {
					return (
						userProfilesData.current_profile_id ===
						item.requesting_profile_id
					)
				})

			const requestedProfileIds = requestedProfiles.map((item: any) => {
				return item.profile_id
			})

			triggerGetProfilesWithImages({
				profiles_ids: [...requestingProfileIds, ...requestedProfileIds],
			})
				.unwrap()
				.then((r) => {
					r.profiles.forEach((profile) => {
						if (requestingProfileIds.includes(profile.id)) {
							setRequestProfiles((prevState) => [
								...prevState,
								profile,
							])
						}
						if (requestedProfileIds.includes(profile.id)) {
							setRequestedProfiles((prevState) => [
								...prevState,
								profile,
							])
						}
					})

					setProfilesRequestProfileAvatar((prevState) => [
						...prevState,
						...r.images,
					])
				})
				.catch((e) => {
					console.log(e)
				})
		}
	}, [privateImageRequests])

	const peekProfilesList = getPeekProfiles?.data?.results || []

	const uniqueArrayById = (array: any[]) => {
		const a = array.concat()
		for (let i = 0; i < a.length; ++i) {
			for (let j = i + 1; j < a.length; ++j) {
				if (a[i].visitor.id === a[j].visitor.id) a.splice(j--, 1)
			}
		}

		return a
	}

	useEffect(() => {
		if (
			getPeekProfiles &&
			getPeekProfiles.isSuccess &&
			getPeekProfiles.data &&
			getPeekProfiles.data.results
		) {
			setPeekProfiles((prevState) =>
				uniqueArrayById([...prevState, ...peekProfilesList])
			)
			// const peekAtMeIds = getPeekProfiles.data.results.map(
			// 	(item: any) => {
			// 		return item?.visitor?.id
			// 	}
			// )

			// if (peekAtMeIds.length > 0) {
			// 	registerGetProfilesAvatar({
			// 		profileIds: peekAtMeIds,
			// 	})
			// 		.unwrap()
			// 		.then((r) => {
			// 			setProfilesPeekAtMeAvatar((prevProfile) => [
			// 				...prevProfile,
			// 				...r,
			// 			])
			// 		})
			// 		.catch((e) => {
			// 			console.log(e)
			// 		})
			// 		.finally(() => {
			// 			setPeekProfiles((prevState) =>
			// 				uniqueArrayById([...prevState, ...peekProfilesList])
			// 			)
			// 		})
			// }
		}
	}, [getPeekProfiles, peekProfilesList])

	useEffect(() => {
		if (value === 1 && getPeekProfiles?.isSuccess) {
			triggerUpdatePeekProfile({})
		}
	}, [getPeekProfiles, value])

	const removePeekProfile = (id: string) => {
		registerRemovePeekProfile({
			profileId: id,
		})
			.unwrap()
			.then((r) => {
				setPeekProfiles(
					peekProfiles.filter((item: any) => item.id !== id)
				)
			})
			.catch((e) => {
				console.log(e)
			})
	}

	const setStatusRequestProfile = (
		id: string,
		status: "APPROVED" | "DISAPPROVED"
	) => {
		registerChangeStatusRequest({
			requestId: id,
			status: status,
		})
			.unwrap()
			.then((r: any) => {
				setRequestProfiles([])
				triggerRequestsProfile({
					myProfileId: userProfilesData!.current_profile_id,
				})
			})
			.catch((e: any) => {
				console.log(e)
			})
	}

	// loading end demo
	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false)
		}, 1000)
	}, [setIsLoading])

	return (
		<>
			<NextSeo title={t("site.Everyone who peeked at me")} />
			{showSplash ? (
				<SplashScreen
					isLoading={isLoading}
					setShowSplash={setShowSplash}
				/>
			) : (
				<AppDefaultLayout
					useHeader={true}
					useTabBar={true}
					fullHeight={true}
				>
					<div className="Main">
						<div className="ProfileAdTabs" dir = {dir}>
							{/* <AdminMessage
								open={adminOpen}
								setOpen={setAdminOpen}
								text={t(
									"site.There will be a variety of system messages"
								)}
							/> */}

							<TryTabs
								currentValue={value}
								setValue={setValue}
								tabs={[
									{
										value: 1,
										title: t(
											"site.Everyone who peeked at me"
										),
									},
									{
										value: 2,
										title: t(
											"site.Send me a request for photos"
										),
									},
									{
										value: 3,
										title: t(
											"site.My private images requests"
										),
									},
								]}
							/>

							{value === 1 && (
								<div className="TabPanelContainer">
									<div className="Tab1">
										{!!peekProfiles?.length && (
											<>
												{peekProfiles?.map(
													(
														profileAd: any,
														index: number
													) => {
														if (!profileAd.visitor)
															return
														const {
															id,
															man,
															woman,
															profile_type,
															verified,
															location,
															about,
															profile_images,
															is_online,
															user_username,
															avatar_image,
														} = profileAd.visitor
														return (
															<ProfileAd
																key={index}
																href={`/profiles/${id}`}
																// images={
																// 	profilesPeekAtMeAvatar
																// }
																status={
																	is_online
																		? 1
																		: 2
																}
																location={{
																	title:
																		location?.title ||
																		"-",
																}}
																distance={null}
																profile={{
																	id: id,
																	manAge: man?.age,
																	womanAge:
																		woman?.age,
																	profileType:
																		profile_type,
																	description:
																		about ||
																		"-",
																	verified:
																		verified,
																	nickname:
																		getNickName(
																			profileAd.visitor
																		),
																	username:
																		user_username,
																	dateCreate: `${t(
																		"site.Viewed in"
																	)} - ${format(
																		new Date(
																			profileAd.created
																		),
																		"dd/MM/yyyy"
																	)} ${t(
																		"site.At"
																	)} ${format(
																		new Date(
																			profileAd.created
																		),
																		"HH:mm"
																	)}`,
																	avatarImage:
																		avatar_image,
																}}
																removeProfile={() =>
																	removePeekProfile(
																		profileAd.id
																	)
																}
																hrefURL={`/peek-at-me/?profile_list_uid=${id}`}
																asURL={`/peek-at-me/profiles/${id}`}
															/>
														)
													}
												)}
												<LoadMoreButton
													page={countPages}
													count={
														getPeekProfiles?.data
															?.count
													}
													isLoading={
														getPeekProfiles?.isFetching
													}
													label={t("site.the next")}
													id={"button_load_more"}
													onClick={() => {
														setCountPages(
															countPages + 1
														)
													}}
												/>
											</>
										)}
									</div>
								</div>
							)}

							{/*	tab 2 */}
							{value === 2 && (
								<div className="TabPanelContainer">
									<div className="Tab1">
										{!!privateImageRequests?.data
											?.length && (
											<>
												{privateImageRequests?.data?.map(
													(
														requestAd: any,
														index: number
													) => {
														const profile: any =
															requestProfiles.find(
																(item: any) => {
																	return (
																		item?.id ===
																		requestAd.requesting_profile_id
																	)
																}
															)
														if (!profile) return
														return (
															<ProfileAd
																key={index}
																href={`/profiles/${profile?.id}`}
																images={
																	profilesRequestProfileAvatar
																}
																status={
																	profile?.is_online
																		? 1
																		: 2
																}
																location={{
																	title:
																		profile
																			?.location
																			?.title ||
																		"-",
																}}
																distance={null}
																profile={{
																	id: profile?.id,
																	manAge: profile
																		?.man
																		?.age,
																	womanAge:
																		profile
																			?.woman
																			?.age,
																	profileType:
																		profile?.profile_type,
																	description:
																		profile?.about ||
																		"-",
																	verified:
																		profile?.verified,
																	nickname:
																		getNickName(
																			profile
																		),
																	username:
																		profile?.user_username,
																	dateCreate:
																		requestAd?.last_modified_date
																			? `${t(
																					"site.Created in"
																			  )} - ${format(
																					new Date(
																						requestAd?.last_modified_date
																					),
																					"dd/MM/yyyy"
																			  )} ${t(
																					"site.At"
																			  )} ${format(
																					new Date(
																						requestAd?.last_modified_date
																					),
																					"HH:mm"
																			  )}`
																			: "",
																}}
																requestImage={{
																	dataRequest:
																		requestAd,
																	accept: () =>
																		setStatusRequestProfile(
																			requestAd?.id,
																			"APPROVED"
																		),
																	reject: () =>
																		setStatusRequestProfile(
																			requestAd?.id,
																			"DISAPPROVED"
																		),
																}}
																hrefURL={`/peek-at-me/?profile_list_uid=${profile?.id}`}
																asURL={`/peek-at-me/profiles/${profile?.id}`}
															/>
														)
													}
												)}
											</>
										)}
									</div>
								</div>
							)}
							{/*	tab 3 */}
							{value === 3 && (
								<div className="TabPanelContainer">
									<div className="Tab1">
										{!!privateImageRequests?.data
											?.length && (
											<>
												{privateImageRequests?.data?.map(
													(
														requestAd: any,
														index: number
													) => {
														const profile: any =
															requestedProfiles.find(
																(item: any) => {
																	return (
																		item?.id ===
																		requestAd.profile_id
																	)
																}
															)
														if (!profile) return
														return (
															<ProfileAd
																key={index}
																href={`/profiles/${profile?.id}`}
																images={
																	profilesRequestProfileAvatar
																}
																status={
																	profile?.is_online
																		? 1
																		: 2
																}
																location={{
																	title:
																		profile
																			?.location
																			?.title ||
																		"-",
																}}
																distance={null}
																profile={{
																	id: profile?.id,
																	manAge: profile
																		?.man
																		?.age,
																	womanAge:
																		profile
																			?.woman
																			?.age,
																	profileType:
																		profile?.profile_type,
																	description:
																		profile?.about ||
																		"-",
																	verified:
																		profile?.verified,
																	nickname:
																		getNickName(
																			profile
																		),
																	username:
																		profile?.user_username,
																	dateCreate:
																		requestAd?.last_modified_date
																			? `${t(
																					"site.Created in"
																			  )} - ${format(
																					new Date(
																						requestAd?.last_modified_date
																					),
																					"dd/MM/yyyy"
																			  )} ${t(
																					"site.At"
																			  )} ${format(
																					new Date(
																						requestAd?.last_modified_date
																					),
																					"HH:mm"
																			  )}`
																			: "",
																}}
																requestImage={{
																	dataRequest:
																		requestAd,
																}}
																hrefURL={`/peek-at-me/?profile_list_uid=${profile?.id}`}
																asURL={`/peek-at-me/profiles/${profile?.id}`}
															/>
														)
													}
												)}
											</>
										)}
									</div>
								</div>
							)}
						</div>
					</div>
				</AppDefaultLayout>
			)}
		</>
	)
}

PeekAtMePage.requireAuth = true

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

export default PeekAtMePage
