import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import CloseIcon from "@/components/ui/Icons/CloseIcon"

export default {
	title: "Icons/Close",
	component: CloseIcon,
} as ComponentMeta<typeof CloseIcon>

export const Default: ComponentStory<typeof CloseIcon> = () => (
	<GreenScreen>
		<CloseIcon />
	</GreenScreen>
)
