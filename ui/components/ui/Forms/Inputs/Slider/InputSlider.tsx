import styles from "./InputSlider.module.scss"
import ReactSlider from "react-slider"
import {useEffect, useState} from "react"

interface InputSliderProps {
	field: any
	min: number
	max: number
}

function InputSlider(props: InputSliderProps) {
	const {field, min, max} = props
	// const [currentValue, setCurrentValue] = useState<number[]>([])
	const [defaultValue, setDefaultValue] = useState<number[] | undefined>(
		undefined
	)

	useEffect(() => {
		if (!field || !field.value) return
		setDefaultValue(field.value)
	}, [field])

	// useEffect(() => {
	// 	if (!currentValue) return

	// 	// const debounce = setTimeout(() => {
	// 	// 	field && field.onChange(currentValue)
	// 	// }, 500)

	// 	// return () => {
	// 	// 	clearTimeout(debounce)
	// 	// }
	// }, [currentValue])

	if (!defaultValue) return null
	return (
		<div className={styles.InputSlider}>
			<input type="text" {...field} hidden={true} />
			<ReactSlider
				min={min}
				max={max}
				className="horizontal-slider"
				thumbClassName={styles.Thumb}
				trackClassName={styles.Track}
				defaultValue={defaultValue}
				ariaLabel={["Lower thumb", "Upper thumb"]}
				ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
				renderThumb={(props, state) => (
					<div {...props}>{state.valueNow}</div>
				)}
				pearling
				minDistance={5}
				onChange={(value) => {
					field && field.onChange(value)
					// setCurrentValue(value)
				}}
				onAfterChange={() => {
					field && field.onBlur()
				}}
			/>
		</div>
	)
}

export default InputSlider
