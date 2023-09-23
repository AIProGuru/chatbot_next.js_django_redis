import {useCallback, useEffect, useState} from "react"
import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import StoriesCarousel from "@/components/ui/Carousel/Stories/StoriesCarousel"
import StoriesButton from "@/components/ui/Carousel/Stories/StoriesButton"
import {useRouter} from "next/router"
import { 
	GetUsersProfilesResponse,
	RecentlyItem,
	useLazyGetRecentlyProfilesQuery,
	useLazyGetUsersProfilesMainInfoQuery,
	UserProfileFull,
} from "@/services/users.service"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"
import {connect} from "react-redux"

import {
	AvailableProfiles,
	useLazyGetAvailableTodayQuery,
} from "@/services/available.service"
import LoadMoreButton from "@/components/ui/Button/LoadMoreButton/LoadMoreButton"
import dynamic from "next/dynamic"
import getConfig from "next/config"
import {uniqueArrayByParam} from "@/components/ui/Functions/UniqueArray"
import TryTabs from "@/components/ui/Tabs/TryTabs/TryTabs"
import {useUpdateAuth} from "@/components/auth/AuthProvider"
import { getDirection } from "@/components/ui/Functions/GetDirection"

const DynamicFiltersCarousel: any = dynamic(
	() => import("@/components/ui/Carousel/Filters/FiltersCarousel")
)
const DynamicProfileAd: any = dynamic(
	() => import("@/components/ui/Profiles/ProfileAd/ProfileAd")
)
const DynamicStoriesButton: any = dynamic(
	() => import("@/components/ui/Carousel/Stories/StoriesButton")
)

const {publicRuntimeConfig} = getConfig()

