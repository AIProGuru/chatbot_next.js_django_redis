import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import StyledIconRabbitEar1 from "@/components/ui/Icons/StyledIconRabbitEar1"

export default {
	title: "Icons/Styled Rabbit (1 ear)",
	component: StyledIconRabbitEar1,
} as ComponentMeta<typeof StyledIconRabbitEar1>

export const Default: ComponentStory<typeof StyledIconRabbitEar1> = () => (
	<GreenScreen>
		<StyledIconRabbitEar1 />
	</GreenScreen>
)
