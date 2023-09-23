import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../../../GreenScreen"
import InputRadioVertical from "@/components/ui/Forms/Inputs/RadioVertical/InputRadioVertical"
import StyledIconRabbits from "@/components/ui/Icons/StyledIconRabbits"

export default {
	title: "Components/Forms/Inputs/RadioVertical",
	component: InputRadioVertical,
	// argTypes: {
	// 	color: {
	// 		options: ["white"],
	// 		control: {type: "check"},
	// 	},
	// },
} as ComponentMeta<typeof InputRadioVertical>

export const Default: ComponentStory<typeof InputRadioVertical> = (args) => (
	<GreenScreen>
		<div style={{minWidth: "300px"}}>
			<InputRadioVertical
				field={{value: undefined}}
				// @ts-ignore
				icon={<StyledIconRabbits />}
				{...args}
			/>
		</div>
		<p>This demo doesn`t work properly</p>
	</GreenScreen>
)