function AfterLoginPage(props: any) {
	// Current Profile
	const {filtersState} = props
	const router = useRouter()
	const dir = getDirection(router)

	const botId = publicRuntimeConfig?.botId || ""

	const {t} = useTranslation("site")
	// loading prop demo
	// const [isLoading, setIsLoading] = useState(true)
	// const [showSplash, setShowSplash] = useState(true)
	const [profiles, setProfiles] = useState<UserProfileFull[] | undefined>(
		undefined
	)
	// const [lastOnline, setLastOnline] = useState<string | null>(null)
	// const [lastOnlineCanBeUsed, setLastOnlineCanBeUsed] = useState(0)
	const [recentlyProfiles, setRecentlyProfiles] = useState<RecentlyItem[]>([])
	const [countPages, setCountPages] = useState(1)
	const [isLoading, setIsLoading] = useState(false)
	const [recentIsLoading, setRecentIsLoading] = useState(false)
	const [countRecentlyPages, setCountRecentlyPages] = useState(1)

	const [availableToday, setAvailableToday] = useState<AvailableProfiles[]>(
		[]
	)
	const [profilesCount, setProfilesCount] = useState(0)

	// tabs state & function
	const [value, setValue] = useState(1)

	// const userProfilesData = useGetUserProfilesInfo()
	const auth = useUpdateAuth()
	const [triggerAvailableToday, availableTodayResponse] =
		useLazyGetAvailableTodayQuery()
	const [triggerGetUserProfiles] = useLazyGetUsersProfilesMainInfoQuery()
	const [triggerRecentlyProfiles, recentlyProfilesResponse] =
		useLazyGetRecentlyProfilesQuery()

	// functions
	const getAvailableToday = useCallback(() => {
		triggerAvailableToday({
			page: 1,
			pageSize: 10,
		})

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// get available today list
	useEffect(() => {
		getAvailableToday()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (availableTodayResponse && availableTodayResponse.isSuccess) {
			setAvailableToday((prevState) =>
				uniqueArrayByParam(
					[...prevState, ...availableTodayResponse.data.results],
					"id"
				)
			)
		}
	}, [availableTodayResponse])

	useEffect(() => {
		if (filtersState && !filtersState.lock) {
			setProfiles([])
			setCountPages(1)
		}
	}, [filtersState])

	const isFilterAllowed = useCallback(() => {
		// return filtersState && !filtersState.lock
		if (filtersState && filtersState.lock === true) {
			return false
		} else {
			return true
		}
	}, [filtersState])

	useEffect(() => {
		// setLastOnline(null)
		setProfiles(undefined)
	}, [filtersState, filtersState.lock])

	const getUsersProfilesQuery = () => {
		triggerGetUserProfiles({
			page: countPages,
			// page: lastOnline ? 1 : countPages,
			pageSize: 10,
			nickname: isFilterAllowed() ? filtersState.nickname : null,
			is_near_me: isFilterAllowed() ? filtersState.is_near_me : null,
			settlement: isFilterAllowed() ? filtersState.location : null,
			profile_type: isFilterAllowed() ? filtersState.profile_type : null,
			man_age: isFilterAllowed() ? filtersState.man_age : null,
			woman_age: isFilterAllowed() ? filtersState.woman_age : null,
			man_height: isFilterAllowed() ? filtersState.man_height : null,
			woman_height: isFilterAllowed() ? filtersState.woman_height : null,
			man_body_type: isFilterAllowed()
				? filtersState.man_body_type
				: null,
			woman_body_type: isFilterAllowed()
				? filtersState.woman_body_type
				: null,
			man_sexual_orientation: isFilterAllowed()
				? filtersState.man_sexual_orientation
				: null,
			woman_sexual_orientation: isFilterAllowed()
				? filtersState.woman_sexual_orientation
				: null,
			man_smoking_habits: isFilterAllowed()
				? filtersState.man_smoking_habits
				: null,
			woman_smoking_habits: isFilterAllowed()
				? filtersState.woman_smoking_habits
				: null,
			is_online: isFilterAllowed() ? filtersState.is_online : null,
			// last_online: lastOnline,
			verified: isFilterAllowed() ? filtersState.verified : null,
			sort_by: isFilterAllowed() ? filtersState.sort_by : null,
		})
			.unwrap()
			.then((r: GetUsersProfilesResponse) => {
				setProfiles((prevProfile) => {
					if (prevProfile) {
						return [...prevProfile, ...r.results]
					} else {
						return [...r.results]
					}
				})

				setProfilesCount(r.count)
			})
			.catch((e) => {
				console.log("triggerGetUserProfiles", e)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}

	useEffect(() => {
		if (auth && filtersState && filtersState.lock === false) {
			getUsersProfilesQuery()
		}
	}, [countPages, filtersState, auth])

	const getRecentlyProfiles = () => {
		triggerRecentlyProfiles({
			page: countRecentlyPages,
			pageSize: 10,
		})
	}

	useEffect(() => {
		if (value === 2) {
			getRecentlyProfiles()
		} else {
			setRecentlyProfiles((prevState) => [])
			setCountRecentlyPages(1)
			setRecentIsLoading(false)
		}
	}, [value])

	useEffect(() => {
		if (countRecentlyPages > 1) {
			getRecentlyProfiles()
		}
	}, [countRecentlyPages])

	useEffect(() => {
		if (recentlyProfilesResponse && recentlyProfilesResponse.isSuccess) {
			if (
				recentlyProfilesResponse.data.results &&
				recentlyProfilesResponse.data.results.length < 1
			)
				return

			// const recentProfiles = new Set<RecentlyItem>()
			//
			// recentlyProfiles.forEach((rp) => {
			// 	recentProfiles.add(rp)
			// })
			//
			// recentlyProfilesResponse.data.results.forEach((r) => {
			// 	if (!recentProfiles.has(r)) {
			// 		recentProfiles.add(r)
			// 	}
			// })
			//
			// setRecentlyProfiles((prevState) => [...Array.from(recentProfiles)])

			const uniqueArrayById = (array: RecentlyItem[]) => {
				const a = array.concat()
				for (let i = 0; i < a.length; ++i) {
					for (let j = i + 1; j < a.length; ++j) {
						if (a[i].id === a[j].id) a.splice(j--, 1)
					}
				}

				return a
			}

			const newItems = Array.from(recentlyProfilesResponse.data.results)

			setRecentlyProfiles((prevState) =>
				uniqueArrayById([...prevState, ...newItems])
			)

			setRecentIsLoading(false)
		}
	}, [recentlyProfilesResponse])

	const getNickName = (profileAd: any) => {
		switch (profileAd?.profile_type) {
			case "MAN":
				return profileAd?.man?.nickname
			case "WOMAN":
				return profileAd?.woman?.nickname
			case "COUPLE":
				return profileAd?.couple_nickname
		}
	}

	return (
		<AppDefaultLayout
			useHeader={true}
			useTabBar={true}
			fullHeight={true}
			useFilters={true}
		>
			<div className="Main">
				<div className="StoriesCarousel" dir={dir}>
					<StoriesCarousel>
						<StoriesButton
							image={"#"}
							href={"/available-today"}
							mode={"text"}
							text={t("site.available_t")}
						/>

						{availableToday &&
							availableToday
								.filter(
									(story: AvailableProfiles) =>
										story.profile.id !== botId
								)
								.map((story, index: number) => {
									const avatar = story.profile.avatar_image
									return (
										<DynamicStoriesButton
											key={index}
											image={
												avatar
													? `${avatar.s3_url}`
													: story.profile.profile_type
													? `/profiles/avatar_${story.profile.profile_type.toLowerCase()}_192.png`
													: "/profiles/avatar_couple_192.png"
											}
											profileId={story.profile.id}
										/>
									)
								})}
					</StoriesCarousel>
				</div>
				<div className="StoriesCarousel">
					<DynamicFiltersCarousel filters={filtersState} />
				</div>
				<div className="ProfileAdTabs" dir={dir}>
					<TryTabs
						currentValue={value}
						setValue={setValue}
						tabs={[
							{
								value: 1,
								title: t("site.Couples online"),
							},
							{
								value: 2,
								title: t("site.I watched recently"),
							},
						]}
					/>

					{/* tab 1 */}
					{value === 1 && (
						<div className="TabPanelContainer">
							<div className="Tab1">
								{profiles &&
									Array.isArray(profiles) &&
									profiles.length > 0 && (
										<>
											{profiles.map(
												(
													profileAd: any,
													index: number
												) => {
													const {
														id,
														profile_type,
														verified,
														location,
														about,
														profile_images,
														is_online,
														user_username,
														man,
														woman,
														can_send_messages,
														subscription,
														avatar_image,
														distance,
													} = profileAd

													return (
														<DynamicProfileAd
															key={index}
															href={`/profiles/${id}`}
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
															distance={distance}
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
																		profileAd
																	),
																username:
																	user_username,
																cantSendMessagesList:
																	can_send_messages,
																subscription:
																	subscription,
																avatarImage:
																	avatar_image,
															}}
														/>
													)
												}
											)}
											<LoadMoreButton
												page={countPages}
												// count={getUsersProfiles?.count}
												count={profilesCount}
												isLoading={isLoading}
												label={t("site.the next")}
												id={"button_load_more"}
												onClick={() => {
													if (
														profiles &&
														profiles.length > 0
													) {
														// setLastOnline(
														// 	profiles[
														// 		profiles.length -
														// 			1
														// 	].last_online
														// )

														setCountPages(
															countPages + 1
														)

														setIsLoading(true)
														// setLastOnlineCanBeUsed((prevState) => prevState + 1)
													}
												}}
											/>
										</>
									)}
							</div>
						</div>
					)}

					{/* tab 2 */}
					{value === 2 && (
						<div className="TabPanelContainer">
							<div className="Tab1">
								{!!recentlyProfiles?.length && (
									<>
										{recentlyProfiles &&
											recentlyProfiles
												.sort(
													(
														rp1: RecentlyItem,
														rp2: RecentlyItem
													) => {
														const d1 =
															new Date(
																rp1.created
															).getTime() || 0
														const d2 =
															new Date(
																rp2.created
															).getTime() || 0

														if (d1 < d2) return 1
														if (d1 > d2) return -1
														return 0
													}
												)
												.map(
													(
														profileAd: any,
														index: number
													) => {
														if (
															profileAd.profile ===
															null
														)
															return
														const {
															id,
															profile_type,
															verified,
															location,
															about,
															profile_images,
															is_online,
															user_username,
															man,
															woman,
															can_send_messages,
															avatar_image,
														} = profileAd.profile

														return (
															<DynamicProfileAd
																key={index}
																href={`/profiles/${id}`}
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
																			profileAd.profile
																		),
																	username:
																		user_username,
																	cantSendMessagesList:
																		can_send_messages,
																	avatarImage:
																		avatar_image,
																}}
															/>
														)
													}
												)}
										<LoadMoreButton
											page={countRecentlyPages}
											count={
												(recentlyProfilesResponse &&
													recentlyProfilesResponse.isSuccess &&
													recentlyProfilesResponse
														.data.count) ||
												0
												// getRecentlyProfiles?.count
											}
											isLoading={recentIsLoading}
											label={t("site.the next")}
											id={"button_load_more"}
											onClick={() => {
												setCountRecentlyPages(
													countRecentlyPages + 1
												)
												setRecentIsLoading(true)
											}}
										/>
									</>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</AppDefaultLayout>
	)
}

AfterLoginPage.requireAuth = true

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

const mapStateToProps = (state: any) => ({
	filtersState: state.FiltersSlice,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AfterLoginPage)
