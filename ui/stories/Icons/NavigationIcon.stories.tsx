import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import NavigationIcon from "@/components/ui/Icons/NavigationIcon"

export default {
	title: "Icons/Navigation",
	component: NavigationIcon,
} as ComponentMeta<typeof NavigationIcon>

export const Default: ComponentStory<typeof NavigationIcon> = () => (
	<GreenScreen>
		<NavigationIcon />
	</GreenScreen>
)
