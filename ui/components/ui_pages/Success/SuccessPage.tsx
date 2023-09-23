import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import Logotype from "@/components/ui/Header/Logotype"
import SuccessRabbitIcon from "@/components/ui/Icons/SuccessRabbitIcon"
import Button, {ButtonProps} from "@/components/ui/Button/Button/Button"
import styles from "./SuccessPage.module.scss"

interface SuccessPageProps {
	struct: Struct
}

export type Struct = {
	content: string[]
	actions: Actions[]
	close: Function
}

type Actions = ButtonProps & {classname?: string}

function SuccessPage(props: SuccessPageProps) {
	const {struct} = props

	return (
		<div className={styles.SuccessPageContainer}>
			<div className={styles.SuccessPage}>
				<div className={styles.GoBack}>
					<TransparentButton
						icon={<CloseIcon style={"light"} />}
						onClick={() => {
							struct && struct.close && struct.close()
						}}
					/>
				</div>
				<div className={styles.WelcomeLogotype}>
					<Logotype size={"signup"} />
				</div>
				<div className={styles.SuccessRabbitContainer}>
					<SuccessRabbitIcon />
					{struct &&
						struct.content &&
						struct.content.map((row, index) => {
							return <p key={index}>{row}</p>
						})}
				</div>
				<div className={styles.Actions}>
					{struct &&
						struct.actions &&
						struct.actions.map((action, index) => {
							return (
								<div key={index} className={styles.Button}>
									<Button {...action}>
										<p
											{...(action.classname && {
												className:
													styles[action.classname],
											})}
										>
											{action.children}
										</p>
									</Button>
								</div>
							)
						})}
				</div>
			</div>
		</div>
	)
}

export default SuccessPage
