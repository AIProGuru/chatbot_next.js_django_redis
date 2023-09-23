import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import RabbitsHoleIcon from "@/components/ui/Icons/RabbitsHoleIcon"

export default {
	title: "Icons/Rabbits Hole",
	component: RabbitsHoleIcon,
} as ComponentMeta<typeof RabbitsHoleIcon>

export const Default: ComponentStory<typeof RabbitsHoleIcon> = () => (
	<GreenScreen>
		<RabbitsHoleIcon />
	</GreenScreen>
)
