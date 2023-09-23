import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import Button from "@/components/ui/Button/Button/Button"

export default {
	title: "Components/Button",
	component: Button,
	argTypes: {
		type: {
			options: ["button", "link"],
			control: {type: "radio"},
		},
		mode: {
			options: ["submit"],
			control: {type: "check"},
		},
	},
} as ComponentMeta<typeof Button>

export const Default: ComponentStory<typeof Button> = (args) => (
	<GreenScreen>
		<div style={{width: "350px"}}>
			<Button {...args} onClick={() => {}}>
				Button text here
			</Button>
		</div>
	</GreenScreen>
)

export const LinkAsButton: ComponentStory<typeof Button> = () => (
	<GreenScreen>
		<Button type={"link"} href={"#"}>
			<span style={{color: "white"}}>Link as button</span>
		</Button>
	</GreenScreen>
)

export const FullWidth: ComponentStory<typeof Button> = () => (
	<GreenScreen>
		<div style={{width: "350px"}}>
			<Button type={"button"} fullWidth={true}>
				<span style={{color: "white"}}>Full width button</span>
			</Button>
		</div>
	</GreenScreen>
)

export const Outline: ComponentStory<typeof Button> = () => (
	<GreenScreen>
		<Button type={"button"} variant={"outline"}>
			<span style={{color: "white"}}>Outline button</span>
		</Button>

		<p>purple color by default</p>
	</GreenScreen>
)

export const OutlineWhite: ComponentStory<typeof Button> = () => (
	<GreenScreen>
		<Button type={"button"} variant={"outline"} color={"white"}>
			<span style={{color: "white"}}>Outline button white</span>
		</Button>
	</GreenScreen>
)

export const CustomText: ComponentStory<typeof Button> = () => (
	<GreenScreen>
		<Button type={"button"} onClick={() => {}}>
			<p
				style={{
					fontSize: "14px",
					fontWeight: 700,
					color: "white",
					margin: "8px 16px",
				}}
			>
				Button text here
			</p>
		</Button>

		<p>Use global or local styles to customize text inside of the button</p>
	</GreenScreen>
)
