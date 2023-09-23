import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import FilterIcon from "@/components/ui/Icons/FilterIcon"

export default {
	title: "Icons/Filter",
	component: FilterIcon,
} as ComponentMeta<typeof FilterIcon>

export const Default: ComponentStory<typeof FilterIcon> = () => (
	<GreenScreen>
		<FilterIcon />
	</GreenScreen>
)
