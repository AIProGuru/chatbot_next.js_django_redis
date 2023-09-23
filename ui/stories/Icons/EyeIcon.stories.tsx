import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import EyeIcon from "@/components/ui/Icons/EyeIcon"

export default {
	title: "Icons/Eye",
	component: EyeIcon,
} as ComponentMeta<typeof EyeIcon>

export const Default: ComponentStory<typeof EyeIcon> = () => (
	<GreenScreen>
		<EyeIcon />
	</GreenScreen>
)
