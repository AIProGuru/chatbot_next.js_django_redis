import React, {useEffect, useState} from "react"
import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import Button from "@/components/ui/Button/Button/Button"
import {useRouter} from "next/router"
import {
	useLazyGetInfoByUuidOptimisedQuery,
	UserProfilesInfoProfile,
} from "@/services/users.service"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"
import {useGetProfileAvatarsMutation} from "@/services/images.service"
import AvailablePlusIcon from "@/components/ui/Icons/AvailablePlus/AvailablePlusIcon"
import {Controller, useForm} from "react-hook-form"
import InputSearch from "@/components/ui/Forms/Inputs/Search/InputSearch"
import BlogAd from "@/components/ui/Blog/BlogAd/BlogAd"
import {getNickName} from "@/components/ui/Functions/GetNickname"
import {useUpdateAuth} from "@/components/auth/AuthProvider"
import {useGetBlogsQuery, useLazyGetBlogsQuery} from "@/services/blog.service"
import {format} from "date-fns"
import {NextSeo} from "next-seo"
import {useGetPublicProfileAvatarsMutation} from "@/services/anonymous.service"
import Head from "next/head"
import getConfig from "next/config"
import LoadMoreButton from "@/components/ui/Button/LoadMoreButton/LoadMoreButton"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"
import TryTabs from "@/components/ui/Tabs/TryTabs/TryTabs"
import { isNull } from "lodash"

const {publicRuntimeConfig} = getConfig()

