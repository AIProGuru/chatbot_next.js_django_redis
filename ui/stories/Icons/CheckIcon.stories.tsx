import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import CheckIcon from "@/components/ui/Icons/CheckIcon"

export default {
	title: "Icons/Check",
	component: CheckIcon,
} as ComponentMeta<typeof CheckIcon>

export const Default: ComponentStory<typeof CheckIcon> = () => (
	<GreenScreen>
		<CheckIcon />
	</GreenScreen>
)
