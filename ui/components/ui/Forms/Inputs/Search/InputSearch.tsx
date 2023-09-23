import styles from "./InputSearch.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {useRouter} from "next/router"
import LoupeIcon from "@/components/ui/Icons/LoupeIcon"

interface InputSearchProps {
	field?: any
	placeholder?: string
	type?: "text" | "number"
	id?: string
}

function InputSearch(props: InputSearchProps) {
	const {field, placeholder, type, id} = props
	const router = useRouter()
	const dir = getDirection(router)

	return (
		<label
			className={cc([styles.InputSearch, dir && styles[dir]])}
			{...(id && {id: id})}
		>
			<div
				className={cc([
					styles.searchIcon,
					dir === "ltr" ? styles.searchRight : styles.searchLeft,
				])}
			>
				<LoupeIcon />
			</div>
			<input
				className={dir === "ltr" ? styles.inputRtl : styles.inputLtr}
				{...(field && {...field})}
				{...(type !== undefined ? {type: type} : {type: "text"})}
				{...(type === "number" && {inputMode: "decimal"})}
				{...(placeholder && {placeholder: placeholder})}
			/>
		</label>
	)
}

export default InputSearch
