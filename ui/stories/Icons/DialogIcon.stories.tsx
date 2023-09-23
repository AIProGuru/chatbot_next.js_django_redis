import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import DialogIcon from "@/components/ui/Icons/DialogIcon"

export default {
	title: "Icons/Dialog",
	component: DialogIcon,
} as ComponentMeta<typeof DialogIcon>

export const Default: ComponentStory<typeof DialogIcon> = () => (
	<GreenScreen>
		<DialogIcon />
	</GreenScreen>
)
