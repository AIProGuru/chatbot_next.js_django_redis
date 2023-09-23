import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import AppTabBar from "@/components/ui_app/AppTabBar/AppTabBar"

export default {
	title: "Components/AppTabBar",
	component: AppTabBar,
	// argTypes: {
	// 	color: {
	// 		options: ["white"],
	// 		control: {type: "check"},
	// 	},
	// },
} as ComponentMeta<typeof AppTabBar>

export const Default: ComponentStory<typeof AppTabBar> = (args) => (
	<GreenScreen>
		<AppTabBar openMenu={false} setOpenMenu={() => {}} />

		<p>
			Tab bar is at the bottom of the preview window, because of absolute
			position
		</p>
	</GreenScreen>
)
