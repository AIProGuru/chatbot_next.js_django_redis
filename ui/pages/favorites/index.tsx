import React, {useEffect, useState} from "react"
import SplashScreen from "@/components/ui/Splash/SplashScreen"
import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import ProfileAd from "@/components/ui/Profiles/ProfileAd/ProfileAd"
import {useGetFavoriteProfilesQuery} from "@/services/users.service"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"
import {useRouter} from "next/router"
import {useGetProfileAvatarsMutation} from "@/services/images.service"
import {getNickName} from "@/components/ui/Functions/GetNickname"
import {NextSeo} from "next-seo"
import LoadMoreButton from "@/components/ui/Button/LoadMoreButton/LoadMoreButton"

function FavoritesPage() {
	const {t} = useTranslation("site")
	// loading prop demo
	const [isLoading, setIsLoading] = useState(true)
	const [showSplash, setShowSplash] = useState(true)
	const [profilesFavorites, setProfilesFavorites] = useState<object[]>([])
	const [profilesFavoritesAvatar, setProfilesFavoritesAvatar] = useState<
		object[]
	>([])
	const [countFavoritesPages, setCountFavoritesPages] = useState(1)
	const [isFavoriteLoading, setIsFavoriteLoading] = useState(false)

	const router = useRouter()
	// tabs state & function
	const [value, setValue] = useState(1)
	const handleChange = (newValue: number) => {
		setValue(newValue)
	}

	// rtk get user favorite data
	const {data: getFavoriteProfiles, isLoading: isGetFavoriteProfilesLoading} =
		useGetFavoriteProfilesQuery({
			page: countFavoritesPages,
			pageSize: 10,
		})

	const favoriteProfiles = getFavoriteProfiles?.results || []

	const [registerGetProfilesAvatar] = useGetProfileAvatarsMutation()

	const uniqueArrayById = (array: any[]) => {
		const a = array.concat()
		for (let i = 0; i < a.length; ++i) {
			for (let j = i + 1; j < a.length; ++j) {
				if (a[i].profile.id === a[j].profile.id) a.splice(j--, 1)
			}
		}

		return a
	}

	useEffect(() => {
		if (!isGetFavoriteProfilesLoading && favoriteProfiles.length) {
			const ids = favoriteProfiles.map((item: any) =>
				item?.profile?.id?.toString()
			)
			registerGetProfilesAvatar({
				profileIds: ids,
			})
				.unwrap()
				.then((r) => {
					setProfilesFavoritesAvatar((prevProfile) => [
						...prevProfile,
						...r,
					])
				})
				.catch((e) => {
					console.log(e)
				})
				.finally(() => {
					setProfilesFavorites((prevState) =>
						uniqueArrayById([...prevState, ...favoriteProfiles])
					)
					setIsFavoriteLoading(false)
				})
		}
	}, [isGetFavoriteProfilesLoading, favoriteProfiles])

	// loading end demo
	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false)
		}, 1000)
	}, [setIsLoading])

	const maxPage = getFavoriteProfiles?.page_links?.length

	// Logs
	// console.log("Get Favorite profiles", getFavoriteProfiles)

	return (
		<>
			<NextSeo title={t("site.favorites")} />
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
						<div className="ProfileAdTabs">
							{!!profilesFavorites?.length ? (
								<>
									{profilesFavorites?.map(
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
											} = profileAd.profile
											return (
												<ProfileAd
													key={index}
													href={`/profiles/${id}`}
													images={
														profilesFavoritesAvatar
													}
													status={is_online ? 1 : 2}
													location={{
														title:
															location?.title ||
															"-",
													}}
													distance={null}
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
															profileAd.profile
														),
														username: user_username,
													}}
													hrefURL={`/favorites/?profile_list_uid=${id}`}
													asURL={`/favorites/profiles/${id}`}
												/>
											)
										}
									)}
									<LoadMoreButton
										page={countFavoritesPages}
										count={
											getFavoriteProfiles &&
											getFavoriteProfiles.count
												? getFavoriteProfiles.count
												: 0
										}
										isLoading={isFavoriteLoading}
										label={t("site.the next")}
										id={"button_load_more"}
										onClick={() => {
											setCountFavoritesPages(
												countFavoritesPages + 1
											)
											setIsFavoriteLoading(true)
										}}
									/>
								</>
							) : (
								<div className="NoItem">
									<p>
										{t("site.It is a little deserted here")}
										{t(
											"site.it`s time to start celebrating"
										)}
									</p>
								</div>
							)}
						</div>
					</div>
				</AppDefaultLayout>
			)}
		</>
	)
}

FavoritesPage.requireAuth = true

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

export default FavoritesPage
