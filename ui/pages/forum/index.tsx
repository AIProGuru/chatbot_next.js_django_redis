import React, {useEffect, useState} from "react"
import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import Button from "@/components/ui/Button/Button/Button"
import {useRouter} from "next/router"
import {
	useLazyGetInfoByUuidOptimisedQuery,
	UserProfile,
	UserProfilesInfoProfile,
} from "@/services/users.service"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"
import {useGetProfileAvatarsMutation} from "@/services/images.service"
import AvailablePlusIcon from "@/components/ui/Icons/AvailablePlus/AvailablePlusIcon"
import {Controller, useForm} from "react-hook-form"
import InputSearch from "@/components/ui/Forms/Inputs/Search/InputSearch"
import {getNickName} from "@/components/ui/Functions/GetNickname"
import {useUpdateAuth} from "@/components/auth/AuthProvider"
import {format} from "date-fns"
import {useGetForumsQuery, useLazyGetForumsQuery} from "@/services/blog.service"
import ForumAd from "@/components/ui/Forum/ForumAd/ForumAd"
import {NextSeo} from "next-seo"
import {useGetPublicProfileAvatarsMutation} from "@/services/anonymous.service"
import Head from "next/head"
import getConfig from "next/config"
import LoadMoreButton from "@/components/ui/Button/LoadMoreButton/LoadMoreButton"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"
import TryTabs from "@/components/ui/Tabs/TryTabs/TryTabs"
import { isNull } from "@/components/ui/Functions/IsNull"

const {publicRuntimeConfig} = getConfig()

