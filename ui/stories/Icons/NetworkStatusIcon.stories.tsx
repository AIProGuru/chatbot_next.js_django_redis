import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import NetworkStatusIcon from "@/components/ui/Icons/NetworkStatusIcon"

export default {
	title: "Icons/Network Status",
	component: NetworkStatusIcon,
} as ComponentMeta<typeof NetworkStatusIcon>

export const Default: ComponentStory<typeof NetworkStatusIcon> = (args) => (
	<GreenScreen>
		<NetworkStatusIcon {...args} />
	</GreenScreen>
)
