import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../../../GreenScreen"
import InputSwitch from "@/components/ui/Forms/Inputs/Switch/InputSwitch"

export default {
	title: "Components/Forms/Inputs/SwitchWithPrice",
	component: InputSwitch,
	// argTypes: {
	// 	color: {
	// 		options: ["white"],
	// 		control: {type: "check"},
	// 	},
	// },
} as ComponentMeta<typeof InputSwitch>

export const Default: ComponentStory<typeof InputSwitch> = (args) => (
	<GreenScreen>
		<div style={{minWidth: "300px"}}>
			<InputSwitch {...args} />
		</div>
		<p>Set value, price and title</p>
	</GreenScreen>
)
