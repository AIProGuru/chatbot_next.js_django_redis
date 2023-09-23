import styles from "./EditGroupMembers.module.scss"
import React from "react"
import {UserProfile} from "@/services/users.service"
import {ProfileAvatar} from "@/services/images.service"
import MemberItem from "@/components/TryChat/Components/EditGroup/Members/Item/MemberItem"
import {useTranslation} from "next-i18next"

interface EditGroupMembersProps {
	profiles: UserProfile[]
	avatars: ProfileAvatar[]
	isGroupAdmin: () => boolean | undefined
	emitDeleteMemberFromGroup: (profileID: string) => void
	myID: string | undefined
}

function EditGroupMembers(props: EditGroupMembersProps) {
	const {profiles, avatars, isGroupAdmin, emitDeleteMemberFromGroup, myID} =
		props
	const {t} = useTranslation("site")

	return (
		<div className={styles.EditGroupMembers}>
			<div className={styles.Heading}>Group members</div>
			<div className={styles.List}>
				{profiles.map((profile) => {
					return (
						<MemberItem
							key={profile.id}
							profile={profile}
							avatars={avatars}
							actions={isGroupAdmin()}
							emitDeleteMemberFromGroup={
								emitDeleteMemberFromGroup
							}
							myID={myID}
						/>
					)
				})}
			</div>
		</div>
	)
}

export default EditGroupMembers
