import styles from "./InputCode.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {useRouter} from "next/router"
import {useEffect, useRef, useState} from "react"

interface InputCodeProps {
	field?: any
	codeLength: number
	id?: string
	error?: string
}

function InputCode(props: InputCodeProps) {
	const {field, id, codeLength, error} = props
	const propCodeLength = codeLength

	const router = useRouter()
	const dir = getDirection(router)

	const inputRef = useRef<HTMLInputElement>(null)
	const [value, setValue] = useState("")

	// used to draw input background correctly
	function generator(length: number): number[] {
		return Array(length).fill(1)
	}

	useEffect(() => {
		if (inputRef && inputRef.current) {
			const el = inputRef.current
			el.addEventListener("select", () => {
				el.selectionStart = el.selectionEnd = 10000
			})
		}
	}, [inputRef])

	// onChange input on event calls this function
	function handleInputChange(newValue: string) {
		// it will check that newValue length is bigger than 0, else it is empty field
		if (newValue.length < 1) {
			setValue("")
		}

		// to get code we need to replace all letters, and also, to be sure use parseInt after replace
		const code = parseInt(newValue.replace(/\D/g, ""))

		// also check, is it really number, not NaN, or etc
		if (Number(code)) {
			setValue(code.toString())
		}

		if (code.toString().length >= propCodeLength) {
			inputRef && inputRef.current?.blur()
		}
	}

	return (
		<>
			<label
				className={cc([styles.InputCode, dir && styles[dir]])}
				{...(id && {id: id})}
			>
				<div
					className={cc([
						styles.InputBackground,
						propCodeLength > 5 && styles.InputSmall,
					])}
				>
					<input
						//{...(field && {...field})}
						onChange={(e) => {
							field && field.onChange(e)
							handleInputChange(e.target.value)
						}}
						onBlur={(e) => {
							field && field.onBlur(e)
						}}
						onFocus={(e) => {
							if (inputRef && inputRef.current) {
								inputRef.current.setSelectionRange(0, 4)
							}
						}}
						name={field && field.name}
						value={value}
						type={"text"}
						inputMode={"decimal"}
						maxLength={propCodeLength}
						autoComplete={"off"}
						ref={inputRef}
					/>

					{generator(propCodeLength).map(
						(key: number, index: number) => {
							return <div key={index}>{value[index]}</div>
						}
					)}
				</div>
			</label>
			<div className={styles.ErrorContainer}>
				{error && <p className={styles.InputTextError}>{error}</p>}
			</div>
		</>
	)
}

export default InputCode
