// import styles from "./PickerItem.module.scss"

interface PickerItemProps {
	value: string
	title: string
	// ref?: any
}

function PickerItem(props: PickerItemProps) {
	const {value, title} = props

	return <li>{title}</li>
}

export default PickerItem
