import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../../GreenScreen"
import UpcomingEvent from "@/components/ui/Events/UpcomingEvent"

export default {
	title: "Components/Events/UpcomingEvent",
	component: UpcomingEvent,
	argTypes: {
		variant: {
			options: ["", "inside-button"],
			control: "radio",
		},
	},
} as ComponentMeta<typeof UpcomingEvent>

export const Default: ComponentStory<typeof UpcomingEvent> = (args) => (
	<GreenScreen>
		<div style={{minWidth: "300px"}}>
			<UpcomingEvent {...args} />
		</div>
	</GreenScreen>
)