function ForumsPage(props: any) {
	const {t} = useTranslation("site")
	const baseUrl = publicRuntimeConfig?.baseUrl || ""
	// loading prop demo
	const [showSplash, setShowSplash] = useState(true)
	const [forum, setForum] = useState<object[]>([])
	const [profilesAvatar, setProfilesAvatar] = useState<object[]>([])
	const [profilesInfo, setProfilesInfo] = useState<UserProfile[]>([])
	const [countPages, setCountPages] = useState(1)
	const [myForums, setMyForums] = useState<object[]>([])
	const [myAvatar, setMyAvatar] = useState<object[]>([])
	const [myProfileInfo, setMyProfileInfo] = useState<
		UserProfilesInfoProfile | undefined
	>(undefined)
	const [countMyForumPages, setCountMyForumPages] = useState(1)
	const [popularForums, setPopularForums] = useState<object[]>([])
	const [countPopularForumPages, setCountPopularForumPages] = useState(1)
	const [profilesPopularAvatar, setProfilesPopularAvatar] = useState<
		object[]
	>([])
	const [profilesPopularInfo, setProfilesPopularInfo] = useState<
		UserProfile[]
	>([])
	const [isForumloading, setIsForumLoading] = useState<boolean>(false)

	// router
	const router = useRouter()
	const auth = useUpdateAuth()

	const {handleSubmit, watch, control, reset, getValues} = useForm()

	// tabs state & function
	const [value, setValue] = useState(1)

	const search = watch("search_input")

	// rtk get user data
	const userProfilesData = useGetUserProfilesInfo()

	const {data: getForums, isLoading: isGetBlogsLoading} = useGetForumsQuery({
		page: countPages,
		pageSize: 10,
		search: search,
		current_profile_id: "",
		ordering: "RECENT",
	})

	const [triggerPopularForums, PopularForums] = useLazyGetForumsQuery()
	const [triggerMyForums, MyForums] = useLazyGetForumsQuery()
	const [registerGetProfilesAvatar] = useGetProfileAvatarsMutation()
	const [getInfoByUuid] = useLazyGetInfoByUuidOptimisedQuery()
	const [getPublicAvatars] = useGetPublicProfileAvatarsMutation()

	useEffect(() => {
		if (!search) return
		setForum([])
		setProfilesInfo([])
		setProfilesAvatar([])
		setCountPages(1)
	}, [search])

	const uniqueArrayById = (array: any[]) => {
		const a = array.concat()
		for (let i = 0; i < a.length; ++i) {
			for (let j = i + 1; j < a.length; ++j) {
				if (a[i].id === a[j].id) a.splice(j--, 1)
			}
		}

		return a
	}

	const getMyAvatar = () => {
		if (
			userProfilesData &&
			userProfilesData.profiles &&
			userProfilesData.current_profile_id
		) {
			const myProfileInfo = userProfilesData.profiles.find(
				(profile) => profile.id === userProfilesData.current_profile_id
			)
			registerGetProfilesAvatar({
				profileIds: [userProfilesData.current_profile_id],
			})
				.unwrap()
				.then((r) => {
					setMyAvatar(r)
				})
				.catch((e) => {
					console.log(e)
				})
				.finally(() => {
					setMyProfileInfo(myProfileInfo)
				})
		}
	}

	const getAvatarPopularBloggers = () => {
		if (PopularForums?.data?.results) {
			const ids = PopularForums!
				.data!.results.filter((item: any) => item?.current_profile_id)
				.map((item: any) => item?.current_profile_id)
			registerGetProfilesAvatar({
				profileIds: ids,
			})
				.unwrap()
				.then((r) => {
					setProfilesPopularAvatar((prevProfile) => [
						...prevProfile,
						...r,
					])
				})
				.catch((e) => {
					console.log(e)
				})
				.finally(() => {
					setPopularForums((prevProfile) =>
						uniqueArrayById([
							...prevProfile,
							...PopularForums!.data!.results,
						])
					)
				})
		}
	}

	const getPublicAvatarPopularBloggers = () => {
		if (PopularForums?.data?.results) {
			const ids = PopularForums!
				.data!.results.filter((item: any) => item?.current_profile_id)
				.map((item: any) => item?.current_profile_id)
			getPublicAvatars({
				profileIds: ids,
			})
				.unwrap()
				.then((r) => {
					setProfilesPopularAvatar((prevProfile) => [
						...prevProfile,
						...r,
					])
				})
				.catch((e) => {
					console.log(e)
				})
				.finally(() => {
					setPopularForums((prevProfile) =>
						uniqueArrayById([
							...prevProfile,
							...PopularForums!.data!.results,
						])
					)
				})
		}
	}

	const getAvatarBloggers = () => {
		if (!isGetBlogsLoading && getForums?.results) {
			const ids = getForums!.results
				.filter((item: any) => item?.current_profile_id)
				.map((item: any) => item?.current_profile_id)
			registerGetProfilesAvatar({
				profileIds: ids,
			})
				.unwrap()
				.then((r) => {
					setProfilesAvatar((prevProfile) => [...prevProfile, ...r])
				})
				.catch((e) => {
					console.log(e)
				})
				.finally(() => {
					setForum((prevProfile) =>
						uniqueArrayById([...prevProfile, ...getForums.results])
					)
					setIsForumLoading(false)
				})
		}
	}

	const getPublicAvatarBloggers = () => {
		if (!isGetBlogsLoading && getForums?.results) {
			const ids = getForums!.results
				.filter((item: any) => item?.current_profile_id)
				.map((item: any) => item?.current_profile_id)
			getPublicAvatars({
				profileIds: ids,
			})
				.unwrap()
				.then((r) => {
					setProfilesAvatar((prevProfile) => [...prevProfile, ...r])
				})
				.catch((e) => {
					console.log(e)
				})
				.finally(() => {
					setForum((prevProfile) =>
						uniqueArrayById([...prevProfile, ...getForums.results])
					)
					setIsForumLoading(false)
				})
		}
	}

	useEffect(() => {
		if (auth && userProfilesData?.current_profile_id) {
			getMyAvatar()
		}
	}, [userProfilesData?.current_profile_id])

	useEffect(() => {
		if (userProfilesData?.current_profile_id) {
			triggerMyForums({
				page: countMyForumPages,
				pageSize: 10,
				search: search,
				current_profile_id: userProfilesData?.current_profile_id,
				ordering: "RECENT",
			})
		}
	}, [userProfilesData?.current_profile_id, countMyForumPages])

	useEffect(() => {
		if (userProfilesData?.current_profile_id) {
			setCountMyForumPages(1)
			setMyForums([])
			triggerMyForums({
				page: countMyForumPages,
				pageSize: 10,
				search: search,
				current_profile_id: userProfilesData?.current_profile_id,
				ordering: "RECENT",
			})
		}
	}, [userProfilesData?.current_profile_id, search])

	useEffect(() => {
		triggerPopularForums({
			page: countPopularForumPages,
			pageSize: 10,
			search: search,
			current_profile_id: "",
			ordering: "MOST_POPULAR",
		})
	}, [countPopularForumPages])

	useEffect(() => {
		if (!search) return
		setCountPopularForumPages(1)
		setPopularForums([])
		triggerPopularForums({
			page: countPopularForumPages,
			pageSize: 10,
			search: search,
			current_profile_id: "",
			ordering: "MOST_POPULAR",
		})
	}, [search])

	useEffect(() => {
		if (MyForums && MyForums?.isSuccess && !MyForums?.isFetching) {
			setMyForums((prevProfile) =>
				uniqueArrayById([...prevProfile, ...MyForums?.data?.results])
			)
		}
	}, [MyForums])

	useEffect(() => {
		if (
			PopularForums &&
			PopularForums?.isSuccess &&
			!PopularForums?.isFetching
		) {
			if (isNull(auth)) return
			if (auth) {
				getAvatarPopularBloggers()
			} else {
				getPublicAvatarPopularBloggers()
			}
		}
	}, [PopularForums, auth])

	useEffect(() => {
		if (isNull(auth)) return
		if (auth) {
			getAvatarBloggers()
		} else {
			getPublicAvatarBloggers()
		}
	}, [isGetBlogsLoading, getForums?.results, auth])

	useEffect(() => {
		if (getForums?.results && !isGetBlogsLoading) {
			const ids: string[] = getForums!.results
				.filter((item: any) => item?.current_profile_id)
				.map((item: any) => item?.current_profile_id)

			ids.forEach((id) => {
				getInfoByUuid({
					profileId: id,
				})
					.unwrap()
					.then((r) => {
						setProfilesInfo((prevProfile) => [...prevProfile, r])
					})
					.catch((e) => {
						console.log(e)
					})
			})
		}
	}, [getForums?.results, isGetBlogsLoading])

	useEffect(() => {
		if (PopularForums?.data?.results) {
			const ids: string[] = PopularForums?.data?.results
				.filter((item: any) => item?.current_profile_id)
				.map((item: any) => item?.current_profile_id)

			ids.forEach((id) => {
				getInfoByUuid({
					profileId: id,
				})
					.unwrap()
					.then((r) => {
						setProfilesPopularInfo((prevProfile) => [
							...prevProfile,
							r,
						])
					})
					.catch((e) => {
						console.log(e)
					})
			})
		}
	}, [PopularForums?.data?.results])

	const count = getForums?.count || 0
	const maxPage = count <= 10 ? 1 : Math.round(count / 10)

	const schemaDataWebPage = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: t("site.homepage"),
				item: `${baseUrl}/${t("site.en")}/`,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: t("site.The SWINGERS forum"),
				item: `${baseUrl}/${t("site.en")}/forum`,
			},
		],

		" @graph": [
			{
				"@type": "Organization",
				"@id": `${baseUrl}#organization`,
				name: t("site.Swingers exchange couples"),
				url: `${baseUrl}`,
				email: "webmaster@swingers.co.il",
				logo: {
					"@type": "ImageObject",
					url: `${baseUrl}/seo.jpg`,
					width: "217",
					height: "49",
				},
				description: t(
					"site.The Swingers website is the leading and largest website for the"
				),

				contactPoint: {
					"@type": "ContactPoint",
					contactType: "customer support",
					telephone: "+972 50-534-5050",
					email: "webmaster@swingers.co.il",
				},
			},

			{
				"@type": "WebSite",
				"@id": `${baseUrl}/#website`,
				url: `${baseUrl}`,
				name: t("site.Swingers exchange couples"),

				publisher: {
					"@id": `${baseUrl}/#organization`,
				},
			},

			{
				"@type": "WebPage",
				"@id": `${baseUrl}/${t("site.en")}/forum/#webpage`,
				isPartOf: {
					"@id": `${baseUrl}/#website`,
				},
				url: `${baseUrl}/${t("site.en")}/forum`,
				name: t("site.Swingers forums"),
				description: t("site.Swingers forums"),
			},

			{
				"@type": "BlogPosting",
				"@id": `${baseUrl}/${t("site.en")}/forum/#forum`,
				mainEntityOfPage: {
					"@type": "WebPage",
					"@id": `${baseUrl}/${t("site.en")}/forum/#webpage`,
				},

				image: [
					{
						"@type": "ImageObject",
						url: `${baseUrl}/seo.jpg`,
						height: "217",
						width: "49",
					},
				],

				headline: t("site.Swingers forums"),
				copyrightYear: "2022",
				name: t("site.Swingers exchange couples"),
				inLanguage: t("site.en_US"),
				keywords: t(
					"site.Swingers exchange of couples exchange of couples parties"
				),
				description: t("site.Swingers forums"),
			},
		],
	}

	return (
		<>
			<NextSeo
				title={t(
					"site.The Forum of the Swingers Community and the Exchange of Couples of Israel"
				)}
				description={t(
					"site.In the Swingers forum you can post questions concerns and topics"
				)}
				openGraph={{
					type: "article",
					url: `${baseUrl}/${t("site.en")}/forum`,
					title: t(
						"site.The Forum of the Swingers Community and the Exchange of Couples of Israel"
					),
					description: t(
						"site.In the Swingers forum you can post questions concerns and topics"
					),
				}}
			/>
			<Head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(schemaDataWebPage),
					}}
				/>
			</Head>
			<AppDefaultLayout
				useHeader={true}
				useTabBar={true}
				fullHeight={true}
			>
				<div className="Blogs Main">
					<div className="TitleContainer">
						<p className="Title">{t("site.The SWINGERS forum")}</p>
						<p>
							{t(
								"site.Here you can raise questions, concerns and topics"
							)}
						</p>
						{auth && (
							<div className="Actions">
								{/* submit form */}
								<Button
									type={"button"}
									mode={"submit"}
									prevent={false}
									fullWidth={true}
									onClick={() => {
										router.push(`/forum/create`).then()
									}}
									icon={<AvailablePlusIcon />}
								>
									<p className="ActionButtonText">
										{t("site.Open a new topic")}
									</p>
								</Button>
							</div>
						)}
						<div className="SearchContainer">
							<Controller
								render={({field}) => {
									return (
										<InputSearch
											field={field}
											placeholder={t(
												"site.Search by topic or profile"
											)}
											id={"search.chatList"}
										/>
									)
								}}
								name={"search_input"}
								control={control}
							/>
						</div>
					</div>
					<div className="ProfileAdTabs">
						<TryTabs
							currentValue={value}
							setValue={setValue}
							tabs={[
								{
									value: 1,
									title: t("site.Recent issues"),
								},
								{
									value: 2,
									title: t("site.Hot topics"),
								},
								{
									value: 3,
									title: t("site.My forum"),
									hidden: !auth,
								},
							]}
						/>

						{/* tab 1 */}
						{value === 1 && (
							<div className="TabPanelContainer">
								<div className="Tab1">
									{!!forum.length && (
										<>
											{forum.map(
												(
													profileAd: any,
													index: number
												) => {
													const {
														user_username,
														title,
														text,
														created,
														slug,
														number_of_comments,
														number_of_views,
													} = profileAd

													const profileInfo: any =
														profilesInfo.find(
															(item: any) => {
																return (
																	item?.id ===
																	profileAd?.current_profile_id
																)
															}
														)

													return (
														<ForumAd
															key={index}
															images={
																profilesAvatar
															}
															href
															profile={{
																id: profileInfo?.id,
																manAge: profileInfo
																	?.man?.age,
																womanAge:
																	profileInfo
																		?.woman
																		?.age,
																profileType:
																	profileInfo?.profile_type,
																description:
																	text,
																verified:
																	profileInfo?.verified ||
																	false,
																nickname:
																	getNickName(
																		profileInfo
																	),
																username:
																	user_username,
																dateCreate: `${t(
																	"site.Posted in"
																)} - ${format(
																	new Date(
																		created
																	),
																	"dd/MM/yyyy"
																)} ${t(
																	"site.At"
																)} ${format(
																	new Date(
																		created
																	),
																	"HH:mm"
																)}`,
																titleBlog:
																	title,
																commentCount:
																	number_of_comments,
																viewedCount:
																	number_of_views,
																slug: slug,
															}}
														/>
													)
												}
											)}
											<LoadMoreButton
												page={countPopularForumPages}
												count={getForums?.count}
												isLoading={isForumloading}
												label={t("site.the next")}
												id={"button_load_more"}
												onClick={() => {
													setCountPages(
														countPages + 1
													)

													setIsForumLoading(true)
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
									{!!popularForums.length && (
										<>
											{popularForums.map(
												(
													profileAd: any,
													index: number
												) => {
													const {
														user_username,
														title,
														text,
														created,
														slug,
														number_of_comments,
														number_of_views,
													} = profileAd

													const profileInfo: any =
														profilesPopularInfo.find(
															(item: any) => {
																return (
																	item?.id ===
																	profileAd?.current_profile_id
																)
															}
														)

													return (
														<ForumAd
															key={index}
															href
															images={
																profilesPopularAvatar
															}
															profile={{
																id: profileInfo?.id,
																manAge: profileInfo
																	?.man?.age,
																womanAge:
																	profileInfo
																		?.woman
																		?.age,
																profileType:
																	profileInfo?.profile_type,
																description:
																	text,
																verified:
																	profileInfo?.verified ||
																	false,
																nickname:
																	getNickName(
																		profileInfo
																	),
																username:
																	user_username,
																dateCreate: `${t(
																	"site.Posted in"
																)} - ${format(
																	new Date(
																		created
																	),
																	"dd/MM/yyyy"
																)} ${t(
																	"site.At"
																)} ${format(
																	new Date(
																		created
																	),
																	"HH:mm"
																)}`,
																titleBlog:
																	title,
																commentCount:
																	number_of_comments,
																viewedCount:
																	number_of_views,
																slug: slug,
															}}
														/>
													)
												}
											)}
											<LoadMoreButton
												page={countPopularForumPages}
												count={
													PopularForums?.data?.count
												}
												isLoading={
													PopularForums?.isFetching
												}
												label={t("site.the next")}
												id={"button_load_more"}
												onClick={() => {
													setCountPopularForumPages(
														countPopularForumPages +
															1
													)
												}}
											/>
										</>
									)}
								</div>
							</div>
						)}

						{/* tab 3 */}
						{value === 3 && (
							<div className="TabPanelContainer">
								<div className="Tab1">
									{!!myForums.length && (
										<>
											{myForums.map(
												(
													profileAd: any,
													index: number
												) => {
													const {
														user_username,
														title,
														text,
														created,
														slug,
														number_of_comments,
														number_of_views,
													} = profileAd

													const profileInfo: any =
														myProfileInfo

													return (
														<ForumAd
															key={index}
															images={myAvatar}
															href
															profile={{
																id: profileInfo?.id,
																manAge: profileInfo
																	?.man?.age,
																womanAge:
																	profileInfo
																		?.woman
																		?.age,
																profileType:
																	profileInfo?.profile_type,
																description:
																	text,
																verified:
																	profileInfo?.verified ||
																	false,
																nickname:
																	getNickName(
																		profileInfo
																	),
																username:
																	user_username,
																dateCreate: `${t(
																	"site.Posted in"
																)} - ${format(
																	new Date(
																		created
																	),
																	"dd/MM/yyyy"
																)} ${t(
																	"site.At"
																)} ${format(
																	new Date(
																		created
																	),
																	"HH:mm"
																)}`,
																titleBlog:
																	title,
																commentCount:
																	number_of_comments,
																viewedCount:
																	number_of_views,
																slug: slug,
															}}
														/>
													)
												}
											)}
											<LoadMoreButton
												page={countMyForumPages}
												count={MyForums?.data?.count}
												isLoading={MyForums?.isFetching}
												label={t("site.the next")}
												id={"button_load_more"}
												onClick={() => {
													setCountMyForumPages(
														countMyForumPages + 1
													)
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
		</>
	)
}

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

export default ForumsPage
