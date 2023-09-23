import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import StoriesCarousel from "@/components/ui/Carousel/Stories/StoriesCarousel"
import StoriesButton from "@/components/ui/Carousel/Stories/StoriesButton"

export default {
	title: "Components/Carousel",
	component: StoriesCarousel,
} as ComponentMeta<typeof StoriesCarousel>

const demoStories = [
	{
		mode: "text",
		text: "לכל\n הפנויים\n היום",
	},
	{
		image: "https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
		href: "#",
	},
	{
		image: "https://images.pexels.com/photos/4611971/pexels-photo-4611971.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
		href: "#",
	},
	{
		image: "https://images.pexels.com/photos/2346735/pexels-photo-2346735.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
		href: "#",
	},
	{
		image: "https://images.pexels.com/photos/4606770/pexels-photo-4606770.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
		href: "#",
	},
	{
		image: "https://images.pexels.com/photos/2249172/pexels-photo-2249172.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
		href: "#",
	},
]

export const Default: ComponentStory<typeof StoriesCarousel> = () => (
	<GreenScreen>
		<div style={{maxWidth: "380px"}}>
			<StoriesCarousel>
				{demoStories &&
					demoStories.map((story: any, index: number) => {
						return (
							<StoriesButton
								key={index}
								image={story.image || "#"}
								href={story.href || "#"}
								{...(story.mode && {mode: story.mode})}
								{...(story.text && {text: story.text})}
							/>
						)
					})}
			</StoriesCarousel>
		</div>

		<p>Try scroll</p>
	</GreenScreen>
)
