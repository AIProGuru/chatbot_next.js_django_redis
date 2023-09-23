import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import StyledIconRabbits from "@/components/ui/Icons/StyledIconRabbits"

export default {
	title: "Icons/Styled Rabbits",
	component: StyledIconRabbits,
} as ComponentMeta<typeof StyledIconRabbits>

export const Default: ComponentStory<typeof StyledIconRabbits> = () => (
	<GreenScreen>
		<StyledIconRabbits />
	</GreenScreen>
)
