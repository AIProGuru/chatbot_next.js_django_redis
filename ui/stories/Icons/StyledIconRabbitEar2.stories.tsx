import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import StyledIconRabbitEar2 from "@/components/ui/Icons/StyledIconRabbitEar2"

export default {
	title: "Icons/Styled Rabbit (2 ears)",
	component: StyledIconRabbitEar2,
} as ComponentMeta<typeof StyledIconRabbitEar2>

export const Default: ComponentStory<typeof StyledIconRabbitEar2> = () => (
	<GreenScreen>
		<StyledIconRabbitEar2 />
	</GreenScreen>
)
