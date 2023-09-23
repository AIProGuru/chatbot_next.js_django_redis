import {NextSeo} from "next-seo"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import {Controller, useForm} from "react-hook-form"
import InputText from "@/components/ui/Forms/Inputs/Text/InputText"
import Divider from "@/components/ui/Divider/Divider"
import InputRadioUser from "@/components/ui/Forms/Inputs/RadioUser/InputRadioUser"
import Button from "@/components/ui/Button/Button/Button"
import React, {useEffect, useState} from "react"
import {useTranslation} from "next-i18next"
import {useRouter} from "next/router"
import {
	FavoriteResultItem,
	GetFavoriteProfilesResponse,
	useLazyGetFavoriteProfilesQuery,
} from "@/services/users.service"
import InfiniteScroll from "react-infinite-scroll-component"
import {getSelectedStringIds} from "@/components/ui/Functions/GetSelectedIDs"
import {yupResolver} from "@hookform/resolvers/yup"
import {TryChatCreateGroupSchema} from "@/app/validation/TryChat/CreateGroup.schema"
// import TryChatLayer from "@/components/TryChat/Layers/TryChatLayer"
// import CreateGroupHeader from "@/components/TryChat/Components/Header/CreateGroupHeader/CreateGroupHeader"
// import CreateGroupList from "@/components/TryChat/Components/Conversations/List/CreateGroupList/CreateGroupList"
// import CreateGroupActionBar from "@/components/TryChat/Components/CreateGroupActionBar/CreateGroupActionBar"
import {useLazyGetProfileAvatarsOptimisedQuery} from "@/services/images.service"

interface ChatCreateGroupPageProps {
	emitCreateConversation: (title: string, profileIds: string[]) => void
	setCreateGroupModal?: Function
	isLoading: boolean
	setIsLoading: Function
}

type FormData = {
	group_name: string
	group: {
		[x: string]: boolean
	}
}

