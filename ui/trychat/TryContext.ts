// import io, {Socket} from "socket.io-client"
import React from "react"
import {getCookie} from "cookies-next"
import {TryClient} from "@/TryChat/Client/TryClient"
import getConfig from "next/config"

const {publicRuntimeConfig} = getConfig()
const chatApiUrl = publicRuntimeConfig?.chatApiUrl || ""
const accessToken = getCookie("accessToken")
const refreshToken = getCookie("refreshToken")

// const trySocket = io("https://api.dev.swingers.co.il/", {
// 	path: "/api/chat",
// 	transports: ["polling"],
// 	upgrade: false,
// 	autoConnect: false,
// 	transportOptions: {
// 		websocket: {
// 			extraHeaders: {
// 				Authorization: accessToken ? accessToken : "",
// 			},
// 		},
// 		polling: {
// 			extraHeaders: {
// 				Authorization: accessToken ? accessToken : "",
// 			},
// 		},
// 	},
// })

const tryClient: TryClient = new TryClient({
	url: chatApiUrl,
	path: "/api/chat-ws/",
	transports: ["polling", "websocket"],
	upgrade: true,
	autoConnect: false,
	accessToken: accessToken ? accessToken.toString() : "",
	refreshToken: refreshToken ? refreshToken.toString() : "",
})

const TryContext = React.createContext<TryClient | undefined>(undefined)

export {tryClient, TryContext}
