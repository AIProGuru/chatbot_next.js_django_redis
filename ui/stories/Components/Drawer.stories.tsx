import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import BottomDrawer from "@/components/ui/Drawer/BottomDrawer/BottomDrawer"

export default {
	title: "Components/BottomDrawer",
	component: BottomDrawer,
	argTypes: {
		setShow: {
			control: "Function",
		},
	},
} as ComponentMeta<typeof BottomDrawer>

export const Default: ComponentStory<typeof BottomDrawer> = (args) => (
	<>
		<BottomDrawer {...args}>
			<div style={{padding: "50px 0", color: "green"}}>test content</div>
		</BottomDrawer>

		<GreenScreen>
			<p>animation works correctly only in real app</p>
		</GreenScreen>
	</>
)