function BlogsPage(props: any) {
	const {t} = useTranslation("site")
	const baseUrl = publicRuntimeConfig?.baseUrl || ""

	// loading prop demo
	const [showSplash, setShowSplash] = useState(true)
	const [blogs, setBlogs] = useState<object[]>([])
	const [profilesAvatar, setProfilesAvatar] = useState<object[]>([])
	const [profilesInfo, setProfilesInfo] = useState<object[]>([])
	const [countPages, setCountPages] = useState(1)
	const [myBlogs, setMyBlogs] = useState<object[]>([])
	const [myAvatar, setMyAvatar] = useState<object[]>([])
	const [myProfileInfo, setMyProfileInfo] = useState<
		UserProfilesInfoProfile | undefined
	>(undefined)
	const [countMyBlogPages, setCountMyBlogPages] = useState(1)
	const [popularBlogs, setPopularBlogs] = useState<object[]>([])
	const [countPopularPages, setCountPopularBlogPages] = useState(1)
	const [profilesPopularAvatar, setProfilesPopularAvatar] = useState<
		object[]
	>([])
	const [profilesPopularInfo, setProfilesPopularInfo] = useState<object[]>([])
	const [isBlogLoading, setIsBlogLoading] = useState<boolean>(false)

	// router
	const router = useRouter()
	const auth = useUpdateAuth()

	const {handleSubmit, watch, control, reset, getValues} = useForm()

	// tabs state & function
	const [value, setValue] = useState(1)

	const search = watch("search_input")

	// rtk get user data
	const userProfilesData = useGetUserProfilesInfo()

	const {data: getBlogs, isLoading: isGetBlogsLoading} = useGetBlogsQuery({
		page: countPages,
		pageSize: 10,
		search: search,
		current_profile_id: "",
		ordering: "RECENT",
	})

	const [triggerPopularBlogs, PopularBlog] = useLazyGetBlogsQuery()
	const [triggerMyBlogs, MyBlogs] = useLazyGetBlogsQuery()
	const [registerGetProfilesAvatar] = useGetProfileAvatarsMutation()
	const [getPublicAvatars] = useGetPublicProfileAvatarsMutation()
	const [getInfoByUuid] = useLazyGetInfoByUuidOptimisedQuery()

	useEffect(() => {
		if (!search) return
		setBlogs([])
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
		if (PopularBlog?.data?.results) {
			const ids = PopularBlog!
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
					setPopularBlogs((prevBlogs) =>
						uniqueArrayById([
							...prevBlogs,
							...PopularBlog!.data!.results,
						])
					)
				})
		}
	}

	const getPublicAvatarPopularBloggers = () => {
		if (PopularBlog?.data?.results) {
			const ids = PopularBlog!
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
					setPopularBlogs((prevProfile) =>
						uniqueArrayById([
							...prevProfile,
							...PopularBlog!.data!.results,
						])
					)
				})
		}
	}
	const getAvatarBloggers = () => {
		if (!isGetBlogsLoading && getBlogs?.results) {
			const ids: string[] = getBlogs!.results
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
					setBlogs((prevProfile) =>
						uniqueArrayById([...prevProfile, ...getBlogs.results])
					)
					setIsBlogLoading(false)
				})
		}
	}

	const getPublicAvatarBloggers = () => {
		if (!isGetBlogsLoading && getBlogs?.results) {
			const ids = getBlogs!.results
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
					setBlogs((prevProfile) =>
						uniqueArrayById([...prevProfile, ...getBlogs.results])
					)
					setIsBlogLoading(false)
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
			triggerMyBlogs({
				page: countMyBlogPages,
				pageSize: 10,
				search: search,
				current_profile_id: userProfilesData?.current_profile_id,
				ordering: "RECENT",
			})
		}
	}, [userProfilesData?.current_profile_id, countMyBlogPages])

	useEffect(() => {
		if (userProfilesData?.current_profile_id) {
			setCountMyBlogPages(1)
			setMyBlogs([])
			triggerMyBlogs({
				page: countMyBlogPages,
				pageSize: 10,
				search: search,
				current_profile_id: userProfilesData?.current_profile_id,
				ordering: "RECENT",
			})
		}
	}, [userProfilesData?.current_profile_id, search])

	useEffect(() => {
		triggerPopularBlogs({
			page: countPopularPages,
			pageSize: 10,
			search: search,
			current_profile_id: "",
			ordering: "MOST_POPULAR",
		})
	}, [countPopularPages])

	useEffect(() => {
		if (!search) return
		setCountPopularBlogPages(1)
		setPopularBlogs([])
		triggerPopularBlogs({
			page: countPopularPages,
			pageSize: 10,
			search: search,
			current_profile_id: "",
			ordering: "MOST_POPULAR",
		})
	}, [search])

	useEffect(() => {
		if (MyBlogs && MyBlogs?.isSuccess && !MyBlogs?.isFetching) {
			setMyBlogs((prevProfile) =>
				uniqueArrayById([...prevProfile, ...MyBlogs?.data?.results])
			)
		}
	}, [MyBlogs])

	useEffect(() => {
		if (PopularBlog && PopularBlog?.isSuccess && !PopularBlog?.isFetching) {
			if (isNull(auth)) return
			if (auth) {
				getAvatarPopularBloggers()
			} else {
				getPublicAvatarPopularBloggers()
			}
		}
	}, [PopularBlog, auth])

	useEffect(() => {
		if (isNull(auth)) return
		if (auth) {
			getAvatarBloggers()
		} else {
			getPublicAvatarBloggers()
		}
	}, [isGetBlogsLoading, getBlogs?.results, auth])

	useEffect(() => {
		if (getBlogs?.results && !isGetBlogsLoading) {
			const ids: string[] = getBlogs!.results
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
	}, [getBlogs?.results, isGetBlogsLoading])

	useEffect(() => {
		if (PopularBlog?.data?.results) {
			const ids: string[] = PopularBlog?.data?.results
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
	}, [PopularBlog?.data?.results])

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
				name: t("site.The SWINGERS blog"),
				item: `${baseUrl}/${t("site.en")}/blogs/`,
			},
		],
		"@graph": [
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
				"@id": `${baseUrl}/${t("site.en")}/blogs/#webpage`,
				isPartOf: {
					"@id": `${baseUrl}/#website`,
				},
				url: `${baseUrl}/${t("site.en")}/blogs/`,
				name: t("site.Registration form for the Swingers website"),
				description: t(
					"site.Registration form for the Swingers website"
				),
			},

			{
				"@type": "BlogPosting",
				"@id": `${baseUrl}/${t("site.en")}/blogs/#blogposting`,
				mainEntityOfPage: {
					"@type": "WebPage",
					"@id": `${baseUrl}/${t("site.en")}/blogs/#webpage`,
				},
				headline: t("site.swingers blog"),
				description: t(
					"site.The hot blogs of the Swingers website have everything you need to know about the world of exchange couples"
				),

				image: [
					{
						"@type": "ImageObject",
						url: `${baseUrl}/seo.jpg`,
						height: "217",
						width: "49",
					},
				],
			},
		],
	}

	return (
		<>
			<NextSeo
				title={t(
					"site.The blog of the Swingers community and the exchange of couples of Israel"
				)}
				description={t(
					"site.Here you can share stories, your fantasies"
				)}
				openGraph={{
					type: "article",
					url: `${baseUrl}/${t("site.en")}/blogs`,
					title: t(
						"site.The blog of the Swingers community and the exchange of couples of Israel"
					),
					description: t(
						"site.Here you can share stories, your fantasies"
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
						<p className="Title">{t("site.The SWINGERS blog")}</p>
						<p>
							{t(
								"site.Here you can share stories, your fantasies"
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
										router.push(`/blogs/create`).then()
									}}
									icon={<AvailablePlusIcon />}
								>
									<p className="ActionButtonText">
										{t("site.I want to blog")}
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
												"site.Look for a blogger or topic there"
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
									title: t("site.Recent blogs"),
								},
								{
									value: 2,
									title: t("site.Most popular"),
								},
								{
									value: 3,
									title: t("site.My blogs"),
									hidden: !auth,
								},
							]}
						/>

						{/* tab 1 */}
						{value === 1 && (
							<div className="TabPanelContainer">
								<div className="Tab1">
									{!!blogs.length && (
										<>
											{blogs.map(
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
														<BlogAd
															key={index}
															href
															images={
																profilesAvatar
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
												page={countPages}
												count={getBlogs?.count}
												isLoading={isBlogLoading}
												label={t("site.the next")}
												id={"button_load_more"}
												onClick={() => {
													setCountPages(
														countPages + 1
													)
													setIsBlogLoading(true)
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
									{!!popularBlogs.length && (
										<>
											{popularBlogs.map(
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
														<BlogAd
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
												page={countPopularPages}
												count={PopularBlog?.data?.count}
												isLoading={
													PopularBlog?.isFetching
												}
												label={t("site.the next")}
												id={"button_load_more"}
												onClick={() => {
													setCountPopularBlogPages(
														countPopularPages + 1
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
									{!!myBlogs.length && (
										<>
											{myBlogs.map(
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
														<BlogAd
															key={index}
															href
															images={myAvatar}
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
												page={countMyBlogPages}
												count={MyBlogs?.data?.count}
												isLoading={MyBlogs?.isFetching}
												label={t("site.the next")}
												id={"button_load_more"}
												onClick={() => {
													setCountMyBlogPages(
														countMyBlogPages + 1
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

export default BlogsPage
