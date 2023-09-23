import styles from "./PageLoader.module.scss"
import Spinner from "@/components/ui/Loader/Spinner/Spinner"
import Button from "@/components/ui/Button/Button/Button"
import {useEffect, useState} from "react"
import {useRouter} from "next/router"

interface PageLoaderProps {
	canRefresh?: boolean
}

function PageLoader(props: PageLoaderProps) {
	const {canRefresh} = props
	const router = useRouter()
	const [showRefresh, setShowRefresh] = useState(false)

	const onRefresh = () => {
		router.reload()
	}

	useEffect(() => {
		const t = setTimeout(() => {
			if (canRefresh) {
				setShowRefresh(true)
			}
		}, 3000)

		return () => {
			clearTimeout(t)
		}
	}, [canRefresh])

	return (
		<div className={styles.PageLoader}>
			<Spinner />

			{showRefresh && (
				<div className={styles.CanRefresh}>
					<p>Long loading?</p>
					<Button type={"button"} onClick={onRefresh}>
						<span>Try again</span>
					</Button>
				</div>
			)}
		</div>
	)
}

export default PageLoader
