import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../../../GreenScreen"
import InputRadioWithPrice from "@/components/ui/Forms/Inputs/Radio/InputRadioWithPrice"

export default {
	title: "Components/Forms/Inputs/RadioWithPrice",
	component: InputRadioWithPrice,
	// argTypes: {
	// 	color: {
	// 		options: ["white"],
	// 		control: {type: "check"},
	// 	},
	// },
} as ComponentMeta<typeof InputRadioWithPrice>

export const Default: ComponentStory<typeof InputRadioWithPrice> = (args) => (
	<GreenScreen>
		<div style={{minWidth: "300px"}}>
			<InputRadioWithPrice field={{value: undefined}} {...args} />
			<InputRadioWithPrice field={{value: undefined}} {...args} />
		</div>
		<p>This demo doesn`t work properly</p>
	</GreenScreen>
)
