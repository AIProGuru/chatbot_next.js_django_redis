import styles from "./CommentBlog.module.scss"
import {useRouter} from "next/router"
import {useTranslation} from "next-i18next"
import {format} from "date-fns"
import Divider from "../../Divider/Divider"

interface CommentBlogProps {
	name: string
	dateCreate: string
	description: string
}

function CommentBlog(props: CommentBlogProps) {
	const {name, dateCreate, description} = props

	const {t} = useTranslation("site")
	// const [showChat, setShowChat] = useState(false)
	// const [showReplyInput, setShowReplyInput] = useState(false)
	// const [showReplies, setShowReplies] = useState(false)
	//
	// const {control, setValue} = useForm()

	const router = useRouter()
	// const dir = getDirection(router)

	const listReplies = [
		{
			id: 1,
			dateCreate: dateCreate,
			description: description,
		},
		{
			id: 2,
			dateCreate: dateCreate,
			description: description,
		},
		{
			id: 3,
			dateCreate: dateCreate,
			description: description,
		},
	]
	const replyCount = listReplies.length

	return (
		<>
			<Divider />
			<div className={styles.CommentBlog}>
				<p className={styles.Title}>{name || "-"}</p>
				{dateCreate && (
					<p className={styles.DateCreate}>
						{t("site.Posted in")} -{" "}
						{format(new Date(dateCreate), "dd/MM/yyyy")}{" "}
						{t("site.At")} {format(new Date(dateCreate), "HH:mm")}
					</p>
				)}
				<p className={styles.Description}>{description || "-"}</p>
				{/* <div className={styles.ReplyOrShowReply}>
					<div onClick={() => setShowReplyInput(!showReplyInput)}>
						<ViewedBlogIcon />
						<p>{t("site.Post a comment")}</p>
					</div>
					<div
						onClick={() => setShowReplies(!showReplies)}
						style={{opacity: replyCount && replyCount > 0 ? 1 : 0}}
					>
						<p>{t("site.A separate discussion of this response")} ({replyCount})</p>
					</div>
				</div>
				{showReplyInput && (
					<div className={styles.ReplyInput}>
						<Controller
							render={({field}) => {
								return (
									<InputComment
										field={field}
										placeholder={
											t("site.Did you like them Did you connect Add a comment")
										}
										id={"message.textarea"}
										icon={<CommentGrayIcon />}
										onClick={() => console.log(field)}
									/>
								)
							}}
							name={"message"}
							control={control}
							defaultValue={""}
						/>
					</div>
				)}
				{showReplies && (
					<div className={styles.RepliesContainer}>
						{listReplies.map((reply) => (
							<>
								<div key={reply.id}>
									<p className={styles.DateCreate}>
										{t("site.Posted in")} -{" "}
										{format(
											new Date(reply.dateCreate),
											"dd/MM/yyyy"
										)}{" "}
										{t("site.At")}{" "}
										{format(
											new Date(reply.dateCreate),
											"HH:mm"
										)}
									</p>
									<p className={styles.Description}>
										{reply.description}
									</p>
								</div>
								<Divider />
							</>
						))}
					</div>
				)} */}
			</div>
		</>
	)
}

export default CommentBlog
