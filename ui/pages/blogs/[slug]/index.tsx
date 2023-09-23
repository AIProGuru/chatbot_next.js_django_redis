import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import React, {useEffect, useState} from "react"
import SplashScreen from "@/components/ui/Splash/SplashScreen"
import {useRouter} from "next/router"
import {
	getInfoByUuid,
	useLazyGetInfoByUuidOptimisedQuery,
	UserProfile,
} from "@/services/users.service"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"
import {goBackEditMode} from "@/components/ui/Functions/GoBack"
import {useGetProfileAvatarsMutation} from "@/services/images.service"
import {toggleChatMode, toggleEditMode} from "@/redux/slices/EditProfileSlice"
import {connect} from "react-redux"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import MaleIcon from "@/components/ui/Icons/MaleIcon"
import FemaleIcon from "@/components/ui/Icons/FemaleIcon"
import CommentBlogIcon from "@/components/ui/Icons/CommentBlog/CommentBlogIcon"
import ViewedBlogIcon from "@/components/ui/Icons/ViewedBlog/ViewedBlogIcon"
import Divider from "@/components/ui/Divider/Divider"
import CommentBlog from "@/components/ui/Blog/CommentBlog/CommentBlog"
import Section from "@/components/ui/SignUp/Section/Section"
import BlogAd from "@/components/ui/Blog/BlogAd/BlogAd"
import {Controller, useForm} from "react-hook-form"
import InputComment from "@/components/ui/Forms/Inputs/Comment/InputComment"
import CommentGrayIcon from "@/components/ui/Icons/CommentGray/CommentGrayIcon"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"
import {useAuth} from "@/components/auth/AuthProvider"
import {
	getBlog,
	useAddCommentMutation,
	useLazyGetBlogQuery,
	useLazyGetBlogsQuery,
	useLazyGetCommentsQuery,
} from "@/services/blog.service"
import {format} from "date-fns"
import {NextSeo} from "next-seo"
import {wrapper} from "@/redux/store"
import Button from "@/components/ui/Button/Button/Button"
import {
	getPublicProfileAvatars,
	useGetPublicProfileAvatarsMutation,
} from "@/services/anonymous.service"
import Head from "next/head"
import {stripTags} from "@/components/ui/Functions/StripTags"
import getConfig from "next/config"
import {uniqueArrayByParam} from "@/components/ui/Functions/UniqueArray"
import {isNull} from "@/components/ui/Functions/IsNull"

const {publicRuntimeConfig} = getConfig()

type Avatar = {
	s3_url: string
}

type Comment = {
	id: number
	created: string
	content: string
	current_profile_id: string
}

type Profile = {
	id: string
	profile_type: string
	user_username: string
	location: {
		title: string
	}
	man?: {
		age: number
		nickname: string
	}
	woman?: {
		age: number
		nickname: string
	}
	verified?: boolean
}

