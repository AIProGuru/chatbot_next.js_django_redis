import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import FemaleIcon from "@/components/ui/Icons/FemaleIcon"

export default {
	title: "Icons/Female",
	component: FemaleIcon,
} as ComponentMeta<typeof FemaleIcon>

export const Default: ComponentStory<typeof FemaleIcon> = () => (
	<GreenScreen>
		<FemaleIcon />
	</GreenScreen>
)
