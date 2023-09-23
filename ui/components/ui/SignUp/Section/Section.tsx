import styles from "./Section.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"

interface SectionProps {
	title?: string
	description?: string
	children: any
	padding?: "small"
	boldTitle?: boolean
	variant?: "profile"
}

function Section(props: SectionProps) {
	const {title, description, children, padding, boldTitle, variant} = props

	return (
		<div
			className={cc([
				styles.Section,
				padding && styles["Padding-" + padding],
				variant && styles["Variant-" + variant],
			])}
		>
			{title && (
				<div
					className={cc([
						styles.Title,
						boldTitle && styles.BoldTitle,
					])}
				>
					{title}
				</div>
			)}
			{description && (
				<div className={styles.Description}>{description}</div>
			)}
			<div className={cc([styles.Content, !title && styles.NoTitle])}>
				{children}
			</div>
		</div>
	)
}

export default Section
