import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import MaleIcon from "@/components/ui/Icons/MaleIcon"

export default {
	title: "Icons/Male",
	component: MaleIcon,
} as ComponentMeta<typeof MaleIcon>

export const Default: ComponentStory<typeof MaleIcon> = () => (
	<GreenScreen>
		<MaleIcon />
	</GreenScreen>
)
