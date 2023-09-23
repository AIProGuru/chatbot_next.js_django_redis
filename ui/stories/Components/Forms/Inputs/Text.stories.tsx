import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../../../GreenScreen"
import InputText from "@/components/ui/Forms/Inputs/Text/InputText"

export default {
	title: "Components/Forms/Inputs/Text",
	component: InputText,
	// argTypes: {
	// 	color: {
	// 		options: ["white"],
	// 		control: {type: "check"},
	// 	},
	// },
} as ComponentMeta<typeof InputText>

export const Default: ComponentStory<typeof InputText> = (args) => (
	<GreenScreen>
		<div style={{minWidth: "300px"}}>
			<InputText {...args} />
		</div>
	</GreenScreen>
)
