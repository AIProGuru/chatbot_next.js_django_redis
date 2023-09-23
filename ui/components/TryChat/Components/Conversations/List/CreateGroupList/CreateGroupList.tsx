import styles from "./CreateGroupList.module.scss"
import React, {useEffect, useState} from "react"
import {Controller, useForm} from "react-hook-form"
import InputText from "@/components/ui/Forms/Inputs/Text/InputText"
import Divider from "@/components/ui/Divider/Divider"
import InfiniteScroll from "react-infinite-scroll-component"
import InputRadioUser from "@/components/ui/Forms/Inputs/RadioUser/InputRadioUser"
import Button from "@/components/ui/Button/Button/Button"
import {yupResolver} from "@hookform/resolvers/yup"
import {TryChatCreateGroupSchema} from "@/app/validation/TryChat/CreateGroup.schema"
import {
	FavoriteResultItem,
	GetFavoriteProfilesResponse,
	useLazyGetFavoriteProfilesQuery,
} from "@/services/users.service"
import {getSelectedStringIds} from "@/components/ui/Functions/GetSelectedIDs"
import {useTranslation} from "next-i18next"

interface CreateGroupListProps {
	emitCreateConversation: Function
}

type FormData = {
	group_name: string
	group: {
		[x: string]: boolean
	}
}

function CreateGroupList(props: CreateGroupListProps) {
	const {emitCreateConversation} = props
	const {t} = useTranslation("site")
	const {
		handleSubmit,
		control,
		formState: {errors},
	} = useForm<FormData>({
		resolver: yupResolver(TryChatCreateGroupSchema),
	})

	const [page, setPage] = useState<number>(1)
	const [pageSize, setPageSize] = useState<number>(10)
	const [pages, setPages] = useState<number>(0)
	const [favoriteProfiles, setFavoriteProfiles] = useState<
		FavoriteResultItem[]
	>([])

	// rtk
	const [triggerGetFavoriteProfiles] = useLazyGetFavoriteProfilesQuery()

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
				setPages(r.count / pageSize)
				setFavoriteProfiles((prevState) =>
					uniqueArray([...prevState, ...r.results])
				)
				if (page < pages) {
					setPage((prevState) => prevState + 1)
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
		const group = getSelectedStringIds(data.group)
		emitCreateConversation(data.group_name, group)
	}

	// effects
	useEffect(() => {
		getFavoriteProfiles()
	}, [page])

	return (
		<div className={styles.CreateGroupList}>
			<div className={styles.Container}>
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
									required={true}
									autoComplete={"off"}
									spellCheck={false}
									showOKIcon={true}
									id={"input_group_name"}
									error={
										fieldState.error?.message &&
										fieldState.error.message
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
					{errors && errors.group && errors.group.message && (
						<p style={{color: "gold"}}>{errors.group.message}</p>
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

					<div className={styles.UsersContainer} id="scrollableDiv">
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
	)
}

export default CreateGroupList
