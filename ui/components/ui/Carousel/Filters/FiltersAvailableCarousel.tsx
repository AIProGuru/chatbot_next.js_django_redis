import styles from "./FiltersAvailableCarousel.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import FiltersButton from "@/components/ui/Carousel/Filters/FiltersButton"
import React, {useEffect, useMemo, useState} from "react"
import {TFunction, useTranslation} from "next-i18next"
import {connect} from "react-redux"
import {
	BodyStructuresResponse,
	Settlement,
	SexualOrientationsResponse,
	useLazyGetBodyStructuresQuery,
	useLazyGetSettlementsQuery,
	useLazyGetSexualOrientationsQuery,
} from "@/services/static.service"
import {clearObject} from "@/app/utils"
import {updateAvailableFilter} from "@/redux/slices/FiltersAvailableTodaySlice"
import {getTitleList} from "pages/available-today"
import {userProfileActions} from "@/redux/actions/userProfileActions"

interface FiltersCarouselProps {
	filters: any
	updateAvailableFilter?: Function
	hosted: {
		data: THosted[]
	}
	getHosted: Function
}

type THosted = {
	id: number
	title: string
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
		},
	}
}

function FiltersAvailableCarousel(props: FiltersCarouselProps) {
	const {
		filters,
		// areaData,
		// bodyStructures,
		// sexualOrientations,
		updateAvailableFilter,
		hosted,
		getHosted,
	} = props
	const router = useRouter()
	const dir = getDirection(router)
	const {t} = useTranslation("site")
	const componentTranslations: ComponentTranslationsType = useMemo(() => {
		return getComponentTranslations(t)
	}, [t])

	const titles = getTitleList(t) || []

	// state
	const [filterCount, setFilterCount] = useState<number>(0)
	const [settlements, setSettlements] = useState<Settlement[] | undefined>(
		undefined
	)

	useEffect(() => {
		getHosted()
	}, [])

	const [triggerSettlements, getSettlements] = useLazyGetSettlementsQuery()

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
					case "title":
					case "hosted":
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
			triggerSettlements({})
		}
	}, [filterCount])

	useEffect(() => {
		if (getSettlements && getSettlements.isSuccess) {
			setSettlements(getSettlements.data.results)
		}
	}, [getSettlements])

	function processFilter(key: string) {
		if (!filters || !settlements) return

		switch (key) {
			case "nickname":
				const nicknameObjects: FilterObjectType[] = []

				if (filters[key] && filters[key].toString().length > 0) {
					nicknameObjects.push({
						title: filters[key],
						callback: () => {
							updateAvailableFilter &&
								updateAvailableFilter({
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
								updateAvailableFilter &&
									updateAvailableFilter({
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
							updateAvailableFilter &&
								updateAvailableFilter({
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
							updateAvailableFilter &&
								updateAvailableFilter({
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

			case "title":
				// ids
				const titleIDs: string[] = filters[key]
					? filters[key].split(",")
					: []

				// location components
				const titleObjects: FilterObjectType[] = []

				console.log("title1", titleIDs)
				console.log("title2", titleObjects)

				// titles
				titleIDs.forEach((id) => {
					// if (!titles) return
					titleObjects.push({
						title: titles.find((item: any) => {
							return id === item.id
						})!.title,
						callback: () => {
							updateAvailableFilter &&
								updateAvailableFilter({
									filter: key,
									value: titleIDs
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

				return titleObjects
			case "hosted":
				// ids
				console.log()
				const hostedIDs: string[] = filters[key]
					? filters[key].split(",")
					: []

				// location components
				const hostedObjects: FilterObjectType[] = []

				console.log("title1", hostedIDs)
				console.log("title2", hostedObjects)

				// titles
				hostedIDs.forEach((id) => {
					if (!hosted?.data) return
					console.log(hosted?.data, id)
					hostedObjects.push({
						title: hosted!.data!.find((item: THosted) => {
							// console.log(id === item.id)
							return parseInt(id) === item.id
						})!.title,
						callback: () => {
							updateAvailableFilter &&
								updateAvailableFilter({
									filter: key,
									value: hostedIDs
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

				return hostedObjects
		}
	}

	if (!settlements) return null

	return (
		<>
			<div
				className={cc([
					styles.FiltersAvailableCarousel,
					dir && styles[dir],
				])}
			>
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

// export default FiltersAvailableCarousel

const mapStateToProps = (state: any) => ({
	hosted: state.hosted,
})

const mapDispatchToProps = {
	updateAvailableFilter: updateAvailableFilter,
	getHosted: userProfileActions.getHosted,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FiltersAvailableCarousel)
