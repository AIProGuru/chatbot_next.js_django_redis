import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import ProfileAd from "@/components/ui/Profiles/ProfileAd/ProfileAd"

export default {
	title: "Components/ProfileAd",
	component: ProfileAd,
	// argTypes: {
	// 	color: {
	// 		options: ["white"],
	// 		control: {type: "check"},
	// 	},
	// },
} as ComponentMeta<typeof ProfileAd>

export const Default: ComponentStory<typeof ProfileAd> = (args) => (
	<GreenScreen>
		<div style={{minWidth: "375px"}}>
			<ProfileAd />
		</div>
	</GreenScreen>
)
