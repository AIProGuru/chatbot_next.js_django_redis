import io, {Socket} from "socket.io-client"
import { parse } from "cookie";
import {TryClientConfig} from "@/TryChat/@types/TryClientConfig"
import {getCookie} from "cookies-next"
import {
	MessageType,
	RoomType,
} from "@/TryChat/@types/Conversations/Conversation"
import {authInstance} from "@/app/axiosInstance"

class TryClient extends EventTarget {
	private _config: TryClientConfig
	public _client: Socket | undefined
	// public timestamp: number = 0
	// public updateTokenEvent: CustomEvent | undefined
	private _tokenRefreshEvent: Event = new Event("tokenRefreshEvent")

	constructor(config: TryClientConfig) {
		super()
		this._config = config
		this.configureClient().then(() => {
			this.startup()
		})
	}

	// private set accessToken222(newToken: string) {
	// 	console.log("accessToken222", newToken)
	// 	this._config.accessToken = newToken
	// 	this.timestamp = new Date().getTime()
	// }

	private configureClient() {
		return new Promise((resolve, reject) => {
			if (!this._config) {
				reject(new Error("socket empty config"))
				return
			}

			const socket = io(this._config.url, {
				path: this._config.path,
				transports: this._config.transports,
				upgrade: this._config.upgrade,
				autoConnect: this._config.autoConnect,
				withCredentials: true,
				// transportOptions: {
				// 	websocket: {
				// 		extraHeaders: {
				// 			Authorization: this._config.accessToken,
				// 		},
				// 	},
				// 	polling: {
				// 		extraHeaders: {
				// 			Authorization: this._config.accessToken,
				// 			// "Access-Control-Allow-Origin": "*",
				// 			// Host: "chat.dev.swingers.co.il",
				// 		},
				// 	},
				// },
				// extraHeaders: {
				// 	Authorization: this._config.accessToken,
				// },
				auth: {
					authorization: this._config.accessToken,
				},
				// withCredentials: true,
			})
			// const COOKIE_NAME = "AWSALBCORS";
			//
			// socket.io.on("open", () => {
			//   socket.io.engine.transport.on("pollComplete", () => {
			// 	const request = socket.io.engine.transport.pollXhr.xhr;
			// 	const cookieHeader = request.getResponseHeader("set-cookie");
			// 	console.log('cookieHeader', cookieHeader)
			// 	if (!cookieHeader) {
			// 	  return;
			// 	}
			// 	cookieHeader.forEach((cookieString: any) => {
			// 	  if (cookieString.includes(`${COOKIE_NAME}=`)) {
			// 		const cookie = parse(cookieString);
			// 		socket.io.opts.extraHeaders = {
			// 		  cookie: `${COOKIE_NAME}=${cookie[COOKIE_NAME]}`
			// 		}
			// 	  }
			// 	});
			//   });
			// });

			this._client = socket

			// this.updateTokenEvent = new CustomEvent("updateTokenEvent")

			resolve(true)
		})
	}

	private startup() {
		if (!this._client) return

		this.subscribe("connect_error", (event: any) => {
			// todo: refresh token
			// todo: apply token in client

			this.disconnect()
			setTimeout(() => {
				this.updateToken()
			}, 1000)
		})

		this.subscribe("disconnect", (event: any) => {

			if (event === "transport error") {
				this.disconnect()
				setTimeout(() => {
					this.updateToken()
				}, 1000)
			}
		})
	}

	private updateToken() {
		if (!this._config) return

		// const accessToken = getCookie("accessToken")
		//
		// console.log(accessToken)
		//
		// this._config.accessToken = accessToken ? accessToken.toString() : ""
		//
		// console.log("TryChat: update token", this._config)
		//
		// this.configureClient().then(() => {
		// 	this.connect()
		// })

		const currentRefreshToken = getCookie("refreshToken")

		authInstance
			.post("/auth/refresh/", {refresh_token: currentRefreshToken})
			.then(({data}) => {
				// @ts-ignore
				const {access_token: accessToken, refresh_token: refreshToken} =
					data

				this._config.accessToken = accessToken
				this._config.refreshToken = refreshToken

				setTimeout(() => {
					this.dispatchEvent(this._tokenRefreshEvent)
				}, 1000)
			})
			.catch((error) => {
				console.log("socket update token error", error)
			})
			.finally(() => {
				this.configureClient().then(() => {
					this.connect()
				})

				// this.updateTokenEvent &&
				// 	document &&
				// 	document.dispatchEvent(this.updateTokenEvent)
			})
	}

