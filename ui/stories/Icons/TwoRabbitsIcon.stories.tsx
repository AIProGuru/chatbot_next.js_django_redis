import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import TwoRabbitsIcon from "@/components/ui/Icons/TwoRabbitsIcon"

export default {
	title: "Icons/Two Rabbits",
	component: TwoRabbitsIcon,
} as ComponentMeta<typeof TwoRabbitsIcon>

export const Default: ComponentStory<typeof TwoRabbitsIcon> = () => (
	<GreenScreen>
		<TwoRabbitsIcon />
	</GreenScreen>
)
