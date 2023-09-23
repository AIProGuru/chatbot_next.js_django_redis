import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../../GreenScreen"
import DisplayEventHeader from "@/components/ui/Events/DisplayEvent/DisplayEventHeader/DisplayEventHeader"

export default {
	title: "Components/Events/DisplayEventHeader",
	component: DisplayEventHeader,
	// argTypes: {
	// 	variant: {
	// 		options: ["", "big-text"],
	// 		control: "radio",
	// 	},
	// },
} as ComponentMeta<typeof DisplayEventHeader>

export const Default: ComponentStory<typeof DisplayEventHeader> = (args) => (
	<GreenScreen>
		<div style={{minWidth: "300px"}}>
			<DisplayEventHeader {...args} />
		</div>
	</GreenScreen>
)
