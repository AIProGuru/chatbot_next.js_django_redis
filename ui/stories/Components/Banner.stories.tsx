import React from "react"
import {ComponentStory, ComponentMeta} from "@storybook/react"
import GreenScreen from "../GreenScreen"
import Banner from "@/components/ui/Banner/Banner"
import RabbitsHoleIcon from "@/components/ui/Icons/RabbitsHoleIcon"
import Button from "@/components/ui/Button/Button/Button"

export default {
	title: "Components/Banner",
	component: Banner,
} as ComponentMeta<typeof Banner>

export const Default: ComponentStory<typeof Banner> = () => (
	<GreenScreen>
		<div className="Main">
			<div className="Banner">
				<Banner
					icon={<RabbitsHoleIcon />}
					titles={[
						"אל תדאגו..  ב-SWINGERS",
						"הדיסקרטיות והפרטיות שלכם",
						"חשובה לנו יותר מהכל!",
					]}
					items={[
						"דיסקרטיות ופרטיות",
						"המידע באתר מאובטח ומוצפן",
						"כללי התנהגות שמגנים על החברים",
					]}
					button={
						<Button
							type={"button"}
							variant={"outline"}
							color={"white"}
							fullWidth={true}
							id={"button_banner"}
						>
							<p className="BannerButtonText">ספרו לי עוד</p>
						</Button>
					}
				/>
			</div>
		</div>

		<p>.Main & .Banner classes are from global styles</p>
	</GreenScreen>
)
