import styles from "./CreateGroupActionBar.module.scss"
import React, {useMemo} from "react"
import {TFunction, useTranslation} from "next-i18next"

interface CreateGroupActionBarProps {}

const getPageTranslations = (t: TFunction) => {
	return {}
}

const CreateGroupActionBar = (props: CreateGroupActionBarProps) => {
	const {} = props
	const {t} = useTranslation("site")
	const pageTranslations = useMemo(() => {
		return getPageTranslations(t)
	}, [t])

	return <div className={styles.CreateGroupActionBar}>actions here</div>
}

export default CreateGroupActionBar
