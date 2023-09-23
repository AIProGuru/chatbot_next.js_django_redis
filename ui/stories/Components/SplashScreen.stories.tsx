import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import SplashScreen from "@/components/ui/Splash/SplashScreen"

export default {
	title: "Components/SplashScreen",
	component: SplashScreen,
	// argTypes: {
	// 	color: {
	// 		options: ["white"],
	// 		control: {type: "check"},
	// 	},
	// },
} as ComponentMeta<typeof SplashScreen>

export const Default: ComponentStory<typeof SplashScreen> = (args) => (
	<GreenScreen>
		<div style={{minWidth: "375px"}}>
			<SplashScreen {...args} />
		</div>
	</GreenScreen>
)
