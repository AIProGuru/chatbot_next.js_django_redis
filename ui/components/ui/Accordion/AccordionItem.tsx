import styles from "./AccordionItem.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import {useEffect, useState} from "react"
import ArrowIcon from "@/components/ui/Icons/ArrowIcon"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"

interface AccordionItemProps {
	title?: string
	select?: string
	children?: any
	mode?: "drawer"
	callback?: Function
	variant?: "filters" | "step5" | 'sort_by'
	openByDefault?: boolean
}

function AccordionItem(props: AccordionItemProps) {
	const {title, children, mode, callback, select, variant, openByDefault} =
		props
	// const [inputValue, setInputValue] = useState(true)
	const [open, setOpen] = useState(false)
	const router = useRouter()
	const dir = getDirection(router)

	function toggleInput() {
		// setInputValue((prevState) => !prevState)
		setOpen((prevState) => !prevState)
	}

	function onClickHandler() {
		callback && callback()
		if (!callback) {
			toggleInput()
		}
	}

	useEffect(() => {
		if (openByDefault) {
			toggleInput()
		}
	}, [openByDefault])

	return (
		<div
			className={cc([
				styles.AccordionItem,
				open && styles.Active,
				dir && styles[dir],
				variant && styles["Variant-" + variant],
			])}
			id={"accordion_item"}
		>
			{/*<input*/}
			{/*	type="checkbox"*/}
			{/*	name="accordionItemCheckbox"*/}
			{/*	{...(mode === "drawer"*/}
			{/*		? {checked: true}*/}
			{/*		: {checked: inputValue})}*/}
			{/*	{...(mode === "drawer"*/}
			{/*		? {onChange: () => {}}*/}
			{/*		: {onChange: toggleInput})}*/}
			{/*	{...(callback && {onClick: onClickHandler})}*/}
			{/*/>*/}

			<div className={cc([styles.Summary])} onClick={onClickHandler}>
				<div className={cc([styles.Title])}>
					<div className={styles.Left}>{title}</div>
					{select && <div className={styles.Right}>{select}</div>}
				</div>
				<div className={cc([styles.Icon])}>
					<ArrowIcon />
				</div>
			</div>

			<div className={cc([styles.ContentContainer])}>{children}</div>
		</div>
	)
}

export default AccordionItem
