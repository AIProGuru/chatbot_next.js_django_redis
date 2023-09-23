import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import StarIcon from "@/components/ui/Icons/StarIcon"

export default {
	title: "Icons/Star",
	component: StarIcon,
} as ComponentMeta<typeof StarIcon>

export const Default: ComponentStory<typeof StarIcon> = () => (
	<GreenScreen>
		<StarIcon />
	</GreenScreen>
)
