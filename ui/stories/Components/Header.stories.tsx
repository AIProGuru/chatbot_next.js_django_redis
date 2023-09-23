import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import AppHeader from "@/components/ui_app/AppHeader/AppHeader"

export default {
	title: "Components/AppHeader",
	component: AppHeader,
	// argTypes: {
	// 	color: {
	// 		options: ["white"],
	// 		control: {type: "check"},
	// 	},
	// },
} as ComponentMeta<typeof AppHeader>

export const Default: ComponentStory<typeof AppHeader> = (args) => (
	<GreenScreen>
		<div style={{minWidth: "375px"}}>
			<AppHeader />
		</div>
	</GreenScreen>
)
