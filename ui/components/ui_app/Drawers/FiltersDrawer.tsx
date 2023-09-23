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
	getSelectedStringIds,
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
	SmokingTypesResponse,
	useLazyGetBodyStructuresQuery,
	useLazyGetSmokingTypesQuery,
	useLazyGetSettlementsQuery,
	useLazyGetSexualOrientationsQuery,
} from "@/services/static.service"
import InputRadioHorizontalDefault from "@/components/ui/Forms/Inputs/RadioHorizontal/InputRadioHorizontalDefault"

interface FiltersDrawer {
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
	getSmokingTypes?: Function
	getArea?: Function
	filtersState?: any
	reloadFiltersFromLS?: Function
}

interface FormPartProps {
	data: any[]
	name: string
	control: any
	defaultValue: any
	drawerTrigger?: Function
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
				smoking: t("site.isSmoking"),
			},
			sorting: {
				title: t("site.Additional filtering options"),
			},
		},
	}
}

function FormPart(props: FormPartProps) {
	const {data, name, control, defaultValue, drawerTrigger} = props

	return (
		<Controller
			render={({field}) => (
				<>
					{data &&
						data.map((item: any) => {
							return (
								<InputRadioHorizontalDefault
									key={item.id}
									id={"input_radio_" + name + "_" + item.id}
									field={field}
									value={item.sort_by}
									title={item.title}
									drawerTrigger={() => {
										drawerTrigger && drawerTrigger()
									}}
								/>
							)
						})}
				</>
			)}
			name={name}
			control={control}
			defaultValue={defaultValue}
		/>
	)
}

