import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import React, {useEffect, useState} from "react"
import SplashScreen from "@/components/ui/Splash/SplashScreen"
import {useRouter} from "next/router"
import {
	getInfoByUuid,
	useLazyGetInfoByUuidOptimisedQuery,
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
import {Controller, useForm} from "react-hook-form"
import InputComment from "@/components/ui/Forms/Inputs/Comment/InputComment"
import CommentGrayIcon from "@/components/ui/Icons/CommentGray/CommentGrayIcon"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"
import {useAuth} from "@/components/auth/AuthProvider"
import {format} from "date-fns"
import {NextSeo} from "next-seo"
import {wrapper} from "@/redux/store"
import {
	useAddCommentMutation,
	useLazyGetCommentsQuery,
	getForum,
	useLazyGetForumQuery,
	useLazyGetForumsQuery,
} from "@/services/blog.service"
import ForumAd from "@/components/ui/Forum/ForumAd/ForumAd"
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
	}
	woman?: {
		age: number
	}
	verified?: boolean
}

function ForumPage(props: any) {
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
	const [profilesInfo, setProfilesInfo] = useState<Profile>()
	const [id, setID] = useState<string | undefined>(undefined)
	const [otherForums, setOtherForums] = useState<any>([])
	const [countPages, setCountPages] = useState(1)
	const [commentProfilesInfo, setCommentProfilesInfo] = useState<Profile[]>(
		[]
	)

	const {control, setValue, watch} = useForm()

	// router
	const router = useRouter()
	const {slug} = router.query
	const auth = useAuth()

	useEffect(() => {
		if (slug && typeof slug === "string" && !modalProfileID) {
			setID(slug)
		}

		if (modalProfileID && !slug) {
			setID(modalProfileID)
		}
	}, [slug, modalProfileID])

	const [getProfileAvatars] = useGetProfileAvatarsMutation()
	const [triggerForum, getForumData] = useLazyGetForumQuery()
	const [addComment] = useAddCommentMutation()
	const [triggerGetForumComments, AllComments] = useLazyGetCommentsQuery()
	const [triggerGetOtherForums, AllOtherForums] = useLazyGetForumsQuery()
	const [getPublicAvatars] = useGetPublicProfileAvatarsMutation()
	const [getInfoByUuid] = useLazyGetInfoByUuidOptimisedQuery()

	useEffect(() => {
		if (id && typeof id === "string") {
			triggerForum({
				slug: id,
			})
		}
	}, [id])

	useEffect(() => {
		if (getForumData?.data?.current_profile_id) {
			triggerGetOtherForums({
				page: 1,
				pageSize: 10,
				search: "",
				current_profile_id: getForumData?.data?.current_profile_id,
				ordering: "MOST_POPULAR",
			})
		}
	}, [getForumData?.data?.current_profile_id])

	useEffect(() => {
		if (getForumData?.data?.current_profile_id) {
			triggerGetOtherForums({
				page: countPages,
				pageSize: 3,
				search: "",
				current_profile_id: getForumData?.data?.current_profile_id,
				ordering: "MOST_POPULAR",
			})
		}
	}, [countPages])

	useEffect(() => {
		if (AllOtherForums?.data?.results) {
			setOtherForums((prevProfile: any) =>
				uniqueArrayByParam(
					[...prevProfile, ...AllOtherForums?.data?.results],
					"id"
				)
			)
		}
	}, [AllOtherForums?.data?.results])

	// get profile data
	useEffect(() => {
		if (getForumData?.data?.id) {
			triggerGetForumComments({
				idBlog: getForumData?.data?.id,
			})
		}
	}, [getForumData?.data?.id, triggerGetForumComments])

	const getAvatarBlogger = () => {
		if (getForumData?.data?.current_profile_id) {
			getProfileAvatars({
				profileIds: [getForumData?.data?.current_profile_id],
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
						setCommentProfilesInfo((prevProfile) => [
							...prevProfile,
							r,
						])
					})
					.catch((e) => {
						console.log(e)
					})
			})
		}
	}

	useEffect(() => {
		getProfilesComments()
	}, [AllComments.data?.results])

	const getPublicAvatarBlogger = () => {
		if (getForumData?.data?.current_profile_id) {
			getPublicAvatars({
				profileIds: [getForumData?.data?.current_profile_id],
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
		if (getForumData?.data?.current_profile_id) {
			getInfoByUuid({
				profileId: getForumData?.data?.current_profile_id,
			})
				.unwrap()
				.then((r) => {
					setProfilesInfo(r)
				})
				.catch((e) => {
					console.log(e)
				})
		}
	}

	useEffect(() => {
		getProfileInfoBlogger()
	}, [getForumData?.data?.current_profile_id])

	useEffect(() => {
		if (isNull(auth)) return
		if (auth) {
			getAvatarBlogger()
		} else {
			getPublicAvatarBlogger()
		}
	}, [getForumData?.data?.current_profile_id])

	const commentValue = watch("comment")

	const addBlogComment = () => {
		addComment({
			idBlog: getForumData?.data?.id,
			content: commentValue,
		})
			.unwrap()
			.then((r) => {
				setValue("comment", "")
				triggerGetForumComments({
					idBlog: getForumData?.data?.id,
				})
				triggerForum({
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
		router.push("/forum").then()
	}

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

	const count = AllOtherForums?.data?.count || 0
	const maxPage = count <= 3 ? 1 : Math.round(count / 3)

	const goToProfile = () => {
		if (!profilesInfo?.id || !auth) return
		router.push(`/profiles/${profilesInfo.id}`).then()
	}

	return (
		<>
			<NextSeo
				title={props?.forum?.data?.title}
				description={
					props?.forum?.data?.text &&
					props?.forum?.data?.text?.length > 150
						? `${props?.forum?.data?.text?.slice(0, 150)}...`
						: props?.forum?.data?.text
				}
				openGraph={{
					type: "article",
					url: `${baseUrl}/forum/${props?.forum?.slug}`,
					title: props?.forum?.data?.title,
					description:
						props.forum?.data?.text &&
						props.forum?.data?.text?.length > 150
							? `${props?.forum?.data?.text?.slice(0, 150)}...`
							: props?.forum?.data?.text,
					images: props?.forum?.avatar?.avatar
						? [
								{
									url: props?.forum?.avatar?.avatar,
									width: 800,
									height: 600,
									alt: "Forum",
								},
						  ]
						: [],
				}}
			/>
			<Head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(props?.forum?.seo),
					}}
				/>
			</Head>
			{id && (
				<>
					<AppDefaultLayout useHeader={false} useTabBar={false}>
						<div className="ForumPage">
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
									{getForumData?.data?.title}
								</div>
								<div className="InfoBlog">
									{getForumData?.data?.created && (
										<div className="Date">
											<p>
												{t("site.Posted in")} -{" "}
												{format(
													new Date(
														getForumData?.data?.created
													),
													"dd/MM/yyyy"
												)}{" "}
												{t("site.At")}{" "}
												{format(
													new Date(
														getForumData?.data?.created
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
													getForumData?.data
														?.number_of_comments
												}
											</span>
										</div>
										<div className="Viewed">
											<CommentBlogIcon />
											<span>
												{
													getForumData?.data
														?.number_of_views
												}
											</span>
										</div>
									</div>
								</div>
							</div>
							<Divider />
							<div className="DescriptionContainer">
								<div className="Description">
									{getForumData &&
										getForumData.data &&
										getForumData.data.text &&
										stripTags(getForumData.data.text)}
									{/*{getForumData?.data?.text}*/}
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
										const profileInfo: any =
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
							{otherForums && count > 1 && (
								<Section
									title={t("site.Blog content")}
									padding={"small"}
									boldTitle
								>
									<Divider />
									<div className="OtherBlogs">
										{otherForums
											.filter(
												(item: any) =>
													item.slug !==
													getForumData?.data?.slug
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
														<ForumAd
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
		const forumSlug = encodeURIComponent(context.params.slug) || "0"
		console.log("context.params.slug", context.params.slug)
		console.log("forumSlug", forumSlug)

		const lang: any = await serverSideTranslations(locale, ["site"])
		const baseUrl = publicRuntimeConfig?.baseUrl || ""

		const ssrT = (landCode: string, phraseCode: string) => {
			return lang._nextI18Next.initialI18nStore[landCode].site.site[
				phraseCode
			]
		}

		const forumData = await store.dispatch(
			getForum.initiate({
				slug: forumSlug,
			})
		)
		console.log("FORUM DATA", forumData)
		const profileData: any = forumData?.data?.current_profile_id
			? await store.dispatch(
					getInfoByUuid.initiate({
						profiles_ids: [forumData?.data?.current_profile_id],
					})
			  )
			: null

		const avatarData: any = forumData?.data?.current_profile_id
			? await store.dispatch(
					getPublicProfileAvatars.initiate({
						profileIds: [forumData?.data?.current_profile_id],
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

		const nickname =
			profileData && profileData?.data?.results
				? await getNickName(profileData?.data?.results[0])
				: ""

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
					name: ssrT(locale, "The SWINGERS forum"),
					item: `${baseUrl}/${ssrT(locale, "en")}/forum/`,
				},
				{
					"@type": "ListItem",
					position: 3,
					name: forumData?.data?.title,
					item: `${baseUrl}/${ssrT(
						locale,
						"en"
					)}/forum/${encodeURIComponent(forumData?.data?.slug)}`,
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
					"@id": `${baseUrl}/${ssrT(locale, "en")}/forum/#webpage`,
					isPartOf: {
						"@id": `${baseUrl}/#website`,
					},
					url: `${baseUrl}/${ssrT(
						locale,
						"en"
					)}/forum/${encodeURIComponent(forumData?.data?.slug)}`,
					name: forumData?.data?.title,
					description:
						forumData?.data?.text &&
						forumData?.data?.text?.length > 50
							? `${forumData?.data?.text?.slice(0, 50)}...`
							: forumData?.data?.text,
				},
				{
					"@type": "BlogPosting",
					"@id": `${baseUrl}/${ssrT(
						locale,
						"en"
					)}/forum/#blogposting`,
					mainEntityOfPage: {
						"@type": "WebPage",
						"@id": `${baseUrl}/${ssrT(
							locale,
							"en"
						)}/forum/#webpage`,
					},
					headline: forumData?.data?.title,
					image: avatar && {
						"@type": "ImageObject",
						url: avatar,
						height: "100",
						width: "90",
					},
					datePublished: forumData?.data?.created,
					dateModified: forumData?.data?.updated,
					author: {
						"@type": "Person",
						name: nickname,
					},
					description:
						forumData?.data?.text &&
						forumData?.data?.text?.length > 50
							? `${forumData?.data?.text?.slice(0, 50)}...`
							: forumData?.data?.text,
					articleBody: forumData?.data?.text,
				},
			],
		}

		return {
			props: {
				locale: locale,
				forum: {
					slug: forumSlug,
					data:
						forumData.status === "fulfilled"
							? forumData.data
							: null,
					profile:
						profileData && nickname
							? {nickname: nickname}
							: {nickname: null},
					avatar: avatarData ? {avatar: avatar} : {avatar: null},
					seo: schemaDataWebPage,
				},
				...(await serverSideTranslations(locale, ["site"])),
			},
		}
	}
})

// export default ForumPage
const mapStateToProps = (state: any) => ({
	editProfileState: state.EditProfileSlice,
})

const mapDispatchToProps = {
	toggleEditMode: toggleEditMode,
	toggleChatMode: toggleChatMode,
}

export default connect(mapStateToProps, mapDispatchToProps)(ForumPage)
