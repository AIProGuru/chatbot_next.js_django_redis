import styles from "./FiltersCarousel.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import FiltersButton from "@/components/ui/Carousel/Filters/FiltersButton"
import React, {useEffect, useMemo, useState} from "react"
import {TFunction, useTranslation} from "next-i18next"
import {updateFilter} from "@/redux/slices/FiltersSlice"
import {connect} from "react-redux"
import {
	BodyStructuresResponse,
	SmokingTypesResponse,
	Settlement,
	SexualOrientationsResponse,
	useLazyGetSmokingTypesQuery,
	useLazyGetBodyStructuresQuery,
	useLazyGetSettlementsQuery,
	useLazyGetSexualOrientationsQuery,
} from "@/services/static.service"
import {clearObject} from "@/app/utils"

interface FiltersCarouselProps {
	filters: any
	updateFilter?: Function
}

type FilterObjectType = {
	title: string
	callback: Function
	key: string
	value: any
	profile_type?: string[]
}

type ComponentTranslationsType = {
	[x: string]: any
}

const getComponentTranslations = (t: TFunction) => {
	return {
		filters: {
			is_near_me: t("site.Near me f"),
			is_online: t("site.Online f"),
			verified: t("site.Verified f"),
			profile_type: {
				man: t("site.Man"),
				woman: t("site.Woman"),
				couple: t("site.We are a couple"),
			},
			man_height: t("site.man_height"),
			man_age: t("site.man_age"),
			woman_height: t("site.woman_height"),
			woman_age: t("site.woman age"),
		},
	}
}