	public connect() {
		if (!this._client) return
		this._client.connect()

		const engine = this._client.io.engine

		// this.updateTokenEvent &&
		// 	document &&
		// 	document.dispatchEvent(this.updateTokenEvent)
	}

	public disconnect() {
		if (!this._client) return
		this._client.disconnect()
		this._client.close()
	}

	public subscribe(
		eventName: string,
		eventHandler: (...args: any[]) => void
	) {
		if (!this._client) return
		this._client.on(eventName, eventHandler)
	}

	public unsubscribe(
		eventName: string,
		eventHandler: (...args: any[]) => void
	) {
		if (!this._client) return
		this._client.off(eventName, eventHandler)
		this._client.removeListener(eventName, eventHandler)
	}

	public try(eventName: string, args: any) {
		if (!this._client) return
		this._client.emit(eventName, args)
	}

	public emitGetConversations(
		profileTypes: string[],
		skip?: number,
		take?: number,
		isFiltered?: boolean
	) {
		if (!this._client) return
		this.try("get_conversations", {
			limit: take ? take : 10,
			offset: skip ? skip : 0,
			profile_types: profileTypes,
			is_filtered: isFiltered,
		})
	}

	/**
	 * Create Conversation
	 * @param roomType {RoomType} - type of room
	 * @param profiles {string[]} - array of profiles ID
	 * @param title {string} - title of the conversation, but only for non-Personal conversations
	 */
	public emitCreateConversation(
		roomType: RoomType,
		profiles: string[],
		title?: string
	) {
		if (!this._client) return

		const newConversationData = {
			room_type: roomType,
			profiles_id: profiles,
		}

		if (roomType === RoomType.group) {
			if (!title)
				throw new Error(
					"TryChat_create_conversation_group_title_required"
				)

			const t = title.trim()

			if (t.length < 1 || t.length > 140)
				throw new Error(
					"TryChat_create_conversation_group_title_char_limit"
				)

			Object.assign(newConversationData, {name: title})
		}

		this.try("create_conversation", newConversationData)
	}

	public emitGetConversation(conversationID: string) {
		if (!this._client) return

		this.try("get_conversation", {
			room_id: conversationID,
			limit: 10,
			offset: 0,
		})
	}

	public emitLeaveConversation(
		conversationID: string,
		deleteConversation: boolean
	) {
		if (!this._client) return

		this.try("delete_conversation", {
			room_id: conversationID,
			delete_from_everyone: deleteConversation,
		})
	}

	public emitLeaveGroup(conversationID: string, isAdmin: boolean) {
		if (!this._client) return

		this.try("exit_group_room", {
			room_id: conversationID,
			is_admin: isAdmin,
		})
	}

	public emitDeleteMemberFromGroup(
		conversationID: string,
		profileID: string
	) {
		if (!this._client) return

		this.try("delete_member_from_group_room", {
			room_id: conversationID,
			delete_profile_id: profileID,
		})
	}

	public emitGetMessages(
		conversationID: string,
		skip?: number,
		take?: number
	) {
		if (!this._client) return

		this.try("get_messages", {
			room_id: conversationID,
			limit: take ? take : 10,
			offset: skip ? skip : 0,
		})
	}

	public emitNewMessage(
		content: string,
		type: MessageType,
		conversationID: string
	) {
		// todo: validation using Joi or Yup
		if (!content || content.length < 1 || content.trim().length < 1)
			throw new Error("TryChat_new_message_content_required")
		if (content.length > 4096)
			throw new Error("TryChat_new_message_content_limit_4096")

		this.try("new_message", {
			message: content,
			room_id: conversationID,
			message_type: type,
		})
	}

	public emitEditMessage(
		conversationID: string,
		timestamp: number,
		content: string
	) {
		this.try("update_message", {
			room_id: conversationID,
			timestamp: timestamp,
			new_message: content,
		})
	}

	public emitTyping(conversationID: string) {
		this.try("typing", {
			room_id: conversationID,
		})
	}

	public emitDeleteMessage(conversationID: string, timestamp: number) {
		this.try("delete_message", {
			timestamp: timestamp,
			room_id: conversationID,
		})
	}

	public emitReadMessages(conversationID: string) {
		this.try("read_messages", {
			room_id: conversationID,
		})
	}

	public emitSearchConversation(profileID: string) {
		this.try("conversation_by_profile_id", {
			profile_id: profileID,
		})
	}

	public emitGetProfileLimits() {
		this.try("get_profile_limit", {})
	}
	public emitUseCredits(conversationID: string) {
		this.try("reduce_credit", {
			room_id: conversationID,
		})
	}
}

export {TryClient}
