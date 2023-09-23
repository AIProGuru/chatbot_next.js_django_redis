import Button from "@/components/ui/Button/Button/Button"
import Divider from "@/components/ui/Divider/Divider"
import {Controller, useForm, useWatch} from "react-hook-form"
import InputSwitch from "@/components/ui/Forms/Inputs/Switch/InputSwitch"
import Drawer from "@/components/ui/Drawer/Drawer/Drawer"
import React, {useCallback, useEffect, useMemo, useState} from "react"
import {TFunction, useTranslation} from "next-i18next"
import {useRouter} from "next/router"
import {connect} from "react-redux"
import {
	lockFilters,
	reloadFiltersFromLS,
	resetFilter,
	updateFilter,
} from "@/redux/slices/FiltersSlice"
import AccordionGroup from "@/components/ui/Accordion/AccordionGroup"
import AccordionItem from "@/components/ui/Accordion/AccordionItem"
import {
	getSelectedIds,
	getSelectedStringHostedIds,
	getSelectedStringIds,
	getSelectedStringTitlesIds,
} from "@/components/ui/Functions/GetSelectedIDs"
import FiltersMan from "@/components/ui_app/Drawers/FiltersDrawer/FiltersMan"
import FiltersWoman from "@/components/ui_app/Drawers/FiltersDrawer/FiltersWoman"
import FiltersProfileType from "@/components/ui_app/Drawers/FiltersDrawer/FiltersProfileType"
import FiltersArea from "@/components/ui_app/Drawers/FiltersDrawer/FiltersArea"
import {clearObject} from "@/app/utils"
import InputSearch from "@/components/ui/Forms/Inputs/Search/InputSearch"
import {checkKeyDown} from "@/components/ui/Functions/CheckKeyDown"
import {
	BodyStructuresResponse,
	Settlement,
	SexualOrientationsResponse,
	useLazyGetBodyStructuresQuery,
	useLazyGetSettlementsQuery,
	useLazyGetSexualOrientationsQuery,
} from "@/services/static.service"
import {
	updateAvailableFilter,
	lockAvailableFilters,
	resetAvailableFilter,
	reloadAvailableFiltersFromLS,
} from "@/redux/slices/FiltersAvailableTodaySlice"
import {getTitleList} from "pages/available-today"
import {AvailableTitle} from "@/services/available.service"
import InputRadioHorizontalDefault from "@/components/ui/Forms/Inputs/RadioHorizontal/InputRadioHorizontalDefault"
import {userProfileActions} from "@/redux/actions/userProfileActions"
import InputCheckboxHorizontalTransparent from "@/components/ui/Forms/Inputs/CheckboxHorizontalTransparent/InputCheckboxHorizontalTransparent"

interface FiltersAvailableDrawer {
	show: boolean
	toggleFunction: Function
	filterCount: number
	setFilterCount: Function
	updateFilter?: Function
	lockFilters?: Function
	resetFilter?: Function
	bodyStructures?: any
	sexualOrientations?: any
	area?: any
	getBodyStructures?: Function
	getSexualOrientations?: Function
	getArea?: Function
	filtersAvailableState?: any
	hosted: {
		data: THosted[]
	}
	getHosted: Function
	reloadFiltersFromLS?: Function
}

type THosted = {
	id: number
	title: string
}

export type AvailableTitleAssoc = {
	id: AvailableTitle
	title: string
}

const getPageTranslations = (t: TFunction) => {
	return {
		drawer: {
			filters: {
				title: t("site.filters"),
				clear: t("site.clear"),
				is_near_me: t("site.Near me"),
				is_online: t("site.Online"),
				verified: t("site.Verified"),
				area: t("site.area"),
				titleAvailable: t("site.titleAvailable"),
				profile_type: {
					title: t("site.Profile type:"),
					man: t("site.Man"),
					woman: t("site.Woman"),
					couple: t("site.Couple"),
				},
			},
			additional_filters: {
				title: t("site.Additional filtering options"),
				man_age: t("site.Man age f"),
				man_height: t("site.Man height f"),
				woman_age: t("site.Woman age f"),
				woman_height: t("site.Woman height f"),
				sexual_orientation: t("site.Sexual orientation f"),
				body_type: t("site.Body type f"),
			},
		},
	}
}

interface FormPartProps {
	data: any[]
	name: string
	control: any
	defaultValue?: any
	drawerTrigger?: Function
	getCheckboxParam: Function
}

