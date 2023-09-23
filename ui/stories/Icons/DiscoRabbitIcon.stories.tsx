import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import DiscoRabbitIcon from "@/components/ui/Icons/DiscoRabbitIcon"

export default {
	title: "Icons/DiscoRabbit",
	component: DiscoRabbitIcon,
} as ComponentMeta<typeof DiscoRabbitIcon>

export const Default: ComponentStory<typeof DiscoRabbitIcon> = () => (
	<GreenScreen>
		<DiscoRabbitIcon />
	</GreenScreen>
)
