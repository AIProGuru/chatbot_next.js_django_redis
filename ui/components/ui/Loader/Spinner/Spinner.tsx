import styles from "./Spinner.module.scss"

function Spinner() {
	return (
		<div className={styles.Spinner}>
			<div className={styles["lds-spinner"]}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	)
}

export default Spinner
