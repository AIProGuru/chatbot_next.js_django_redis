import styles from "./TabBar.module.scss"

interface TabBarProps {
	children: any
}

function TabBar(props: TabBarProps) {
	const {children} = props

	return (
		<div className={styles.TabBar} dir={"ltr"}>
			<div className={styles.TabBarButtonGroup}>{children}</div>
		</div>
	)
}

export default TabBar
