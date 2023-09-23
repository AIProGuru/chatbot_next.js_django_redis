import {Controller} from "react-hook-form"
import InputCheckBoxFilter from "@/components/ui/Forms/Inputs/CheckboxFilter/InputCheckBoxFilter"
import React from "react"

interface FiltersProfileTypeProps {
	profileTypes: any
	control: any
	getCheckboxParam: Function
	sectionTitle: string
	type: string
}

function FiltersProfileType(props: FiltersProfileTypeProps) {
	const {profileTypes, control, getCheckboxParam, sectionTitle, type} = props
	return (
		<div className="AreaFilterContainer">
			<p className={"SectionTitle"}>{sectionTitle && sectionTitle}</p>
			<div className="AreaFilter">
				{profileTypes &&
					profileTypes.map((row: any) => {
						return (
							<Controller
								render={({field}) => (
									<>
										<InputCheckBoxFilter
											title={row.title}
											field={field}
											value={`${type}_${row.id}`}
											id={`input_checkbox_horizontal_${type}_${row.id}`}
										/>
									</>
								)}
								name={`filter.${type}.id_${row.id}`}
								control={control}
								defaultValue={getCheckboxParam(type, row.id)}
								key={row.id}
							/>
						)
					})}
			</div>
		</div>
	)
}

export default FiltersProfileType