function FiltersDrawer(props: FiltersDrawer) {
	// props
	const {
		show,
		toggleFunction,
		filterCount,
		setFilterCount,
		updateFilter,
		lockFilters,
		resetFilter,
		filtersState,
		reloadFiltersFromLS,
	} = props
	const {handleSubmit, setValue, control} = useForm()
	const {t} = useTranslation("site")
	const router = useRouter()
	const pageTranslations = useMemo(() => {
		return getPageTranslations(t)
	}, [t])

	const onSubmit = () => {}

	// static state
	const [bodyStructures, setBodyStructures] = useState<
		BodyStructuresResponse | undefined
	>(undefined)
	const [smokingTypes, setSmokingTypes] = useState<
		SmokingTypesResponse | undefined
	>(undefined)
	const [settlements, setSettlements] = useState<Settlement[] | undefined>(
		undefined
	)
	const [sexOrient, setSexOrient] = useState<
		SexualOrientationsResponse | undefined
	>(undefined)
	const [showSortingDrawer, setShowSortingDrawer] = useState(false)

	// rtk
	const [triggerBodyStructures, getBodyStructures] =
		useLazyGetBodyStructuresQuery()
	const [triggerSmokingTypes, getSmokingTypes] = useLazyGetSmokingTypesQuery()
	const [triggerSettlements, getSettlements] = useLazyGetSettlementsQuery()
	const [triggerSexOrient, getSexualOrientations] =
		useLazyGetSexualOrientationsQuery()

	// effects
	useEffect(() => {
		if (show) {
			triggerBodyStructures({})
			triggerSmokingTypes({})
			triggerSettlements({})
			triggerSexOrient({})
		}
	}, [show])

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

	const [isDataReady, setDataReady] = useState(false)

	const additional_data = [
		{
			id: "sexual_orientation",
			title: pageTranslations.drawer.additional_filters
				.sexual_orientation,
			data: sexOrient,
		},
		{
			id: "body_type",
			title: pageTranslations.drawer.additional_filters.body_type,
			data: bodyStructures,
		},
		{
			id: "smoking",
			title: pageTranslations.drawer.additional_filters.smoking,
			data: smokingTypes,
		},
	]
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
		if (!filtersState) return false
		return filtersState[key]
	}

	function getRangeParam(key: string, pos: "from" | "to") {
		if (!filtersState) return false
		const p: string[] =
			(filtersState[key] && filtersState[key].split(",")) || []

		if (pos === "from") {
			return p[0] || ""
		} else {
			return p[1] || ""
		}
	}

	function getCheckboxParam(key: string, id: number) {
		if (!filtersState) return false

		const filterData = filtersState[key]
		if (!filterData) return false

		const ids: string[] = filterData.toString().split(",") || []
		return ids.includes(id.toString())
	}

	// react hook form watch
	const filters = useWatch({
		control,
		name: "filter",
	})

	const profileType: string[] =
		(filters &&
			filters.profile_type &&
			getSelectedStringIds(filters.profile_type)) ||
		[]

	useEffect(() => {
		if (filtersState) {
			let count = 0

			const copy = clearObject(Object.assign({}, filtersState))
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
	}, [filtersState])

	const checkProfileType = useCallback(
		(type: string) => {
			const filtersTypes: string[] =
				(filtersState.profile_type &&
					filtersState.profile_type.split(",")) ||
				[]

			if (type === "MAN") {
				return (
					profileType.includes("MAN") ||
					profileType.includes("COUPLE") ||
					filtersTypes.includes("MAN") ||
					filtersTypes.includes("COUPLE")
				)
			}

			if (type === "WOMAN") {
				return (
					profileType.includes("WOMAN") ||
					profileType.includes("COUPLE") ||
					filtersTypes.includes("WOMAN") ||
					filtersTypes.includes("COUPLE")
				)
			}
		},
		[filtersState, profileType]
	)

	// update filters
	useEffect(() => {
		const debounceFilters = setTimeout(() => {
			if (filters && updateFilter) {
				// resetFilter && resetFilter()

				Object.keys(filters).map((key: string) => {
					switch (key) {
						case "age":
							let man_age = [null, null]
							let woman_age = [null, null]

							man_age = filters.age.man

							woman_age = filters.age.woman

							checkProfileType("MAN") &&
								man_age.filter((e) => e).length > 0 &&
								updateFilter({
									filter: "man_age",
									value: man_age.filter((e) => e).join(","),
								})

							checkProfileType("WOMAN") &&
								woman_age.filter((e) => e).length > 0 &&
								updateFilter({
									filter: "woman_age",
									value: woman_age.filter((e) => e).join(","),
								})
							return

						case "height":
							let man_height = [null, null]
							let woman_height = [null, null]

							man_height = filters.height.man

							woman_height = filters.height.woman

							checkProfileType("MAN") &&
								man_height.filter((e) => e).length > 0 &&
								updateFilter({
									filter: "man_height",
									value: man_height
										.filter((e) => e)
										.join(","),
								})

							checkProfileType("WOMAN") &&
								woman_height.filter((e) => e).length > 0 &&
								updateFilter({
									filter: "woman_height",
									value: woman_height
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

						case "sexual_orientation":
							const so_man_ids = filters.sexual_orientation.man
								? getSelectedIds(filters.sexual_orientation.man)
								: []
							const so_woman_ids = filters.sexual_orientation
								.woman
								? getSelectedIds(
										filters.sexual_orientation.woman
								  )
								: []

							checkProfileType("MAN") &&
								updateFilter({
									filter: "man_sexual_orientation",
									value: so_man_ids
										.filter((e) => e)
										.join(","),
								})

							checkProfileType("WOMAN") &&
								updateFilter({
									filter: "woman_sexual_orientation",
									value: so_woman_ids
										.filter((e) => e)
										.join(","),
								})
							return

						case "smoking":
							const smokingManIds = filters.smoking.man
								? getSelectedIds(filters.smoking.man)
								: []
							const smokingWomanIds = filters.smoking.woman
								? getSelectedIds(filters.smoking.woman)
								: []

							checkProfileType("MAN") &&
								updateFilter({
									filter: "man_smoking_habits",
									value: smokingManIds
										.filter((e) => e)
										.join(","),
								})

							checkProfileType("WOMAN") &&
								updateFilter({
									filter: "woman_smoking_habits",
									value: smokingWomanIds
										.filter((e) => e)
										.join(","),
								})
							return

						case "body_type":
							const bt_man_ids = filters.body_type.man
								? getSelectedIds(filters.body_type.man)
								: []
							const bt_woman_ids = filters.body_type.woman
								? getSelectedIds(filters.body_type.woman)
								: []

							checkProfileType("MAN") &&
								updateFilter({
									filter: "man_body_type",
									value: bt_man_ids
										.filter((e) => e)
										.join(","),
								})

							checkProfileType("WOMAN") &&
								updateFilter({
									filter: "woman_body_type",
									value: bt_woman_ids
										.filter((e) => e)
										.join(","),
								})
							return

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
			nickname: undefined,
			is_near_me: false,
			is_online: false,
			verified: false,
			location: null,
			profile_type: null,
			man_age: null,
			woman_age: null,
			man_height: null,
			woman_height: null,
			man_body_type: null,
			woman_body_type: null,
			man_sexual_orientation: null,
			woman_sexual_orientation: null,
			man_smoking_habits: null,
			woman_smoking_habits: null,
			sort_by: null,
		})

		resetFilter && resetFilter()
		lockFilters && lockFilters({state: false})

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

	const [drawerTrigger, setDrawerTrigger] = useState(false)

	function drawerTriggerAction() {
		setDrawerTrigger(true)
		setTimeout(() => {
			setDrawerTrigger(false)
		}, 100)
	}

	const sortOptions = [
		{
			id: 0,
			title: t("site.Distance"),
			sort_by: "distance",
		},
		{
			id: 1,
			title: t("site.last online"),
			sort_by: "last_online",
		},
		{
			id: 2,
			title: t("site.new users"),
			sort_by: "user__date_joined",
		},
	]
	return (
		<Drawer
			show={show}
			setShow={() => {
				toggleFunction(false)
			}}
			position={"left"}
			trigger={closeTrigger}
		>
			<div className={"ChatScreen"}>
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
									defaultValue={undefined}
								/>
							</div>
							<div>
								<Divider />
								<div className="ProfileDetails">
									<AccordionGroup>
										<AccordionItem
											variant={"sort_by"}
											title={t("site.sort by")}
											select={
												sortOptions.find((sort) => {
													return (
														sort.sort_by ===
														getSwitchParam(
															"sort_by"
														)
													)
												})?.title || ""
											}
											mode={"drawer"}
											callback={() => {
												setShowSortingDrawer(true)
											}}
										/>
									</AccordionGroup>
								</div>
								<Drawer
									show={showSortingDrawer}
									setShow={setShowSortingDrawer}
									title={t("site.sort by")}
									position={"bottom"}
									trigger={drawerTrigger}
								>
									<div className="DrawerContainer">
										<FormPart
											data={sortOptions}
											name={"filter.sort_by"}
											control={control}
											defaultValue={
												getSwitchParam("sort_by") ||
												"last_online"
											}
											drawerTrigger={drawerTriggerAction}
										/>
									</div>
								</Drawer>
							</div>
							<Divider />

							<FiltersArea
								areaData={settlements}
								control={control}
								getCheckboxParam={getCheckboxParam}
								sectionTitle={
									pageTranslations.drawer.filters.area
								}
							/>
							<Divider />

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
									defaultValue={getSwitchParam("is_near_me")}
								/>
							</div>
							<Divider />

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
									defaultValue={getSwitchParam("is_online")}
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
									defaultValue={getSwitchParam("verified")}
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

							{/* man, woman or couple additional filters */}
							{(checkProfileType("MAN") ||
								checkProfileType("WOMAN")) && (
								<>
									<div className="Additional">
										<AccordionGroup>
											<AccordionItem
												title={
													pageTranslations.drawer
														.additional_filters
														.title
												}
												variant={"sort_by"}
												openByDefault={true}
											>
												<div className="AccordionContainer">
													<FiltersMan
														checkProfileType={
															checkProfileType
														}
														control={control}
														additional_data={
															additional_data
														}
														getRangeParam={
															getRangeParam
														}
														getCheckboxParam={
															getCheckboxParam
														}
														locale={{
															age: pageTranslations
																.drawer
																.additional_filters
																.man_age,
															height: pageTranslations
																.drawer
																.additional_filters
																.man_height,
														}}
													/>
													<FiltersWoman
														checkProfileType={
															checkProfileType
														}
														control={control}
														additional_data={
															additional_data
														}
														getRangeParam={
															getRangeParam
														}
														getCheckboxParam={
															getCheckboxParam
														}
														locale={{
															age: pageTranslations
																.drawer
																.additional_filters
																.woman_age,
															height: pageTranslations
																.drawer
																.additional_filters
																.woman_height,
														}}
													/>
												</div>
											</AccordionItem>
										</AccordionGroup>
									</div>
								</>
							)}
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

// export default FiltersDrawer

const mapStateToProps = (state: any) => ({
	filtersState: state.FiltersSlice,
})

const mapDispatchToProps = {
	updateFilter: updateFilter,
	lockFilters: lockFilters,
	resetFilter: resetFilter,
	reloadFiltersFromLS: reloadFiltersFromLS,
}

export default connect(mapStateToProps, mapDispatchToProps)(FiltersDrawer)
