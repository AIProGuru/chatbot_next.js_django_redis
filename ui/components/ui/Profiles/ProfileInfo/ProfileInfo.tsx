import styles from "./ProfileInfo.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import RabbitWithHandsManIcon from "@/components/ui/Icons/RabbitWithHandsManIcon"
import RabbitWithHandsWomanIcon from "@/components/ui/Icons/RabbitWithHandsWomanIcon"
import {useTranslation} from "next-i18next"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"

interface ProfileInfoProps {
	profiles?: Profile[]
}

type Profile = {
	// profileType: "MAN" | "WOMAN"
	nickname?: string
	birthday?: string
	profileType: string
	age?: number
	height?: number
	bodyType?: string
	chestSize?: string
	sexualOrientation?: string
	impressive?: string
	skinTone?: string
	breastSize?: string
	bodyHair?: string
	smoking?: string
}

function ProfileInfo(props: ProfileInfoProps) {
	const {t} = useTranslation("site")
	const router = useRouter()
	const dir = getDirection(router)

	const {profiles} = props

	return (
		<div className={cc([styles.ProfileInfo, dir && styles[dir]])}>
			{profiles &&
				profiles.map((profile: Profile, index: number) => {
					const isMan = profile.profileType === "MAN"
					const isWoman = profile.profileType === "WOMAN"
					return (
						<div key={index} className={cc([styles.Section])}>
							<div className={cc([styles.Icon])}>
								{isMan && <RabbitWithHandsManIcon />}

								{isWoman && <RabbitWithHandsWomanIcon />}
							</div>
							<div className={styles.Profile} style={{textAlign: dir === "rtl" ? "right": "left"}}>
								<p className={styles.Title}>
									{isMan
										? t("site.The man")
										: t("site.The woman")}
								</p>
								<p>
									{/* age */}
									<strong>{t("site.nickname")}:</strong>{" "}
									{profile?.nickname || ""}
								</p>
								<p>
									{/* age */}
									<strong>{t("site.age")}{profile?.age ? ":" :""}</strong>{" "}
									{profile?.age || ""}
								</p>
								<p>
									{/* height */}
									<strong>{t("site.height")}:</strong>{" "}
									{profile?.height
										? `${profile?.height} ${t("site.Cm")}`
										: ""}
								</p>
								<p>
									{/* body type */}
									<strong>
										{t("site.body structure")}:
									</strong>{" "}
									{profile?.bodyType || ""}
								</p>
								{isWoman && (
									<p>
										{/* breast size */}
										<strong>
											{t("site.Breast size")}:
										</strong>{" "}
										{profile?.chestSize || ""}
									</p>
								)}
								{isMan && (
									<p>
										{/* body hair */}
										<strong>
											{t("site.body hair")}:
										</strong>{" "}
										{profile?.bodyHair || ""}
									</p>
								)}
								<p>
									{/* sexual orientation */}
									<strong>
										{t("site.Sexual orientation")}:
									</strong>{" "}
									{profile?.sexualOrientation || ""}
								</p>
								<p>
									{/* skin tone */}
									<strong>{t("site.skin tone")}:</strong>{" "}
									{profile?.skinTone || ""}
								</p>
								<p>
									{/* impressive */}
									<strong>
										{t("site.Whats most impressive")}:
									</strong>{" "}
									{profile?.impressive || ""}
								</p>
								<p>
									{/* impressive */}
									<strong>{t("site.Smoking_p")}:</strong>{" "}
									{profile?.smoking || ""}
								</p>
							</div>
						</div>
					)
				})}
		</div>
	)
}

export default ProfileInfo
