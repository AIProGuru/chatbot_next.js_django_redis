import styles from "./TryTabs.module.scss"
import TryTabButton, {
	TryTabButtonVariants,
} from "@/components/ui/Tabs/TryTabs/TryTabButton/TryTabButton"

interface TryTabsProps {
	currentValue: number
	setValue: Function
	tabs: Tab[]
	variant?: TryTabButtonVariants
}

export type Tab = {
	value: number
	title: string
	hidden?: boolean
}

function TryTabs(props: TryTabsProps) {
	const {currentValue, setValue, tabs, variant} = props

	return (
		<div className={styles.TryTabs}>
			{tabs &&
				tabs.map((tab, index) => {
					if (!tab.hidden) {
						return (
							<TryTabButton
								key={index}
								title={tab.title}
								value={tab.value}
								currentValue={currentValue}
								onClick={setValue}
								{...(variant && {variant: variant})}
							/>
						)
					}
				})}
		</div>
	)
}

export default TryTabs
