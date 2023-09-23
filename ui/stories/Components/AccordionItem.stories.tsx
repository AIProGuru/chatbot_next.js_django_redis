import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import AccordionItem from "@/components/ui/Accordion/AccordionItem"
import AccordionGroup from "@/components/ui/Accordion/AccordionGroup"

export default {
	title: "Components/Accordion/Accordion Item",
	component: AccordionItem,
} as ComponentMeta<typeof AccordionItem>

export const Default: ComponentStory<typeof AccordionItem> = () => (
	<GreenScreen>
		<div style={{width: "300px", color: "green"}}>
			<AccordionGroup>
				<AccordionItem title={"אנחנו זוג"}>
					<div className="AccordionContent">Content here</div>
				</AccordionItem>
				<AccordionItem title={"מחפשים זוגות"}>
					<div className="AccordionContent">Content here</div>
				</AccordionItem>
				<AccordionItem title={"בחרו אזור"}>
					<div className="AccordionContent">Content here</div>
				</AccordionItem>
			</AccordionGroup>
		</div>
		<p>
			Don`t forget to add your custom content area for your content inside
			of AccordionItem
		</p>
	</GreenScreen>
)