function BlogPage(props: any) {
	const {t} = useTranslation("site")
	const baseUrl = publicRuntimeConfig?.baseUrl || ""
	const {
		editProfileState,
		toggleEditMode,
		toggleChatMode,
		modalProfileID,
		closeModal,
	} = props

	const [profileImage, setProfileImage] = useState<Avatar[]>([])
	const [profilesInfo, setProfilesInfo] = useState<UserProfile | undefined>(
		undefined
	)
	const [commentProfilesInfo, setCommentProfilesInfo] = useState<
		UserProfile[]
	>([])
	const [id, setID] = useState<string | undefined>(undefined)
	const [otherBlogs, setOtherBlogs] = useState<any>([])
	const [countPages, setCountPages] = useState(1)

	const {control, setValue, watch} = useForm()

	// router
	const router = useRouter()
	const {slug} = router.query
	const auth = useAuth()

	const [getProfileAvatars] = useGetProfileAvatarsMutation()
	const [triggerBlog, getBlogData] = useLazyGetBlogQuery()
	const [addComment] = useAddCommentMutation()
	const [triggerGetBlogComments, AllComments] = useLazyGetCommentsQuery()
	const [triggerGetOtherBlogs, AllOtherBlogs] = useLazyGetBlogsQuery()
	const [getPublicAvatars] = useGetPublicProfileAvatarsMutation()
	const [getInfoByUuid] = useLazyGetInfoByUuidOptimisedQuery()

	const getProfilesComments = () => {
		if (AllComments?.data?.results) {
			const ids: string[] = AllComments?.data?.results?.map(
				(comment: any) => comment?.current_profile_id
			)

			ids.forEach((id) => {
				getInfoByUuid({
					profileId: id,
				})
					.unwrap()
					.then((r) => {
						setCommentProfilesInfo((prevState) => [...prevState, r])
					})
					.catch((e) => {
						console.log(e)
					})
			})
		}
	}

	const getAvatarBlogger = () => {
		if (getBlogData?.data?.current_profile_id) {
			getProfileAvatars({
				profileIds: [getBlogData?.data?.current_profile_id],
			})
				.unwrap()
				.then((r) => {
					setProfileImage(r)
				})
				.catch((e) => {
					console.log(e)
					setProfileImage([])
				})
		}
	}

	const getPublicAvatarBlogger = () => {
		if (getBlogData?.data?.current_profile_id) {
			getPublicAvatars({
				profileIds: [getBlogData?.data?.current_profile_id],
			})
				.unwrap()
				.then((r) => {
					setProfileImage(r)
				})
				.catch((e) => {
					console.log(e)
					setProfileImage([])
				})
		}
	}

	const getProfileInfoBlogger = () => {
		if (getBlogData?.data?.current_profile_id) {
			getInfoByUuid({
				profileId: getBlogData?.data?.current_profile_id,
			})
				.unwrap()
				.then((r) => {
					console.log("getInfoByUuid", r)
					setProfilesInfo(r)
				})
				.catch((e) => {
					console.log(e)
				})
		}
	}

	const commentValue = watch("comment")

	const addBlogComment = () => {
		addComment({
			idBlog: getBlogData?.data?.id,
			content: commentValue,
		})
			.unwrap()
			.then((r) => {
				setValue("comment", "")
				triggerGetBlogComments({
					idBlog: getBlogData?.data?.id,
				})
				triggerBlog({
					slug: id,
				})
			})
			.catch((e) => {
				console.log(e)
			})
	}

	function closeBlog() {
		// if edit mode
		if (editProfileState && editProfileState.editMode) {
			goBackEditMode(router, toggleEditMode)
			return
		}

		// if from chat
		if (editProfileState && editProfileState.chatMode) {
			goBackEditMode(router, toggleChatMode)
			return
		}

		// if modal
		if (modalProfileID && closeModal) {
			closeModal(false)
			return
		}

		// etc
		router.push("/blogs").then()
	}

	const getNickName = (profile: UserProfile | undefined): string => {
		if (!profile) return ""
		const username = profile.user_username

		switch (profile.profile_type) {
			case "MAN":
				return profile.man.nickname ? profile.man.nickname : username
			case "WOMAN":
				return profile.woman.nickname
					? profile.woman.nickname
					: username
			case "COUPLE":
				return profile.couple_nickname
					? profile.couple_nickname
					: username

			default:
				return ""
		}
	}

	const count = AllOtherBlogs?.data?.count || 0
	const maxPage = count <= 3 ? 1 : Math.round(count / 3)

	const goToProfile = () => {
		if (!profilesInfo?.id || !auth) return
		router.push(`/profiles/${profilesInfo.id}`).then()
	}

	useEffect(() => {
		if (slug && typeof slug === "string" && !modalProfileID) {
			setID(slug)
		}

		if (modalProfileID && !slug) {
			setID(modalProfileID)
		}
	}, [slug, modalProfileID])

	useEffect(() => {
		if (id && typeof id === "string") {
			triggerBlog({
				slug: id,
			})
		}
	}, [id])

	useEffect(() => {
		if (getBlogData && getBlogData?.data?.current_profile_id) {
			triggerGetOtherBlogs({
				page: 1,
				pageSize: 3,
				search: "",
				current_profile_id: getBlogData?.data?.current_profile_id,
				ordering: "MOST_POPULAR",
			})
		}
	}, [getBlogData])

	useEffect(() => {
		if (getBlogData && getBlogData?.data?.current_profile_id) {
			triggerGetOtherBlogs({
				page: countPages,
				pageSize: 3,
				search: "",
				current_profile_id: getBlogData?.data?.current_profile_id,
				ordering: "MOST_POPULAR",
			})
		}
	}, [getBlogData, countPages])

	useEffect(() => {
		if (AllOtherBlogs && AllOtherBlogs?.data?.results) {
			setOtherBlogs((prevProfile: any) =>
				uniqueArrayByParam(
					[...prevProfile, ...AllOtherBlogs?.data?.results],
					"id"
				)
			)
		}
	}, [AllOtherBlogs])

	// get profile data
	useEffect(() => {
		if (getBlogData && getBlogData?.data?.id) {
			triggerGetBlogComments({
				idBlog: getBlogData?.data?.id,
			})
		}
	}, [getBlogData])

	useEffect(() => {
		if (AllComments.data?.results) {
			getProfilesComments()
		}
	}, [AllComments])

	useEffect(() => {
		if (getBlogData?.data?.current_profile_id) {
			getProfileInfoBlogger()
		}
	}, [getBlogData])

	useEffect(() => {
		if (isNull(auth)) return
		if (auth) {
			getAvatarBlogger()
		} else {
			getPublicAvatarBlogger()
		}
	}, [auth, getBlogData?.data?.current_profile_id])

	return (
		<>
			<NextSeo
				title={props?.blog?.data?.title}
				description={
					props?.blog?.data?.text &&
					props?.blog?.data?.text?.length > 150
						? `${props?.blog?.data?.text?.slice(0, 150)}...`
						: props?.blog?.data?.text
				}
				openGraph={{
					type: "article",
					url: `${baseUrl}/blogs/${props?.blog?.slug}`,
					title: props?.blog?.data?.title,
					description:
						props?.blog?.data?.text &&
						props?.blog?.data?.text?.length > 150
							? `${props?.blog?.data?.text?.slice(0, 150)}...`
							: props.blog?.data?.text,
					images: props?.blog?.avatar?.avatar
						? [
								{
									url: props?.blog?.avatar?.avatar,
									width: 800,
									height: 600,
									alt: "Blog",
								},
						  ]
						: [],
				}}
			/>
			<Head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(props?.blog?.seo),
					}}
				/>
			</Head>
			{id && (
				<>
					<AppDefaultLayout useHeader={false} useTabBar={false}>
						<div className="BlogPage">
							<div className={"GoBack"}>
								<TransparentButton
									icon={<GoBackIcon />}
									id={"transparent_button_go_back"}
									onClick={closeBlog}
								/>
							</div>
							<div
								onClick={goToProfile}
								style={{cursor: auth ? "pointer" : "auto"}}
								className="ProfileInfo"
							>
								<img
									// src={
									// 	profileImage
									// 		? `${profileImage[0]?.s3_url}`
									// 		: "/profiles/static150.png"
									// }
									src={
										profileImage && profileImage[0]
											? `${profileImage[0]?.s3_url}`
											: profilesInfo &&
											  profilesInfo.profile_type
											? `/profiles/avatar_${profilesInfo.profile_type.toLowerCase()}_64.png`
											: "/profiles/avatar_couple_64.png"
									}
									alt=""
								/>
								<p className="Nickname">
									{getNickName(profilesInfo)}
								</p>
								<div className="Age">
									{profilesInfo && profilesInfo?.man?.age && (
										<div className="ManAge">
											<div className="Icon">
												<MaleIcon />
											</div>
											<div className="Text">
												{profilesInfo?.man?.age}
											</div>
										</div>
									)}
									{profilesInfo && profilesInfo?.woman?.age && (
										<div className="WomanAge">
											<div className="Icon">
												<FemaleIcon />
											</div>
											<div className="Text">
												{profilesInfo?.woman?.age}
											</div>
										</div>
									)}
								</div>
							</div>
							<div className="TitleBlogContainer">
								<div className="Title">
									{getBlogData?.data?.title}
								</div>
								<div className="InfoBlog">
									{getBlogData?.data?.created && (
										<div className="Date">
											<p>
												{t("site.Posted in")} -{" "}
												{format(
													new Date(
														getBlogData?.data?.created
													),
													"dd/MM/yyyy"
												)}{" "}
												{t("site.At")}{" "}
												{format(
													new Date(
														getBlogData?.data?.created
													),
													"HH:mm"
												)}
											</p>
										</div>
									)}
									<div className="More">
										<div className="Comment">
											<ViewedBlogIcon />
											<span>
												{
													getBlogData?.data
														?.number_of_comments
												}
											</span>
										</div>
										<div className="Viewed">
											<CommentBlogIcon />
											<span>
												{
													getBlogData?.data
														?.number_of_views
												}
											</span>
										</div>
									</div>
								</div>
							</div>
							<Divider />
							<div className="DescriptionContainer">
								<div
									className="Description"
									dir={"auto"}
									style={{whiteSpace: "pre-line"}}
									dangerouslySetInnerHTML={{
										__html:
											(getBlogData &&
												getBlogData.data &&
												getBlogData.data.text &&
												stripTags(
													getBlogData.data.text
												)) ||
											"",
									}}
								>
									{/*{getBlogData &&*/}
									{/*	getBlogData.data &&*/}
									{/*	getBlogData.data.text &&*/}
									{/*	stripTags(getBlogData.data.text)}*/}
									{/*{getBlogData?.data?.text}*/}
								</div>
							</div>
							{auth && (
								<div className="InputCommentContainer">
									<Controller
										render={({field}) => {
											return (
												<InputComment
													field={field}
													placeholder={t(
														"site.Did you like them Did you connect Add a comment"
													)}
													id={"comment.textarea"}
													icon={<CommentGrayIcon />}
													onClick={addBlogComment}
												/>
											)
										}}
										name={"comment"}
										control={control}
										defaultValue={""}
									/>
								</div>
							)}
							{AllComments?.data?.results &&
								AllComments?.data?.results?.map(
									(comment: Comment) => {
										const profileInfo =
											commentProfilesInfo.find((item) => {
												return (
													item.id ===
													comment.current_profile_id
												)
											})
										return (
											<CommentBlog
												key={comment.id}
												name={getNickName(profileInfo)}
												dateCreate={comment.created}
												description={stripTags(
													comment.content
												)}
											/>
										)
									}
								)}
							{otherBlogs && (
								<Section
									title={t("site.Blog content")}
									padding={"small"}
									boldTitle
								>
									<Divider />
									<div className="OtherBlogs">
										{otherBlogs
											.filter(
												(item: any) =>
													item.slug !==
													getBlogData?.data?.slug
											)
											.map(
												(
													profileAd: any,
													index: number
												) => {
													const {
														number_of_comments,
														number_of_views,
														title,
														text,
														slug,
														created,
													} = profileAd

													return (
														<BlogAd
															key={index}
															href
															images={
																profileImage
															}
															profile={{
																id: profilesInfo?.id,
																manAge: profilesInfo
																	?.man?.age,
																womanAge:
																	profilesInfo
																		?.woman
																		?.age,
																profileType:
																	profilesInfo?.profile_type,
																description:
																	text,
																verified:
																	profilesInfo?.verified ||
																	false,
																nickname:
																	getNickName(
																		profilesInfo
																	),
																username:
																	profilesInfo?.user_username,
																dateCreate: `
													${t("site.Posted in")} -${" "}
													${format(new Date(created), "dd/MM/yyyy")}${" "}
													${t("site.At")} ${" "}
													${format(new Date(created), "HH:mm")}`,
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
										{countPages !== maxPage && (
											<div className="MoreButton">
												<Button
													type={"button"}
													variant={"outline"}
													id={"button_load_more"}
													onClick={() =>
														setCountPages(
															countPages + 1
														)
													}
												>
													<p className="ButtonLoadMoreText">
														{t("site.the next")}
													</p>
												</Button>
											</div>
										)}
										{/* <LoadMoreButton
												page={countPages}
												count={AllOtherBlogs?.data?.count}
												isLoading={AllOtherBlogs?.isFetching}
												label={t("site.the next")}
												id={"button_load_more"}
												onClick={() => {
													setCountPages(
														countPages + 1
													)
												}}
											/> */}
									</div>
								</Section>
							)}
						</div>
					</AppDefaultLayout>
				</>
			)}
		</>
	)
}

export const getServerSideProps = wrapper.getServerSideProps((store) => {
	return async (context: any) => {
		const locale = context.locale || "en"
		const blogSlug = encodeURIComponent(context.params.slug) || "0"
		const lang: any = await serverSideTranslations(locale, ["site"])
		const baseUrl = publicRuntimeConfig?.baseUrl || ""

		const ssrT = (landCode: string, phraseCode: string) => {
			return lang._nextI18Next.initialI18nStore[landCode].site.site[
				phraseCode
			]
		}

		const blogData = await store.dispatch(
			getBlog.initiate({
				slug: blogSlug,
			})
		)

		console.log("BLOG DATA", blogData)
		const profileData: any = blogData?.data?.current_profile_id
			? await store.dispatch(
					getInfoByUuid.initiate({
						profiles_ids: [blogData?.data?.current_profile_id],
					})
			  )
			: null

		const avatarData: any = blogData?.data?.current_profile_id
			? await store.dispatch(
					getPublicProfileAvatars.initiate({
						profileIds: [blogData?.data?.current_profile_id],
					})
			  )
			: null

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

		const nickname = await getNickName(profileData?.data?.results[0])

		const avatar =
			avatarData && avatarData?.data && avatarData?.data?.length
				? [avatarData?.data[0]?.s3_url]
				: null

		const schemaDataWebPage = {
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: ssrT(locale, "homepage"),
					item: `${baseUrl}/${ssrT(locale, "en")}/`,
				},

				{
					"@type": "ListItem",
					position: 2,
					name: ssrT(locale, "The SWINGERS blog"),
					item: `${baseUrl}/${ssrT(locale, "en")}/blogs/`,
				},
				{
					"@type": "ListItem",
					position: 3,
					name: blogData?.data?.title,
					item: `${baseUrl}/${ssrT(
						locale,
						"en"
					)}/blogs/${encodeURIComponent(blogData?.data?.slug)}`,
				},
			],

			"@graph": [
				{
					"@type": "Organization",
					"@id": `${baseUrl}#organization`,
					name: ssrT(locale, "Swingers exchange couples"),
					url: `${baseUrl}`,
					email: "webmaster@swingers.co.il",
					logo: {
						"@type": "ImageObject",
						url: `${baseUrl}/seo.jpg`,
						width: "217",
						height: "49",
					},
					description: ssrT(
						locale,
						"The Swingers website is the leading and largest website for the"
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
					name: ssrT(locale, "Swingers exchange couples"),
					publisher: {
						"@id": `${baseUrl}/#organization`,
					},
				},

				{
					"@type": "WebPage",
					"@id": `${baseUrl}/${ssrT(locale, "en")}/blogs/#webpage`,
					isPartOf: {
						"@id": `${baseUrl}/#website`,
					},
					url: `${baseUrl}/${ssrT(
						locale,
						"en"
					)}/blogs/${encodeURIComponent(blogData?.data?.slug)}`,
					name: blogData?.data?.title,
					description:
						blogData?.data?.text &&
						blogData?.data?.text?.length > 50
							? `${blogData?.data?.text?.slice(0, 50)}...`
							: blogData?.data?.text,
				},
				{
					"@type": "BlogPosting",
					"@id": `${baseUrl}/${ssrT(
						locale,
						"en"
					)}/blogs/#blogposting`,
					mainEntityOfPage: {
						"@type": "WebPage",
						"@id": `${baseUrl}/${ssrT(
							locale,
							"en"
						)}/blogs/#webpage`,
					},
					headline: blogData?.data?.title,
					image: avatar && {
						"@type": "ImageObject",
						url: avatar,
						height: "100",
						width: "90",
					},
					datePublished: blogData?.data?.created,
					dateModified: blogData?.data?.updated,
					author: {
						"@type": "Person",
						name: nickname,
					},
					description:
						blogData?.data?.text &&
						blogData?.data?.text?.length > 50
							? `${blogData?.data?.text?.slice(0, 50)}...`
							: blogData?.data?.text,
					articleBody: blogData?.data?.text,
				},
			],
		}

		return {
			props: {
				locale: locale,
				blog: {
					slug: blogSlug,
					data:
						blogData.status === "fulfilled" ? blogData.data : null,
					profile:
						profileData && nickname ? {nickname: nickname} : null,
					avatar: avatarData && avatar ? {avatar: avatar} : null,
					seo: schemaDataWebPage,
				},
				...(await serverSideTranslations(locale, ["site"])),
			},
		}
	}
})

// export default BlogPage
const mapStateToProps = (state: any) => ({
	editProfileState: state.EditProfileSlice,
})

const mapDispatchToProps = {
	toggleEditMode: toggleEditMode,
	toggleChatMode: toggleChatMode,
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogPage)
