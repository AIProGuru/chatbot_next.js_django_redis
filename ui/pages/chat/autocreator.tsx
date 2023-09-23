import {useLazyGetUsersProfilesMainInfoQuery} from "@/services/users.service"
// import {Controller, useForm, useWatch} from "react-hook-form"
import {useContext, useEffect, useState} from "react"
import {TryClient} from "@/TryChat/Client/TryClient"
import {TryContext} from "@/TryChat/TryContext"
// import Link from "next/link"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"
import {
	CreateConversationResponse,
	Message,
	MessageType,
	RoomType,
} from "@/TryChat/@types/Conversations/Conversation"

// type FormData = {
// 	nickname: string
// }

function TryChatAutoCreator() {
	// const
	const tryClient: TryClient | undefined = useContext(TryContext)
	const userProfilesData = useGetUserProfilesInfo()

	// state
	const [clientReady, setClientReady] = useState<boolean>(false)
	const [profiles, setProfiles] = useState<any[]>([])
	const [page, setPage] = useState(0)

	// rtk
	const [triggerGetProfile, getProfileResponse] =
		useLazyGetUsersProfilesMainInfoQuery()

	// functions
	const searchProfile = () => {
		triggerGetProfile({
			page: page,
			pageSize: 10,
		})
			.unwrap()
			.then((r: any) => {
				console.log("page", r)
				setProfiles((prevState) => [...prevState, ...r.results])
				setPage((prevState) => prevState + 1)
			})
			.catch((e) => {
				console.log(e)
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
					console.log("socket create_conversation page", event)

					tryClient.emitNewMessage(
						"Conversation created",
						MessageType.text,
						event.room.id
					)
				}
			)

			tryClient.subscribe("new_message", (event: Message) => {
				console.log("socket new_message", event)
			})
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clientReady])

	useEffect(() => {
		setPage(1)
	}, [])

	useEffect(() => {
		console.log("page", page)
		if (page > 0 && page < 50) {
			searchProfile()
			// setPage((prevState) => prevState + 1)
		}
	}, [page])

	useEffect(() => {
		console.log("page ready", page, page == 50, page === 50)
		if (page == 50 && profiles && profiles.length > 0) {
			console.log("page ready here")
			profiles.forEach((profile, index) => {
				setTimeout(function timer() {
					console.log(profile.id)
					emitCreateConversation(profile.id)
				}, index * 250)
			})
		}
	}, [page, profiles])

	// useEffect(() => {
	// 	if (
	// 		getProfileResponse &&
	// 		getProfileResponse.isSuccess &&
	// 		getProfileResponse.data.results &&
	// 		Array.isArray(getProfileResponse.data.results)
	// 	) {
	// 		setProfiles((prevState) => [
	// 			...prevState,
	// 			...getProfileResponse.data.results,
	// 		])
	// 	}
	// }, [getProfileResponse])

	return (
		<>
			{(!tryClient || !clientReady) && <p>Connecting...</p>}

			{tryClient && clientReady && (
				<>
					<p>client ready</p>
					<ul>
						{profiles &&
							profiles.map((profile, index) => {
								return (
									<li key={profile.id}>
										{index}. {profile.user_username}
									</li>
								)
							})}
					</ul>
				</>
			)}
		</>
	)
}

export default TryChatAutoCreator
