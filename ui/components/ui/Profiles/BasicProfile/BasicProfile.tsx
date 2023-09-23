import styles from "./BasicProfile.module.scss"
import React from "react"
import {cc} from "@/components/ui/Functions/Classnames"
import NetworkStatusIcon from "@/components/ui/Icons/NetworkStatusIcon"
import VerifiedIcon from "@/components/ui/Icons/VerifiedIcon"
// import NavigationIcon from "@/components/ui/Icons/NavigationIcon"
import MaleIcon from "@/components/ui/Icons/MaleIcon"
import FemaleIcon from "@/components/ui/Icons/FemaleIcon"
import {useTranslation} from "next-i18next"
import NavigationIcon from "@/components/ui/Icons/NavigationIcon"
import { getDirection } from "../../Functions/GetDirection"
import { useRouter } from "next/router"

interface BasicProfileProps {
	profile?: {
		nickname?: string
		status?: string
		languages?: string[]
		residence?: string
		profileType?: string
	}
	age?: {
		man?: number
		woman?: number
	}
	location?: {
		title?: string
		distance?: number
	}
	networkStatus?: boolean
	verifiedStatus?: boolean
}

function BasicProfile(props: BasicProfileProps) {
	const {t} = useTranslation("site")
	const router = useRouter()
	const dir = getDirection(router)
	const {profile, age, location, networkStatus, verifiedStatus} = props

	return (
		<div className={cc([styles.BasicProfile])} style={{direction: dir === "ltr" ? "ltr" : "rtl"}}>
			<div className={styles.Info}>
				<div className={styles.BigText}>
					{/*{t("site.Hot couple")} <FemaleIcon /> 39 <MaleIcon /> 48{" "}*/}
					{profile && profile.nickname}{" "}
					{profile?.profileType &&
						["COUPLE", "WOMAN"].includes(profile.profileType) && (
							<>
								<FemaleIcon /> {age?.woman || ""}
							</>
						)}{" "}
					{profile?.profileType &&
						["COUPLE", "MAN"].includes(profile.profileType) && (
							<>
								<MaleIcon /> {age?.man || ""}
							</>
						)}
				</div>
				{location && location.title && <p>{location.title}</p>}
				{profile && profile.residence && (
					<p>
						<strong>{t("site.Residence near")}:</strong>{" "}
						{profile.residence}
					</p>
				)}
				{profile && profile.status && (
					<p>
						<strong>{t("site.status")}:</strong> {profile.status}
					</p>
				)}
				{profile && profile.languages && profile.languages?.length > 0 && (
					<p>
						<strong>{t("site.Languages")}:</strong>{" "}
						{profile.languages.join(", ")}
					</p>
				)}
			</div>
			<div className={styles.Status}>
				<div className={styles.Marks}>
					<div
						className={cc([
							styles.Online,
							networkStatus !== undefined &&
								styles["Network-" + networkStatus.toString()],
						])}
					>
						<p>
							{networkStatus
								? t("site.Online")
								: t("site.Offline")}
						</p>
						<div className={styles.Icon}>
							<NetworkStatusIcon
								status={networkStatus ? networkStatus : false}
							/>
						</div>
					</div>
					{verifiedStatus && (
						<div className={styles.Verified}>
							<p>{t("site.Profile verifies")}</p>
							<div className={styles.Icon}>
								<VerifiedIcon />
							</div>
						</div>
					)}
				</div>
				{/*{location && location.distance && (*/}
				{/*	<div className={styles.Location}>*/}
				{/*		<p>*/}
				{/*			{location.distance} {t("site.M from you")}*/}
				{/*		</p>*/}
				{/*		<div className={styles.Icon}>*/}
				{/*			<NavigationIcon />*/}
				{/*		</div>*/}
				{/*	</div>*/}
				{/*)}*/}
			</div>
		</div>
	)
}

export default BasicProfile
