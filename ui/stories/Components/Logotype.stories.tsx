import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import Logotype from "@/components/ui/Header/Logotype"

export default {
	title: "Components/Logotype",
	component: Logotype,
	// argTypes: {
	// 	color: {
	// 		options: ["white"],
	// 		control: {type: "check"},
	// 	},
	// },
} as ComponentMeta<typeof Logotype>

export const Default: ComponentStory<typeof Logotype> = (args) => (
	<GreenScreen>
		<Logotype />
	</GreenScreen>
)
