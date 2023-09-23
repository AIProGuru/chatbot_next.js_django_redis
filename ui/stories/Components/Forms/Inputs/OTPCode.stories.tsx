import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../../../GreenScreen"
import InputCode from "@/components/ui/Forms/Inputs/Code/InputCode"

export default {
	title: "Components/Forms/Inputs/OtpCode",
	component: InputCode,
	// argTypes: {
	// 	color: {
	// 		options: ["white"],
	// 		control: {type: "check"},
	// 	},
	// },
} as ComponentMeta<typeof InputCode>

export const Default: ComponentStory<typeof InputCode> = (args) => (
	<GreenScreen>
		<InputCode {...args} />
	</GreenScreen>
)
