import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import ArrowIcon from "@/components/ui/Icons/ArrowIcon"
import GreenScreen from "../GreenScreen"

export default {
	title: "Icons/Arrow",
	component: ArrowIcon,
} as ComponentMeta<typeof ArrowIcon>

export const Default: ComponentStory<typeof ArrowIcon> = () => (
	<GreenScreen>
		<ArrowIcon />
	</GreenScreen>
)
