import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import RabbitIcon from "@/components/ui/Icons/RabbitIcon"

export default {
	title: "Icons/Rabbit",
	component: RabbitIcon,
} as ComponentMeta<typeof RabbitIcon>

export const Default: ComponentStory<typeof RabbitIcon> = () => (
	<GreenScreen>
		<RabbitIcon />
	</GreenScreen>
)
