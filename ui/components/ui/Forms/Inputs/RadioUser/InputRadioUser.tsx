import styles from "./InputRadioUser.module.scss"
import React, {useCallback} from "react"
import {cc} from "@/components/ui/Functions/Classnames"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import VerifiedIcon from "@/components/ui/Icons/VerifiedIcon"
import FemaleIcon from "@/components/ui/Icons/FemaleIcon"
import MaleIcon from "@/components/ui/Icons/MaleIcon"
import {accountTypes} from "@/app/constants"
import {useTranslation} from "next-i18next"
import {FavoriteProfileItem} from "@/services/users.service"

interface InputRadioProps {
	field?: any
	value: string
	id?: string
	users: FavoriteProfileItem
	images?: any[]
}

function InputRadioUser(props: InputRadioProps) {
	const {t} = useTranslation("site")
	const {field, value, id, images} = props
	const {
		id: userProfileID,
		verified,
		man,
		woman,
		couple_nickname,
		profile_type,
	} = props.users

	const router = useRouter()
	const dir = getDirection(router)

	const active = useCallback(() => {
		if (!field) return false
		return field.value
	}, [field])

	const genderStyles = dir === "ltr" ? styles.genderLtr : styles.genderRtl

	const renderPairAge = (maleAge: number, femaleAge: number) => (
		<>
			<div>
				<p className={genderStyles}>{t("site.Couple")}</p>
			</div>
			<div>
				<p>{maleAge}</p>
				<MaleIcon />
			</div>
			<div>
				<p>{femaleAge}</p>
				<FemaleIcon />
			</div>
		</>
	)

	const renderAge = (age: number, gender: string) => (
		<div>
			<p className={genderStyles}>
				{gender === "man" ? t("site.Man") : t("site.Girl")}
			</p>
			<p>{age}</p>
		</div>
	)

	const getNickName = () => {
		switch (profile_type) {
			case "MAN":
				return man?.nickname
			case "WOMAN":
				return woman?.nickname
			case "COUPLE":
				return couple_nickname
		}
	}

	const avatar = images?.find((item: any) => item.profile_id == userProfileID)

	// function getProfileImage(): string {
	// 	if (profile_images) {
	// 		const images: any[] = Array.from(profile_images)
	//
	// 		if (images && images.length > 0) {
	// 			const search: any = images.find((s: any) => s.is_main === true)
	// 			if (search) {
	// 				return search.src
	// 			} else {
	// 				return images[0].src
	// 			}
	// 		} else {
	// 			return ""
	// 		}
	// 	} else {
	// 		return ""
	// 	}
	// }

	return (
		<div className={cc([styles.InputRadioUser])} {...(id && {id: id})}>
			<div className={styles.Switch}>
				<div className={styles.LeftSide}>
					<div className={styles.Input}>
						<input
							{...(field && {...field})}
							type="checkbox"
							id={value}
							{...(active() ? {checked: true} : {checked: false})}
						/>
					</div>

					<div className={styles.GreyAvatar}>
						<img
							src={
								// "#"
								avatar
									? avatar.s3_url
									: // : "/profiles/static150.png"
									profile_type
									? `/profiles/avatar_${profile_type.toLowerCase()}_64.png`
									: "/profiles/avatar_couple_64.png"
							}
							alt=""
						/>
					</div>
					<div className={styles.ContentContainer}>
						<div className={styles.NameContainer}>
							<p>
								{getNickName()}
								{/*({userProfileID})*/}
							</p>
							{verified && <VerifiedIcon />}
						</div>
						<div className={styles.AgeContainer}>
							{accountTypes.isCouple(profile_type) &&
								renderPairAge(man?.age, woman?.age)}
							{accountTypes.isMan(profile_type) &&
								renderAge(man?.age, "man")}
							{accountTypes.isWoman(profile_type) &&
								renderAge(woman?.age, "woman")}
						</div>
					</div>
				</div>
			</div>
			<label htmlFor={value} />
		</div>
	)
}

export default InputRadioUser