function FiltersAvailableDrawer(props: FiltersAvailableDrawer) {
	// props
	const {
		show,
		toggleFunction,
		filterCount,
		setFilterCount,
		updateFilter,
		lockFilters,
		resetFilter,
		filtersAvailableState,
		hosted,
		getHosted,
		reloadFiltersFromLS,
	} = props
	const {handleSubmit, setValue, control} = useForm()
	const {t} = useTranslation("site")
	const router = useRouter()
	const pageTranslations = useMemo(() => {
		return getPageTranslations(t)
	}, [t])

	const onSubmit = () => {}
	const titles = getTitleList(t)

	// static state
	const [bodyStructures, setBodyStructures] = useState<
		BodyStructuresResponse | undefined
	>(undefined)
	const [settlements, setSettlements] = useState<Settlement[] | undefined>(
		undefined
	)
	const [sexOrient, setSexOrient] = useState<
		SexualOrientationsResponse | undefined
	>(undefined)

	const [triggerSettlements, getSettlements] = useLazyGetSettlementsQuery()

	// effects
	useEffect(() => {
		if (show) {
			triggerSettlements({})
		}
	}, [show])

	useEffect(() => {
		getHosted()
	}, [])

	useEffect(() => {
		if (getSettlements && getSettlements.isSuccess) {
			setSettlements(getSettlements.data.results)
		}
	}, [getSettlements])

	const profileTypes = [
		{
			id: "WOMAN",
			title: pageTranslations.drawer.filters.profile_type.woman,
		},
		{
			id: "MAN",
			title: pageTranslations.drawer.filters.profile_type.man,
		},
		{
			id: "COUPLE",
			title: pageTranslations.drawer.filters.profile_type.couple,
		},
	]

	// state
	const [closeTrigger, setCloseTrigger] = useState(false)

	function getSwitchParam(key: string) {
		if (!filtersAvailableState) return false
		return filtersAvailableState[key]
	}

	function getCheckboxParam(key: string, id: number) {
		if (!filtersAvailableState) return false

		const filterData = filtersAvailableState[key]
		if (!filterData) return false

		const ids: string[] = filterData.toString().split(",") || []
		return ids.includes(id.toString())
	}

	// react hook form watch
	const filters = useWatch({
		control,
		name: "filter",
	})

	useEffect(() => {
		if (filtersAvailableState) {
			let count = 0

			const copy = clearObject(Object.assign({}, filtersAvailableState))
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
	}, [filtersAvailableState])

	// update filters
	useEffect(() => {
		const debounceFilters = setTimeout(() => {
			if (filters && updateFilter) {
				// resetFilter && resetFilter()

				Object.keys(filters).map((key: string) => {
					switch (key) {
						case "profile_type":
							const selectedProfileTypes = filters.profile_type
								? getSelectedStringIds(filters.profile_type)
								: []

							updateFilter({
								filter: "profile_type",
								value: selectedProfileTypes
									.filter((e) => e)
									.join(","),
							})
							return

						case "area":
							const area_ids = filters.area
								? getSelectedIds(filters.area)
								: []
							updateFilter({
								filter: "location",
								value: area_ids.filter((e) => e).join(","),
							})
							return
						case "title":
							const selectedTitles = filters.title
								? getSelectedStringTitlesIds(filters.title)
								: []

							updateFilter({
								filter: "title",
								value: selectedTitles
									.filter((e) => e)
									.join(","),
							})
							return
						case "hosted":
							const selectedHosted = filters.hosted
								? getSelectedStringHostedIds(filters.hosted)
								: []

							updateFilter({
								filter: "hosted",
								value: selectedHosted
									.filter((e) => e)
									.join(","),
							})
							return

						default:
							updateFilter({
								filter: key,
								value: filters[key],
							})
							return
					}
				})
			}
		}, 500)

		return () => {
			clearTimeout(debounceFilters)
		}
	}, [filters])

	const triggerDrawer = () => {
		setCloseTrigger(true)
		setTimeout(() => {
			setCloseTrigger(false)
		}, 250)
	}

	// reset filters
	function resetFiltersForm() {
		setValue("filter", {
			nickname: null,
			is_near_me: false,
			is_online: false,
			verified: false,
			profile_type: null,
			location: null,
			title: null,
			hosted: null,
		})

		resetFilter && resetFilter()
		lockFilters && lockFilters({state: false})

		// setCloseTrigger(true)
		// setTimeout(() => {
		// 	setCloseTrigger(false)
		// }, 250)
		triggerDrawer()
	}

	useEffect(() => {
		if (filters) {
			updateFilter &&
				updateFilter({
					filter: "lock",
					value: false,
				})
		}
	}, [filters, updateFilter])

	return (
		<Drawer
			show={show}
			setShow={() => {
				toggleFunction(false)
			}}
			position={"left"}
			trigger={closeTrigger}
		>
			<div className={"ChatScreen"} dir={"ltr"}>
				<div className="DrawerFilterScreen">
					<div className="Header">
						<div className="Container">
							<div className="Title">
								<p>{pageTranslations.drawer.filters.title}</p>
								<p>({filterCount})</p>
							</div>
							<div className="Action">
								<Button
									type={"button"}
									variant={"outline"}
									color={"white"}
									onClick={resetFiltersForm}
								>
									<p className="ActionButtonText">
										{pageTranslations.drawer.filters.clear}
									</p>
								</Button>
							</div>
						</div>
						<Divider variant={"big"} />
					</div>
					<div className="FilterList">
						<form
							onSubmit={handleSubmit(onSubmit)}
							onKeyDown={(e) => {
								if (checkKeyDown(e, "Enter")) {
									triggerDrawer()
								}
							}}
						>
							<div className="InputSearchByNickname">
								<Controller
									render={({field}) => {
										return (
											<InputSearch
												placeholder={t(
													"site.Search by nickname"
												)}
												field={field}
												type={"text"}
												id={
													"filters_input_search_by_nickname"
												}
											/>
										)
									}}
									name={"filter.nickname"}
									control={control}
									defaultValue={""}
								/>
							</div>

							{/* area filter */}
							<FiltersArea
								areaData={settlements}
								control={control}
								getCheckboxParam={getCheckboxParam}
								sectionTitle={
									pageTranslations.drawer.filters.area
								}
							/>
							<Divider />

							{/* near me filter */}
							<div className="Input">
								<Controller
									render={({field}) => (
										<InputSwitch
											field={field}
											value={"filter.is_near_me"}
											title={
												pageTranslations.drawer.filters
													.is_near_me
											}
											textAlign={"right"}
											id={"filter_is_near_me"}
										/>
									)}
									name={"filter.is_near_me"}
									control={control}
									defaultValue={
										getSwitchParam("is_near_me")
										// filters && filters.is_near_me
										// 	? filters.is_near_me
										// 	: false
									}
								/>
							</div>
							<Divider />

							<div className="Input">
								<Controller
									render={({field}) => (
										<InputSwitch
											field={field}
											value={"filter.verified"}
											title={
												pageTranslations.drawer.filters
													.verified
											}
											textAlign={"right"}
											id={"filter_verified"}
										/>
									)}
									name={"filter.verified"}
									control={control}
									defaultValue={
										getSwitchParam("verified")
										// filters && filters.is_online
										// 	? filters.is_online
										// 	: false
									}
								/>
							</div>
							<Divider />

							{/*/!* hide men filter *!/*/}
							{/*<div className="Input">*/}
							{/*	<Controller*/}
							{/*		render={({field}) => (*/}
							{/*			<InputSwitch*/}
							{/*				field={field}*/}
							{/*				value={"filter.dont_show_men"}*/}
							{/*				title={*/}
							{/*					pageTranslations.drawer.filters*/}
							{/*						.dont_show_men*/}
							{/*				}*/}
							{/*				textAlign={"right"}*/}
							{/*				id={"filter_dont_show_men"}*/}
							{/*			/>*/}
							{/*		)}*/}
							{/*		name={"filter.dont_show_men"}*/}
							{/*		control={control}*/}
							{/*		defaultValue={*/}
							{/*			filters && filters.dont_show_men*/}
							{/*				? filters.dont_show_men*/}
							{/*				: false*/}
							{/*		}*/}
							{/*	/>*/}
							{/*</div>*/}
							{/*<Divider />*/}

							{/* is online filter */}
							<div className="Input">
								<Controller
									render={({field}) => (
										<InputSwitch
											field={field}
											value={"filter.is_online"}
											title={
												pageTranslations.drawer.filters
													.is_online
											}
											textAlign={"right"}
											id={"filter_is_online"}
										/>
									)}
									name={"filter.is_online"}
									control={control}
									defaultValue={
										getSwitchParam("is_online")
										// filters && filters.is_online
										// 	? filters.is_online
										// 	: false
									}
								/>
							</div>
							<Divider />

							{/* profile type filter */}
							<FiltersProfileType
								profileTypes={profileTypes}
								control={control}
								getCheckboxParam={getCheckboxParam}
								type={"profile_type"}
								sectionTitle={
									pageTranslations.drawer.filters.profile_type
										.title
								}
							/>

							<Divider />
							<FiltersProfileType
								profileTypes={titles}
								control={control}
								getCheckboxParam={getCheckboxParam}
								type={"title"}
								sectionTitle={
									pageTranslations.drawer.filters
										.titleAvailable
								}
							/>

							<Divider />
							<div className="ProfileDetails">
								<FiltersProfileType
									profileTypes={hosted?.data}
									control={control}
									getCheckboxParam={getCheckboxParam}
									type={"hosted"}
									sectionTitle={t("site.Hosts or hosted")}
								/>
							</div>
						</form>

						<div className="Action">
							<Button
								type={"button"}
								prevent={true}
								fullWidth={true}
								onClick={() => {
									triggerDrawer()
								}}
							>
								<p className={"ActionButtonText"}>
									{t("site.Apply filters")}
								</p>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</Drawer>
	)
}

const mapStateToProps = (state: any) => ({
	filtersAvailableState: state.FiltersAvailableTodaySlice,
	hosted: state.hosted,
})

const mapDispatchToProps = {
	updateFilter: updateAvailableFilter,
	lockFilters: lockAvailableFilters,
	resetFilter: resetAvailableFilter,
	reloadFiltersFromLS: reloadAvailableFiltersFromLS,
	getHosted: userProfileActions.getHosted,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FiltersAvailableDrawer)