function ChatCreateGroupPage(props: ChatCreateGroupPageProps) {
	const {
		emitCreateConversation,
		setCreateGroupModal,
		isLoading,
		setIsLoading,
	} = props
	const {t} = useTranslation("site")
	const router = useRouter()
	const {
		handleSubmit,
		control,
		formState: {errors},
	} = useForm<FormData>({
		resolver: yupResolver(TryChatCreateGroupSchema),
	})

	// state
	const [page, setPage] = useState<number>(1)
	const [pageSize, setPageSize] = useState<number>(10)
	const [pages, setPages] = useState<number>(0)
	const [favoriteProfiles, setFavoriteProfiles] = useState<
		FavoriteResultItem[]
	>([])
	const [profilesAvatar, setProfilesAvatar] = useState<object[]>([])

	// rtk
	const [triggerGetFavoriteProfiles] = useLazyGetFavoriteProfilesQuery()
	const [getProfilesAvatar] = useLazyGetProfileAvatarsOptimisedQuery()

	// functions
	function uniqueArray(array: FavoriteResultItem[]) {
		const a = array.concat()
		for (let i = 0; i < a.length; ++i) {
			for (let j = i + 1; j < a.length; ++j) {
				if (a[i].profile.id === a[j].profile.id) a.splice(j--, 1)
			}
		}

		return a
	}

	const getFavoriteProfiles = () => {
		triggerGetFavoriteProfiles({
			page: page,
			pageSize: pageSize,
		})
			.unwrap()
			.then((r: GetFavoriteProfilesResponse) => {
				console.log(r)
				setPages(r.count / pageSize)

				if (r.results) {
					setFavoriteProfiles((prevState) =>
						uniqueArray([...prevState, ...r.results])
					)

					r.results.forEach((favItem) => {
						getProfilesAvatar({
							profileId: favItem.profile.id,
						})
							.unwrap()
							.then((r) => {
								setProfilesAvatar((prevProfile) => [
									...prevProfile,
									r,
								])
							})
							.catch((e) => {
								console.log(e)
							})
					})

					if (page < pages) {
						setPage((prevState) => prevState + 1)
					}
				}
			})
			.catch((e) => {
				console.log(e)
			})
	}

	const loadFunc = () => {
		getFavoriteProfiles()
	}

	function onFormSubmit(data: FormData) {
		setIsLoading(true)
		const group = getSelectedStringIds(data.group)
		emitCreateConversation(data.group_name.trim(), group)
	}

	// effects
	useEffect(() => {
		console.log("get fav profiles page")
		getFavoriteProfiles()
	}, [page])

	return (
		<>
			<NextSeo title={t("site.Create a chat group")} />

			{/*<TryChatLayer>*/}
			{/*	<CreateGroupHeader setCreateGroupModal={setCreateGroupModal} />*/}
			{/*	<CreateGroupList />*/}
			{/*	<CreateGroupActionBar />*/}
			{/*</TryChatLayer>*/}

			<div className={"PartyScreen"}>
				<header className={"HeaderCreateGroup"}>
					<div
						onClick={() => router.back()}
						className={"CloseContainer"}
					>
						<CloseIcon style={"light"} />
					</div>
					<p>{t("site.Invitation to group chat")}</p>
				</header>
				<div className={"CreateGroup"}>
					<form onSubmit={handleSubmit(onFormSubmit)}>
						<div className={"SearchContainer"}>
							<Controller
								render={({field, fieldState}) => (
									<InputText
										field={field}
										placeholder={t(
											"site.Give the group a name"
										)}
										// maxLength={25}
										maxLength={140}
										required={true}
										autoComplete={"off"}
										spellCheck={false}
										showOKIcon={true}
										id={"input_group_name"}
										error={
											fieldState.error?.message &&
											t(
												`site.${fieldState.error.message}`
											)
										}
									/>
								)}
								name={"group_name"}
								control={control}
								defaultValue={""}
							/>
						</div>
						<p>
							{" "}
							{t(
								"site.Who do you want to invite? You can add a profile from your favorites"
							)}
						</p>

						{/*{errors && errors.group && errors.group.message && (*/}
						{/*	<p style={{color: "gold"}}>*/}
						{/*		{errors.group.message}*/}
						{/*	</p>*/}
						{/*)}*/}

						{errors && errors.group && errors.group.message && (
							<p style={{color: "gold"}}>
								<p style={{color: "gold"}}>
									{t(`site.${errors.group.message}`)}
								</p>
							</p>
						)}

						<Divider />
						{/*<button*/}
						{/*	onClick={() => {*/}
						{/*		setShowSplash(true)*/}
						{/*	}}*/}
						{/*	type={"button"}*/}
						{/*>*/}
						{/*	setShowSplash*/}
						{/*</button>*/}
						{/*<button*/}
						{/*	onClick={() => {*/}
						{/*		setIsLoading(true)*/}
						{/*	}}*/}
						{/*	type={"button"}*/}
						{/*>*/}
						{/*	setLoading*/}
						{/*</button>*/}
						<div className={"UsersContainer"} id="scrollableDiv">
							<InfiniteScroll
								dataLength={favoriteProfiles.length}
								next={loadFunc}
								style={{
									display: "flex",
									flexDirection: "column", //-reverse",
								}} //To put endMessage and loader to the top.
								inverse={false} //
								hasMore={page < pages}
								loader={<></>}
								scrollableTarget="scrollableDiv2"
							>
								{favoriteProfiles.map((profile) => (
									<Controller
										key={profile.id}
										render={({field}) => {
											return (
												<InputRadioUser
													field={field}
													value={`group_${profile.profile.id}`}
													id={`input_checkbox_group_${profile.profile.id}`}
													users={profile.profile}
													images={profilesAvatar}
												/>
											)
										}}
										name={`group._${profile.profile.id}`}
										control={control}
										defaultValue={false}
									/>
								))}
							</InfiniteScroll>
						</div>
						<div className={"ButtonContainer"}>
							<div className={"Actions"}>
								<Button
									type={"button"}
									fullWidth={true}
									mode={"submit"}
									id={"button.submit"}
									prevent={false}
									isLoading={isLoading}
									disabled={isLoading}

									// onClick={handleSubmit((e) => {
									// 	console.log(e)
									// 	// if (selectedUsers.length > 2) {
									// 	// 	console.log("Create group")
									// 	// }
									// })}
								>
									<p className={"SubmitButtonText"}>
										{t("site.Send an invitation")}
									</p>
								</Button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	)
}

export default ChatCreateGroupPage
