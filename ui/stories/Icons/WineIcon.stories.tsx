import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import WineIcon from "@/components/ui/Icons/WineIcon"

export default {
	title: "Icons/Wine",
	component: WineIcon,
} as ComponentMeta<typeof WineIcon>

export const Default: ComponentStory<typeof WineIcon> = () => (
	<GreenScreen>
		<WineIcon />
	</GreenScreen>
)
