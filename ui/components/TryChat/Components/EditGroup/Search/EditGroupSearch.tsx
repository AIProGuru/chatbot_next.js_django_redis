import styles from "./EditGroupSearch.module.scss"
import InputText from "@/components/ui/Forms/Inputs/Text/InputText"
import {Controller, useForm} from "react-hook-form"
import {Room} from "@/TryChat/@types/Conversations/Conversation"

interface EditGroupSearchProps {
	room: Room | undefined
}

type FormData = {
	group_name: string
}

function EditGroupSearch(props: EditGroupSearchProps) {
	const {room} = props
	const {handleSubmit, control} = useForm<FormData>()

	return (
		<div className={styles.EditGroupSearch}>
			<Controller
				render={({field}) => {
					return (
						<InputText
							field={field}
							placeholder={"Group name"}
							disabled={true}
						/>
					)
				}}
				name={"group_name"}
				control={control}
				defaultValue={room ? room.name : ""}
			/>
		</div>
	)
}

export default EditGroupSearch
