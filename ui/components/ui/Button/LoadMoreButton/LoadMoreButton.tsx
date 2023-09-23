import styles from "./LoadMoreButton.module.scss"
import Button from "@/components/ui/Button/Button/Button"
import Spinner from "@/components/ui/Loader/Spinner/Spinner"

interface LoadMoreButtonProps {
	isLoading: boolean
	label: string
	id?: string
	onClick?: Function
	page: number
	count: number
}

function LoadMoreButton(props: LoadMoreButtonProps) {
	const {isLoading, label, id, onClick, page, count} = props

	const maxPages = Math.ceil(count / 10)

	return (
		<div className={styles.MoreButton}>
			{/*{count} / {page} / {maxPages}*/}

			{page < maxPages && (
				<Button
					type={"button"}
					variant={"outline"}
					{...(id && {id: id})}
					{...(onClick && {onClick: onClick})}
					isLoading={isLoading}
				>
					<p className={styles.Text}>{label}</p>
				</Button>
			)}
		</div>
	)
}

export default LoadMoreButton
