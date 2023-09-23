import styles from "./DetailsProfile.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import Tag from "@/components/ui/Tag/Tag"
import Divider from "@/components/ui/Divider/Divider"
import {useTranslation} from "next-i18next"
import { useRouter } from "next/router"
import { getDirection } from "../../Functions/GetDirection"

interface DetailsProfileProps {
	// smoking?: string[]
	// space?: string[] // separate room or one space
	// relationships?: string[]
	// acts?: string[]
	// experience?: string[]
	blocks: Block[]
}

type Block = {
	title: string
	items?: string[]
}

function DetailsProfile(props: DetailsProfileProps) {
	const {t} = useTranslation("site")
	const router = useRouter()
	const dir = getDirection(router)

	const {blocks} = props

	return (
		<div className={cc([styles.DetailsProfile])} style={{direction : dir === "ltr" ?  "ltr" :  "rtl"}}>
			<h2>{t("site.A little more about us")}…</h2>

			{blocks &&
				blocks.map((block: Block, index: number) => {
					return (
						<div key={index} className={styles.Block}>
							<h3>{block.title}</h3>

							{block.items && (
								<div className={styles.Tags}>
									{block.items.map(
										(item: string, index: number) => {
											return <Tag key={index}>{item}</Tag>
										}
									)}
								</div>
							)}

							<div className={styles.Divider}>
								<Divider />
							</div>
						</div>
					)
				})}

			{/*<div className={styles.Block}>*/}
			{/*	<h3>{t("site.smoking")}:</h3>*/}

			{/*	<div className={styles.Tags}>*/}
			{/*		<Tag>{t("site.From snoring regular cigarettes")}</Tag>*/}
			{/*		<Tag>{t("site.From snoring regular cigarettes")}</Tag>*/}
			{/*	</div>*/}

			{/*	<Divider />*/}
			{/*</div>*/}
		</div>
	)
}

export default DetailsProfile
