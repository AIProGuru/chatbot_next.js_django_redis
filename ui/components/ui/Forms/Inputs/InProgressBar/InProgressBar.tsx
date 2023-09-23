import {getDirection} from "@/components/ui/Functions/GetDirection"
import {useRouter} from "next/router"
import React from "react"
import styles from "./InProgressBar.module.scss"
import {useTranslation} from "next-i18next"

interface InProgressBarProps {
	maxCount: number
	valueLength: number
	withText?: boolean
}

function InProgressBar(props: InProgressBarProps) {
	const {t} = useTranslation("site")
	const {maxCount, valueLength, withText} = props
	const router = useRouter()
	const dir = getDirection(router)
	const isLeft = dir === "ltr"

	const calcValueLength =
		valueLength > maxCount ? 100 : (valueLength * 100) / maxCount

	const marginSpan = isLeft ? styles.SpanLeft : styles.SpanRight

	return (
		<div className={styles.InProgressContainer}>
			<div className={styles.InProgressBarContainer}>
				<span className={marginSpan}>{valueLength}</span>
				<div className={styles.InProgressBar}>
					<div
						className={styles.InProgressBarActive}
						style={{width: `${calcValueLength}%`}}
					/>
				</div>
			</div>
			{withText && (
				<p>
					{t("site.at least")} {maxCount}{" "}
					{t("site.Characters to get to know you better")}
				</p>
			)}
		</div>
	)
}

export default InProgressBar
