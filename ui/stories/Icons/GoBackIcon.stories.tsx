import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"

export default {
	title: "Icons/GoBack",
	component: GoBackIcon,
} as ComponentMeta<typeof GoBackIcon>

export const Default: ComponentStory<typeof GoBackIcon> = () => (
	<GreenScreen>
		<GoBackIcon />
	</GreenScreen>
)
