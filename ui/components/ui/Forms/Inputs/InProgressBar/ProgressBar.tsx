import {getDirection} from "@/components/ui/Functions/GetDirection"
import {useRouter} from "next/router"
import React from "react"
import styles from "./ProgressBar.module.scss"

interface ProgressBarProps {
	valueLength: number
	textInTop?: string
	textInBottom?: string
}

function ProgressBar(props: ProgressBarProps) {
	const {valueLength, textInTop, textInBottom} = props
	const router = useRouter()
	const dir = getDirection(router)
	
	const marginSpan = dir === "ltr" ? styles.SpanLeft : styles.SpanRight

	return (
		<div className={styles.ProgressContainer}>
			{textInTop && <p className={styles.TopText}>{textInTop}</p>}
			<div className={styles.ProgressBarContainer}>
				<span className={marginSpan}>
					{valueLength > 100 ? 100 : Math.ceil(valueLength)}%
				</span>
				<div className={styles.ProgressBar} dir={dir}>
					<div
						className={styles.ProgressBarActive}
						style={{
							width: `${valueLength > 100 ? 100 : valueLength}%`,
						}}
					/>
				</div>
			</div>
			{textInBottom && (
				<p className={styles.BottomText}>{textInBottom}</p>
			)}
		</div>
	)
}

export default ProgressBar
