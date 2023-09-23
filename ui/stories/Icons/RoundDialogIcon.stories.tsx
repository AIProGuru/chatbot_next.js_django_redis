import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import RoundDialogIcon from "@/components/ui/Icons/RoundDialogIcon"

export default {
	title: "Icons/Round Dialog",
	component: RoundDialogIcon,
} as ComponentMeta<typeof RoundDialogIcon>

export const Default: ComponentStory<typeof RoundDialogIcon> = () => (
	<GreenScreen>
		<RoundDialogIcon />
	</GreenScreen>
)
