import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import VerifiedIcon from "@/components/ui/Icons/VerifiedIcon"
import GreenScreen from "../GreenScreen"

export default {
	title: "Icons/Verified",
	component: VerifiedIcon,
} as ComponentMeta<typeof VerifiedIcon>

export const Default: ComponentStory<typeof VerifiedIcon> = () => (
	<GreenScreen>
		<VerifiedIcon />
	</GreenScreen>
)
