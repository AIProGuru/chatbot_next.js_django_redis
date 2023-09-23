import {useLazyGetUsersProfilesMainInfoQuery} from "@/services/users.service"
import {Controller, useForm, useWatch} from "react-hook-form"
import {useContext, useEffect, useState} from "react"
import {TryClient} from "@/TryChat/Client/TryClient"
import {TryContext} from "@/TryChat/TryContext"
import Link from "next/link"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"
import {
	CreateConversationResponse,
	Message,
	MessageType,
	RoomType,
} from "@/TryChat/@types/Conversations/Conversation"

type FormData = {
	nickname: string
}

function TryChatCreator() {
	// const
	const tryClient: TryClient | undefined = useContext(TryContext)
	const userProfilesData = useGetUserProfilesInfo()

	// state
	const [clientReady, setClientReady] = useState<boolean>(false)
	const [profiles, setProfiles] = useState<any[]>([])

	// react hook form
	const {control} = useForm<FormData>()
	const nicknameWatch = useWatch({
		control,
		name: "nickname",
	})

	// rtk
	const [triggerGetProfile, getProfileResponse] =
		useLazyGetUsersProfilesMainInfoQuery()

	// functions
	const searchProfile = (query: string) => {
		triggerGetProfile({
			page: 1,
			pageSize: 10,
			nickname: query,
		})
	}

	const emitCreateConversation = (participantID: string) => {
		if (
			!tryClient ||
			!userProfilesData ||
			!userProfilesData.current_profile_id
		)
			return

		const ids = [participantID, userProfilesData.current_profile_id]

		tryClient.emitCreateConversation(RoomType.personal, ids)
	}

	// effects
	useEffect(() => {
		if (tryClient) {
			tryClient.connect()
			setClientReady(true)
		}

		return () => {
			tryClient && tryClient.disconnect()
		}
	}, [tryClient])

	useEffect(() => {
		if (tryClient && clientReady) {
			tryClient.subscribe(
				"create_conversation",
				(event: CreateConversationResponse) => {
					console.log("socket create_conversation", event)

					tryClient.emitNewMessage(
						"Conversation created",
						MessageType.text,
						event.room.id
					)

					alert("Conversation created")
				}
			)

			tryClient.subscribe("new_message", (event: Message) => {
				console.log("socket new_message", event)
			})
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clientReady])

	useEffect(() => {
		const debounceSearch = setTimeout(() => {
			if (nicknameWatch && nicknameWatch.length < 1) return
			if (nicknameWatch && nicknameWatch === "") return

			searchProfile(nicknameWatch)
		}, 1000)

		return () => {
			clearTimeout(debounceSearch)
		}
	}, [nicknameWatch])

	useEffect(() => {
		if (getProfileResponse && getProfileResponse.isSuccess) {
			setProfiles(getProfileResponse.data.results)
		}
	}, [getProfileResponse])

	return (
		<>
			{(!tryClient || !clientReady) && <p>Connecting...</p>}

			{tryClient && clientReady && (
				<div>
					<div className="Header">
						<Link href={"/trychat"}>open chat list</Link>
					</div>
					<div className="Search">
						<label>Search by nickname:</label>
						<Controller
							render={({field}) => {
								return <input {...field} type="text" />
							}}
							name={"nickname"}
							defaultValue={""}
							control={control}
						/>
					</div>
					<div className="ProfileList">
						{profiles &&
							profiles.map((profile) => {
								return (
									<div key={profile.id}>
										{profile.user_username}
										<button
											onClick={() => {
												emitCreateConversation(
													profile.id
												)
											}}
											type={"button"}
										>
											new chat
										</button>
									</div>
								)
							})}
					</div>
				</div>
			)}
		</>
	)
}

export default TryChatCreator
