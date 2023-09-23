import {Controller} from "react-hook-form"
import InputCheckBoxFilter from "@/components/ui/Forms/Inputs/CheckboxFilter/InputCheckBoxFilter"
import React from "react"

interface FiltersAreaProps {
	areaData: any
	control: any
	getCheckboxParam: Function
	sectionTitle: string
}

function FiltersArea(props: FiltersAreaProps) {
	const {areaData, control, getCheckboxParam, sectionTitle} = props

	return (
		<div className="AreaFilterContainer">
			<p className={"SectionTitle"}>{sectionTitle && sectionTitle}</p>
			<div className="AreaFilter">
				{areaData &&
					areaData.map((row: any) => {
						return (
							<Controller
								render={({field}) => (
									<>
										<InputCheckBoxFilter
											title={row.title}
											field={field}
											value={`area_${row.id}`}
											id={`input_checkbox_horizontal_${row.id}`}
										/>
									</>
								)}
								name={`filter.area.id_${row.id}`}
								control={control}
								defaultValue={
									getCheckboxParam("location", row.id)
									// filters && filters.area
									// 	? filters.area[`id_${row.id}`]
									// 	: false
								}
								key={row.id}
							/>
						)
					})}
			</div>
		</div>
	)
}

export default FiltersArea
