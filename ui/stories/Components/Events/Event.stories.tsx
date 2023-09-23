import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../../GreenScreen"
import Event from "@/components/ui/Events/Event"

export default {
	title: "Components/Events/Event",
	component: Event,
	argTypes: {
		variant: {
			options: ["", "big-text"],
			control: "radio",
		},
	},
} as ComponentMeta<typeof Event>

export const Default: ComponentStory<typeof Event> = (args) => (
	<GreenScreen>
		<div style={{minWidth: "300px"}}>
			<Event {...args} />
		</div>
	</GreenScreen>
)
