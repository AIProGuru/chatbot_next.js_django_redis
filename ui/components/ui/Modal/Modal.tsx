import styles from "./Modal.module.scss"

type ModalProps = {
	open: boolean
	setOpen?: () => void
	children: any
}

function Modal(props: ModalProps) {
	const {open, setOpen, children} = props
	return (
		<div
			style={{display: open ? "block" : "none"}}
			className={styles.Modal}
		>
			{children}
		</div>
	)
}

export default Modal
