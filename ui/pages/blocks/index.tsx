import React, {useEffect, useState} from "react"
import SplashScreen from "@/components/ui/Splash/SplashScreen"
import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import ProfileAd from "@/components/ui/Profiles/ProfileAd/ProfileAd"
import {
	useLazyGetBlockProfilesQuery,
	useUnBlockingProfileMutation,
} from "@/services/users.service"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"
import {useRouter} from "next/router"
import Button from "@/components/ui/Button/Button/Button"
import {getNickName} from "@/components/ui/Functions/GetNickname"
import {NextSeo} from "next-seo"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"
import BlogNewHeader from "@/components/ui/Blog/New/Header/BlogNewHeader"
import {useLazyGetProfileAvatarsOptimisedQuery} from "@/services/images.service"
import {uniqueArrayByParam} from "@/components/ui/Functions/UniqueArray"

function BlocksPage() {
	const {t} = useTranslation("site")
	// loading prop demo
	const [isLoading, setIsLoading] = useState(true)
	const [showSplash, setShowSplash] = useState(true)
	const [profiles, setProfiles] = useState<object[]>([])
	const [profilesAvatar, setProfilesAvatar] = useState<object[]>([])
	const [countPages, setCountPages] = useState(1)
	const [disabledBtn, setDisabledBtn] = useState<boolean>(false)

	const router = useRouter()
	const {tab} = router.query

	const defaultTab = typeof tab === "string" ? parseInt(tab) : 1
	// tabs state & function
	const [value, setValue] = useState(defaultTab)
	const handleChange = (newValue: number) => {
		setValue(newValue)
	}

	const [triggerBlockProfile, AllBlockProfile] =
		useLazyGetBlockProfilesQuery()

	const profilesBlock = AllBlockProfile?.data?.results || []

	const [getProfilesAvatar] = useLazyGetProfileAvatarsOptimisedQuery()
	const [registerUnBlockingProfile] = useUnBlockingProfileMutation()

	useEffect(() => {
		triggerBlockProfile({
			page: countPages,
			pageSize: 10,
			blocking_profile: "",
		})
	}, [countPages])

	useEffect(() => {
		if (profilesBlock.length) {
			const ids: string[] = profilesBlock.map((item: any) =>
				item?.blocking_profile?.id?.toString()
			)

			ids.forEach((id) => {
				getProfilesAvatar({
					profileId: id,
				})
					.unwrap()
					.then((r) => {
						setProfilesAvatar((prevProfile) => [...prevProfile, r])
					})
					.catch((e) => {
						console.log(e)
					})
			})

			setProfiles((prevProfile) =>
				uniqueArrayByParam([...prevProfile, ...profilesBlock], "id")
			)
		}
	}, [profilesBlock])

	const unBlockProfile = (id: string) => {
		setDisabledBtn(true)
		registerUnBlockingProfile({
			uuid: id,
		})
			.unwrap()
			.then((r) => {
				setTimeout(() => {
					setProfiles(
						profiles.filter((profile: any) => {
							return profile?.id !== id
						})
					)
				}, 150)
			})
			.catch((e) => {
				console.log(e)
			})
			.finally(() => {
				setTimeout(() => {
					setDisabledBtn(false)
				}, 300)
			})
	}

	// loading end demo
	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false)
		}, 1000)
	}, [setIsLoading])

	const count = AllBlockProfile?.data?.count || 0
	const maxPage = count <= 10 ? 1 : Math.round(count / 10)

	// Logs
	// console.log("Get Favorite profiles", getFavoriteProfiles)

	return (
		<>
			<NextSeo title={"Block list"} />
			{showSplash ? (
				<SplashScreen
					isLoading={isLoading}
					setShowSplash={setShowSplash}
				/>
			) : (
				<AppDefaultLayout
					useHeader={false}
					useTabBar={true}
					fullHeight={true}
				>
					<BlogNewHeader
						title={t("site.Block profiles")}
						callback={() => router.push("/profiles/my/edit")}
						icon={<GoBackIcon />}
					/>
					<div className="Main">
						<div className="ProfileAdTabs">
							{!!profiles?.length && (
								<>
									{profiles?.map(
										(profileAd: any, index: number) => {
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
											} = profileAd.blocking_profile
											return (
												<ProfileAd
													key={index}
													href={`/profiles/${id}`}
													images={profilesAvatar}
													status={is_online ? 1 : 2}
													location={{
														title:
															location?.title ||
															"-",
													}}
													distance={null}
													block={{
														disabled: disabledBtn,
														unblock: () => {
															unBlockProfile(
																profileAd?.id
															)
														},
													}}
													profile={{
														id: id,
														manAge: man?.age,
														womanAge: woman?.age,
														profileType:
															profile_type,
														description:
															about || "-",
														verified: verified,
														nickname: getNickName(
															profileAd.blocking_profile
														),
														username: user_username,
													}}
												/>
											)
										}
									)}
									{countPages !== maxPage && (
										<Button
											type={"button"}
											variant={"outline"}
											id={"button_load_more"}
											onClick={() =>
												setCountPages(countPages + 1)
											}
										>
											<p className="ButtonLoadMoreText">
												{t("site.the next")}
											</p>
										</Button>
									)}
								</>
							)}
						</div>
					</div>
				</AppDefaultLayout>
			)}
		</>
	)
}

BlocksPage.requireAuth = true

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

export default BlocksPage