function FiltersCarousel(props: FiltersCarouselProps) {
	const {
		filters,
		// areaData,
		// bodyStructures,
		// sexualOrientations,
		updateFilter,
	} = props
	const router = useRouter()
	const dir = getDirection(router)
	const {t} = useTranslation("site")
	const componentTranslations: ComponentTranslationsType = useMemo(() => {
		return getComponentTranslations(t)
	}, [t])

	// state
	const [filterCount, setFilterCount] = useState<number>(0)
	const [bodyStructures, setBodyStructures] = useState<
		BodyStructuresResponse | undefined
	>(undefined)
	const [settlements, setSettlements] = useState<Settlement[] | undefined>(
		undefined
	)
	const [sexOrient, setSexOrient] = useState<
		SexualOrientationsResponse | undefined
	>(undefined)

	// rtk
	const [triggerBodyStructures, getBodyStructures] =
		useLazyGetBodyStructuresQuery()
	const [triggerSmokingTypes, getSmokingTypes] = useLazyGetSmokingTypesQuery()
	const [triggerSettlements, getSettlements] = useLazyGetSettlementsQuery()
	const [triggerSexOrient, getSexualOrientations] =
		useLazyGetSexualOrientationsQuery()
	const [smokingTypes, setSmokingTypes] = useState<
		SmokingTypesResponse | undefined
	>(undefined)
	useEffect(() => {
		if (filters) {
			let count = 0

			const copy = clearObject(Object.assign({}, filters))
			Object.keys(copy).forEach((key) => {
				switch (key) {
					case "is_online":
						copy[key] && count++
						break

					case "is_near_me":
						copy[key] && count++
						break

					case "verified":
						copy[key] && count++
						break

					case "lock":
						break

					case "nickname":
						copy[key] && copy[key].toString().length > 0 && count++
						break

					case "profile_type":
					case "location":
					case "man_body_type":
					case "woman_body_type":
					case "man_sexual_orientation":
					case "woman_sexual_orientation":
					case "man_smoking_habits":
					case "woman_smoking_habits":
						const items = copy[key]
							? copy[key].toString().split(",")
							: []
						count += items.length
						break

					default:
						count++
						break
				}
			})

			setFilterCount(count)
		}
	}, [filters])

	// effects
	useEffect(() => {
		if (filterCount > 0) {
			triggerBodyStructures({})
			triggerSettlements({})
			triggerSexOrient({})
			triggerSmokingTypes({})
		}
	}, [filterCount])

	useEffect(() => {
		if (getBodyStructures && getBodyStructures.isSuccess) {
			setBodyStructures(getBodyStructures.data)
		}
	}, [getBodyStructures])

	useEffect(() => {
		if (getSmokingTypes && getSmokingTypes.isSuccess) {
			setSmokingTypes(getSmokingTypes.data)
		}
	}, [getSmokingTypes])

	useEffect(() => {
		if (getSettlements && getSettlements.isSuccess) {
			setSettlements(getSettlements.data.results)
		}
	}, [getSettlements])

	useEffect(() => {
		if (getSexualOrientations && getSexualOrientations.isSuccess) {
			setSexOrient(getSexualOrientations.data)
		}
	}, [getSexualOrientations])

	function processFilter(key: string) {
		if (!filters || !settlements || !bodyStructures || !sexOrient) return

		switch (key) {
			case "nickname":
				const nicknameObjects: FilterObjectType[] = []

				if (filters[key] && filters[key].toString().length > 0) {
					nicknameObjects.push({
						title: filters[key],
						callback: () => {
							updateFilter &&
								updateFilter({
									filter: key,
									value: null,
								})
						},
						key: key,
						value: filters[key],
					})
				}

				return nicknameObjects

			case "location":
				// ids
				const locationIDs: string[] = filters[key]
					? filters[key].toString().split(",")
					: []

				// location components
				const locationObjects: FilterObjectType[] = []

				// titles
				locationIDs.forEach((id) => {
					const locationTitle = settlements.find(
						(s: any) => s.id.toString() === id.toString()
					)

					if (locationTitle) {
						locationObjects.push({
							title: locationTitle.title,
							callback: () => {
								updateFilter &&
									updateFilter({
										filter: key,
										value: locationIDs
											.filter((val, i, arr) => {
												return val !== id
											})
											.join(","),
									})
							},
							key: key,
							value: id,
						})
					}
				})

				return locationObjects

			case "is_near_me":
			case "is_online":
			case "verified":
				const switchObjects: FilterObjectType[] = []

				if (filters[key]) {
					switchObjects.push({
						title: componentTranslations.filters[key],
						callback: () => {
							updateFilter &&
								updateFilter({
									filter: key,
									value: false,
								})
						},
						key: key,
						value: filters[key],
					})
				}

				return switchObjects

			case "profile_type":
				// ids
				const profileTypeIDs: string[] = filters[key]
					? filters[key].split(",")
					: []

				// location components
				const profileTypeObjects: FilterObjectType[] = []

				// titles
				profileTypeIDs.forEach((id) => {
					profileTypeObjects.push({
						title: componentTranslations.filters.profile_type[
							id.toString().toLowerCase()
						],
						callback: () => {
							updateFilter &&
								updateFilter({
									filter: key,
									value: profileTypeIDs
										.filter((val, i, arr) => {
											return val !== id
										})
										.join(","),
								})
						},
						key: key,
						value: id,
					})
				})

				return profileTypeObjects

			case "man_age":
			case "woman_age":
			case "man_height":
			case "woman_height":
				// values
				const rangeValues: string[] = filters[key]
					? filters[key].split(",")
					: []

				// components
				const valuesObjects: FilterObjectType[] = []

				// titles
				if (rangeValues.length > 0) {
					valuesObjects.push({
						title: `${
							componentTranslations.filters[key]
						} (${rangeValues.join("-")})`,
						callback: () => {
							updateFilter &&
								updateFilter({
									filter: key,
									value: null,
								})
						},
						key: key,
						value: filters[key],
					})
				}

				return valuesObjects

			case "man_body_type":
			case "woman_body_type":
			case "man_sexual_orientation":
			case "woman_sexual_orientation":
			case "man_smoking_habits":
			case "woman_smoking_habits":
				// values
				const checkboxValues: string[] = filters[key]
					? filters[key].split(",")
					: []

				const profileTypes: string[] = filters.profile_type
					? filters.profile_type.split(",")
					: []

				// components
				const checkboxValuesObjects: FilterObjectType[] = []

				// titles
				checkboxValues.forEach((id) => {
					let data: any

					switch (key) {
						case "man_body_type":
						case "woman_body_type":
							data = bodyStructures
							break

						case "man_sexual_orientation":
						case "woman_sexual_orientation":
							data = sexOrient
							break

						case "man_smoking_habits":
						case "woman_smoking_habits":
							data = smokingTypes
							break
					}
					if (data){
						const checkboxTitle = data.find(
							(s: any) => s.id.toString() === id.toString()
						)
						checkboxValuesObjects.push({
							title: checkboxTitle.title,
							callback: () => {
								updateFilter &&
									updateFilter({
										filter: key,
										value: checkboxValues
											.filter((val, i, arr) => {
												return val !== id
											})
											.join(","),
									})
							},
							key: key,
							value: id,
							profile_type: profileTypes,
						})
					}
				})

				return checkboxValuesObjects
		}
	}

	if (!settlements || !bodyStructures || !sexOrient) return null

	return (
		<>
			<div className={cc([styles.FiltersCarousel, dir && styles[dir]])}>
				{filters &&
					Object.keys(filters).map((key) => {
						const processedFilter = processFilter(key) || []
						return processedFilter.map((el: any, index: number) => {
							return (
								<FiltersButton
									key={`${el.key}-${index}`}
									el_key={el.key}
									title={el.title}
									callback={el.callback}
									{...(el.profile_type && {
										profileType: el.profile_type,
									})}
								/>
							)
						})
					})}
			</div>
		</>
	)
}

// export default FiltersCarousel

const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = {
	updateFilter: updateFilter,
}

export default connect(mapStateToProps, mapDispatchToProps)(FiltersCarousel)
