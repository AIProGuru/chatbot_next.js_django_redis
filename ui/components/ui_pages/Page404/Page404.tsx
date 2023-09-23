import Icon404 from "@/components/ui/Icons/404Icon/404Icon"
import Button from "@/components/ui/Button/Button/Button"
import styles from "./Page404.module.scss"
import {useTranslation} from "next-i18next"
import {useRouter} from "next/router"

function Page404() {
	const router = useRouter()
	const {t} = useTranslation("site")

	return (
		<div className={styles.Page404}>
			<div className={styles.Container}>
				<div className={styles.Icon}>
					<Icon404 />
				</div>
				<div className={styles.Info}>
					{t(
						"site.Oops Guess you did not mean to get into this boredom"
					)}
				</div>
				<div className={styles.Actions}>
					<Button
						type={"button"}
						onClick={() => {
							router.push("/").then(() => {
								router.reload()
							})
						}}
					>
						<p className={styles.ButtonText}>
							{t("site.Take me there")}
						</p>
					</Button>
				</div>
			</div>
		</div>
	)
}

export default Page404
