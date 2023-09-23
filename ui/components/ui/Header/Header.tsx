import styles from "./Header.module.scss"
import Logotype from "@/components/ui/Header/Logotype"

interface HeaderProps {
	buttonGroupLeft: any
	buttonGroupRight: any
	textInCenter?: string
}

function Header(props: HeaderProps) {
	const {buttonGroupLeft, buttonGroupRight, textInCenter} = props

	return (
		<div className={styles.Header} dir={"ltr"}>
			<div className={styles.Filters}>{buttonGroupLeft}</div>
			<div className={styles.Logotype}>
				{textInCenter ? <p>{textInCenter}</p> : <Logotype />}
			</div>
			<div className={styles.Actions}>{buttonGroupRight}</div>
		</div>
	)
}

export default Header
