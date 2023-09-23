import styles from "./AvailableTodayBlock.module.scss"
import {useTranslation} from "next-i18next"
import {AvailableTitle, ProfileAvailable} from "@/services/available.service"
import {getTitleList} from "../../../../pages/available-today"
import { useRouter } from "next/router"
import { getDirection } from "../../Functions/GetDirection"

interface AvailableTodayBlockProps {
	profileAvailable: ProfileAvailable | undefined
}

function AvailableTodayBlock(props: AvailableTodayBlockProps) {
	const {profileAvailable} = props
	const {t} = useTranslation("site")
	const router = useRouter()
	const dir = getDirection(router)
	const titleList = getTitleList(t)

	const isSelfAvailable = () => {
		return !!profileAvailable
	}

	const getSelectedTitles = (titleCodes: AvailableTitle[]): string => {
		if (!titleCodes) return "-"
		return titleCodes
			.map((title) => {
				const search = titleList.find((s) => s.id === title)
				if (search) {
					return search.title
				}
			})
			.filter((e) => e)
			.join(", ")
	}

	if (!profileAvailable || !isSelfAvailable()) return null

	return (
		<>
			{isSelfAvailable() && (
				<div className={styles.AvailableTodayBlock}>
					<div className={styles.TitleContainer}>
						<div className={styles.Title}>
							<span>{t("site.Available today")}</span>
						</div>
					</div>
					<div className={styles.SuitsUsContainer}>
						<div className={styles.SuitsUs}>
							<span>{t("site.Appropriate for us")} </span>{" "}
							{getSelectedTitles(profileAvailable?.title)}
						</div>
					</div>
					{isSelfAvailable() && profileAvailable.description && (
						<div className={styles.DescriptionContainer}>
							<div className={styles.Description}>
								{profileAvailable.description}
							</div>
						</div>
					)}
				</div>
			)}
		</>
	)
}

export default AvailableTodayBlock
