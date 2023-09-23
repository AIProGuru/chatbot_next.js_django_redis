import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import InputCheckBox from "@/components/ui/Forms/Inputs/Checkbox/InputCheckBox"
import GreenScreen from "../../../GreenScreen"

export default {
	title: "Components/Forms/Inputs/Checkbox",
	component: InputCheckBox,
	// argTypes: {
	// 	color: {
	// 		options: ["white"],
	// 		control: {type: "check"},
	// 	},
	// },
} as ComponentMeta<typeof InputCheckBox>

export const Default: ComponentStory<typeof InputCheckBox> = (args) => (
	<GreenScreen>
		<InputCheckBox {...args} />
	</GreenScreen>
)
