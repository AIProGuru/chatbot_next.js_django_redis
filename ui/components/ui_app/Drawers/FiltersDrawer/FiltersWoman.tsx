import Divider from "@/components/ui/Divider/Divider"
import {Controller} from "react-hook-form"
// import InputText from "@/components/ui/Forms/Inputs/Text/InputText"
import InputCheckBoxFilter from "@/components/ui/Forms/Inputs/CheckboxFilter/InputCheckBoxFilter"
import React from "react"
import {useTranslation} from "next-i18next"
// import InputSlider from "@/components/ui/Forms/Inputs/Slider/InputSlider"
import dynamic from "next/dynamic"
const DynamicInputSlider = dynamic(
	() => import("@/components/ui/Forms/Inputs/Slider/InputSlider")
)

interface FiltersWomanProps {
	control: any
	additional_data: any
	checkProfileType: Function
	getRangeParam: Function
	getCheckboxParam: Function
	locale: {
		age: string
		height: string
	}
}

function FiltersWoman(props: FiltersWomanProps) {
	const {t} = useTranslation("site")
	const {
		control,
		additional_data,
		checkProfileType,
		getRangeParam,
		getCheckboxParam,
		locale,
	} = props

	return (
		<>
			{checkProfileType("WOMAN") && checkProfileType("MAN") && (
				<Divider variant={"big"} />
			)}

			{checkProfileType("WOMAN") && (
				<>
					<div className="Age" style={{paddingBottom: "20px"}}>
						<div className="Age">
							<div className="FilterAge">
								<p>{locale && locale.age}</p>
							</div>
						</div>
						<Controller
							render={({field}) => {
								return (
									<DynamicInputSlider
										field={field}
										min={18}
										max={80}
									/>
								)
							}}
							name={"filter.age.woman"}
							control={control}
							defaultValue={[
								getRangeParam("woman_age", "from")
									? Number(getRangeParam("woman_age", "from"))
									: 18,
								getRangeParam("woman_age", "to")
									? Number(getRangeParam("woman_age", "to"))
									: 80,
							]}
						/>
					</div>
					<Divider />

					<div className="Age" style={{paddingBottom: "20px"}}>
						<div className="Age">
							<div className="FilterAge">
								<p>{locale && locale.height}</p>
							</div>
						</div>
						<Controller
							render={({field}) => {
								return (
									<DynamicInputSlider
										field={field}
										min={120}
										max={220}
									/>
								)
							}}
							name={"filter.height.woman"}
							control={control}
							defaultValue={[
								getRangeParam("woman_height", "from")
									? Number(
											getRangeParam(
												"woman_height",
												"from"
											)
									  )
									: 120,
								getRangeParam("woman_height", "to")
									? Number(
											getRangeParam("woman_height", "to")
									  )
									: 220,
							]}
						/>
					</div>
					<Divider />

					{/*/!* WOMAN *!/*/}
					{/*<div className="Age">*/}
					{/*	<div className="FilterAge">*/}
					{/*		<p>{locale && locale.age}</p>*/}
					{/*		<div className="Inputs">*/}
					{/*			<Controller*/}
					{/*				render={({field}) => {*/}
					{/*					return (*/}
					{/*						<InputText*/}
					{/*							type={"text"}*/}
					{/*							field={field}*/}
					{/*							placeholder={t("site.Min")}*/}
					{/*							// maxLength={3}*/}
					{/*							id={"age_woman_min"}*/}
					{/*						/>*/}
					{/*					)*/}
					{/*				}}*/}
					{/*				name={"filter.age.woman_min"}*/}
					{/*				control={control}*/}
					{/*				defaultValue={getRangeParam(*/}
					{/*					"woman_age",*/}
					{/*					"from"*/}
					{/*				)}*/}
					{/*			/>*/}
					{/*			<p className={"ft"}>–</p>*/}
					{/*			<Controller*/}
					{/*				render={({field}) => {*/}
					{/*					return (*/}
					{/*						<InputText*/}
					{/*							type={"text"}*/}
					{/*							field={field}*/}
					{/*							placeholder={t("site.Max")}*/}
					{/*							// maxLength={3}*/}
					{/*							id={"age_woman_max"}*/}
					{/*						/>*/}
					{/*					)*/}
					{/*				}}*/}
					{/*				name={"filter.age.woman_max"}*/}
					{/*				control={control}*/}
					{/*				defaultValue={getRangeParam(*/}
					{/*					"woman_age",*/}
					{/*					"to"*/}
					{/*				)}*/}
					{/*			/>*/}
					{/*		</div>*/}
					{/*	</div>*/}
					{/*</div>*/}
					{/*<Divider />*/}
					{/*<div className="Age">*/}
					{/*	<div className="FilterAge">*/}
					{/*		<p>{locale && locale.height}</p>*/}
					{/*		<div className="Inputs">*/}
					{/*			<Controller*/}
					{/*				render={({field}) => {*/}
					{/*					return (*/}
					{/*						<InputText*/}
					{/*							type={"text"}*/}
					{/*							field={field}*/}
					{/*							placeholder={t("site.Min")}*/}
					{/*							// maxLength={3}*/}
					{/*							id={"height_woman_min"}*/}
					{/*						/>*/}
					{/*					)*/}
					{/*				}}*/}
					{/*				name={"filter.height.woman_min"}*/}
					{/*				control={control}*/}
					{/*				defaultValue={getRangeParam(*/}
					{/*					"woman_height",*/}
					{/*					"from"*/}
					{/*				)}*/}
					{/*			/>*/}
					{/*			<p className={"ft"}>–</p>*/}
					{/*			<Controller*/}
					{/*				render={({field}) => {*/}
					{/*					return (*/}
					{/*						<InputText*/}
					{/*							type={"text"}*/}
					{/*							field={field}*/}
					{/*							placeholder={t("site.Max")}*/}
					{/*							// maxLength={3}*/}
					{/*							id={"height_woman_max"}*/}
					{/*						/>*/}
					{/*					)*/}
					{/*				}}*/}
					{/*				name={"filter.height.woman_max"}*/}
					{/*				control={control}*/}
					{/*				defaultValue={getRangeParam(*/}
					{/*					"woman_height",*/}
					{/*					"to"*/}
					{/*				)}*/}
					{/*			/>*/}
					{/*		</div>*/}
					{/*	</div>*/}
					{/*</div>*/}
					{/*<Divider />*/}
					{additional_data &&
						additional_data.map((struct: any, index: any) => {
							return (
								<div key={struct.id}>
									<div className="AreaFilterContainer">
										<p className={"SectionTitle"}>
											{struct.title}
										</p>
										<div className="AreaFilter">
											{struct.data &&
												struct.data.map((row: any) => {
													if (
														row &&
														row.profile_type &&
														row.profile_type !==
															"WOMAN"
													)
														return null

													return (
														<Controller
															render={({
																field,
															}) => (
																<>
																	<InputCheckBoxFilter
																		title={
																			row.title
																		}
																		field={
																			field
																		}
																		value={`woman_${struct.id}_${row.id}`}
																		id={`input_checkbox_horizontal_woman_${struct.id}_${row.id}`}
																	/>
																</>
															)}
															name={`filter.${struct.id}.woman.id_${row.id}`}
															control={control}
															defaultValue={getCheckboxParam(
																`woman_${struct.id}`,
																row.id
															)}
															key={row.id}
														/>
													)
												})}
										</div>
									</div>
									{index + 1 < additional_data.length && (
										<Divider />
									)}
								</div>
							)
						})}
				</>
			)}
		</>
	)
}

export default FiltersWoman
