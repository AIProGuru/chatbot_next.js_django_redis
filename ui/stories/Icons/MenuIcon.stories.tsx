import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import MenuIcon from "@/components/ui/Icons/MenuIcon"

export default {
	title: "Icons/Menu",
	component: MenuIcon,
} as ComponentMeta<typeof MenuIcon>

export const Default: ComponentStory<typeof MenuIcon> = () => (
	<GreenScreen>
		<MenuIcon />
	</GreenScreen>
)
