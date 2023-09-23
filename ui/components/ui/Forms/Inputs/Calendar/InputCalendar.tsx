import styles from "./InputCalendar.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {useRouter} from "next/router"
import React, {useCallback, useEffect, useState} from "react"
import Calendar from "react-calendar"
import Drawer from "@/components/ui/Drawer/Drawer/Drawer"
import {format} from "date-fns"
import Button from "@/components/ui/Button/Button/Button"
import {useTranslation} from "next-i18next"

interface InputCalendarProps {
	register: any
	setValue: any
	placeholder?: string
	id?: string
	name: string
	defaultValue?: number | string
	disabled?: boolean
	error?: string
}

function InputCalendar(props: InputCalendarProps) {
	const {
		register,
		setValue,
		name,
		placeholder,
		id,
		defaultValue,
		disabled,
		error,
	} = props
	const router = useRouter()
	const dir = getDirection(router)
	const {t} = useTranslation("site")

	const [drawerState, setDrawerState] = useState(false)
	const [value, onChange] = useState()
	const [drawerTrigger, setDrawerTrigger] = useState(false)

	function updateDrawer(state: boolean) {
		setDrawerState(state)
	}

	const toggleDrawerTrigger = () => {
		setDrawerTrigger(true)

		setTimeout(() => {
			setDrawerTrigger(false)
		}, 100)
	}

	const applyCalendarValue = useCallback(
		(v: any) => {
			onChange(v)
			setValue(name, v.getTime())
		},
		[name, setValue]
	)

	// function applyCalendarValue(v: any) {
	// 	onChange(v)
	// 	setValue(name, v)
	// }

	useEffect(() => {
		defaultValue && applyCalendarValue(new Date(defaultValue))
	}, [applyCalendarValue, defaultValue])

	return (
		<>
			<label
				className={cc([
					styles.InputCalendar,
					dir && styles[dir],
					disabled && styles.Disabled,
				])}
				{...(id && {id: id})}
			>
				<input
					type={"text"}
					placeholder={placeholder}
					onFocus={() => {
						if (disabled) return
						updateDrawer(true)
					}}
					value={value && format(value, "dd/MM")}
					{...register(name)}
					autoComplete={"off"}
					spellCheck={false}
					disabled={disabled}
				/>
			</label>
			<div className={styles.ErrorContainer}>
				{error && <p className={styles.InputTextError}>{error}</p>}
			</div>

			<Drawer
				show={drawerState}
				setShow={setDrawerState}
				position={"bottom"}
				trigger={drawerTrigger}
			>
				<div className={styles.DrawerCalendarContainer}>
					<div className={styles.Info}>
						<p>{t("site.Select your birthday month day")}</p>
					</div>

					<Calendar
						onClickMonth={(v) => {
							applyCalendarValue(v)
						}}
						onClickDay={(v) => {
							applyCalendarValue(v)
						}}
						onChange={(v: any) => {
							applyCalendarValue(v)
						}}
						value={value}
						// minDate={new Date()}
						defaultView={"year"}
						// maxDetail={"year"}
						// minDetail={"month"}
						showNavigation={false}
						locale={router.locale}
					/>

					<div className={styles.Action}>
						<Button
							type={"button"}
							prevent={true}
							fullWidth={true}
							onClick={() => {
								toggleDrawerTrigger()
							}}
						>
							<p className={styles.ActionButtonText}>
								{t("site.Apply selection")}
							</p>
						</Button>
					</div>
				</div>
			</Drawer>
		</>
	)
}

export default InputCalendar
