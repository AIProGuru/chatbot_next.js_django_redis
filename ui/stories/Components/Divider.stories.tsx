import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import Divider from "@/components/ui/Divider/Divider"

export default {
	title: "Components/Divider",
	component: Divider,
	argTypes: {
		color: {
			options: ["white"],
			control: {type: "check"},
		},
	},
} as ComponentMeta<typeof Divider>

export const Default: ComponentStory<typeof Divider> = (args) => (
	<GreenScreen>
		<div style={{width: "350px"}}>
			<Divider {...args} />
		</div>
	</GreenScreen>
)
