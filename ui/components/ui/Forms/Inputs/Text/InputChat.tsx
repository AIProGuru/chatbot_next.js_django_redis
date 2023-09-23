import {cc} from "@/components/ui/Functions/Classnames"
import styles from "@/components/ui/Forms/Inputs/Text/InputChat.module.scss"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import Button from "@/components/ui/Button/Button/Button"
import autosize from "autosize"
import {useTranslation} from "next-i18next"
import {useEffect} from "react"

interface InputChatProps {
	field?: any
	register?: any
	placeholder: string
	type?: string
	sent: boolean
}

function InputChat(props: InputChatProps) {
	const {t} = useTranslation("site")
	const {field, placeholder, register, type, sent} = props

	const router = useRouter()
	const dir = getDirection(router)

	useEffect(() => {
		autosize(document.querySelectorAll("textarea"))
	})

	return (
		<label className={cc([styles.InputChat, dir && styles[dir]])}>
			<textarea
				rows={1}
				{...(field && {...field})}
				{...(register && {...register})}
				{...(type !== undefined ? {type: type} : {type: "text"})}
				{...(placeholder && {placeholder: placeholder})}
			/>
			<div className={cc([styles.Actions, dir && styles[dir]])}>
				<Button
					type={"button"}
					fullWidth={true}
					id={"button_send_message"}
					prevent={false}
					mode={"submit"}
					disabled={sent}
				>
					<p>{sent ? t("site.Send") : t("site.Sent")}</p>
				</Button>
			</div>
		</label>
	)
}

export default InputChat
