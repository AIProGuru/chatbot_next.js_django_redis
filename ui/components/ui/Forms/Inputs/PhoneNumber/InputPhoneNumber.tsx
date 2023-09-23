import styles from "./InputPhoneNumber.module.scss"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {cc} from "@/components/ui/Functions/Classnames"
import PhoneInput, {CountryData} from "react-phone-input-2"
import {useCallback, useEffect, useState} from "react"
import parsePhoneNumber from "libphonenumber-js"
import {
	SignUpValidationTypes,
	ValidateSignUpData,
} from "@/services/common.service"
// import "react-phone-input-2/lib/style.css"

interface InputPhoneNumberProps {
	register: any
	setValue: any
	name: string
	id?: string
	error?: string
	defaultCountry?: string
	onlyCountries?: string[]
	preferredCountries?: string[]
	phoneNumberError?: string | undefined
	setPhoneNumberError?: Function
}

function InputPhoneNumber(props: InputPhoneNumberProps) {
	const {
		register,
		setValue,
		name,
		id,
		error,
		defaultCountry,
		onlyCountries,
		preferredCountries,
		phoneNumberError,
		setPhoneNumberError,
	} = props
	const router = useRouter()
	const dir = getDirection(router)

	const [value, onChange] = useState()

	const initialDefaultCountry = "il"
	const initialOnlyCountries = ["il"] // ['il', 'ua', 'us']
	const initialPreferredCountries = ["il"]

	useEffect(() => {
		register(name)
	}, [name])

	const applyValue = useCallback(
		(v: any) => {
			onChange(v)
			setValue(name, v)
		},
		[name, setValue]
	)

	const isValid = (value: any) => {
		const phoneNumber = parsePhoneNumber(value)
		return !!phoneNumber?.isValid()
	}

	const isExist = async (value: any) => {
		try {
			const result: any = await ValidateSignUpData(
				SignUpValidationTypes.phone,
				value
			)
			// return !!(result && result.data && result.data.detail === true)

			if (result && result.data && result.data.detail === true) {
				return false
			} else {
				return true
			}
		} catch (e) {
			console.log(e)
			return true
		}
	}

	// const isLeft = dir === "ltr"
	// const activeSpan = isLeft ? styles.ActiveSpanLeft : styles.ActiveSpanRight

	return (
		<>
			<label
				className={cc([styles.InputPhoneNumber, dir && styles[dir]])}
				{...(id && {id: id})}
				dir={"auto"}
			>
				<PhoneInput
					placeholder={"050 123 4567"}
					autoFormat={true}
					// countryCodeEditable={false}
					disableCountryCode={true}
					{...(defaultCountry
						? {country: defaultCountry}
						: {country: initialDefaultCountry})}
					{...(onlyCountries
						? {onlyCountries: onlyCountries}
						: {onlyCountries: initialOnlyCountries})}
					{...(preferredCountries
						? {
								preferredCountries: preferredCountries,
						  }
						: {preferredCountries: initialPreferredCountries})}
					onChange={async (
						value,
						data: CountryData,
						event,
						formattedValue
					) => {
						const countryCode = data.dialCode
						let number = value

						if (!number || number.length < 1) {
							// console.log("num short")
							applyValue("")
							setPhoneNumberError &&
								setPhoneNumberError(undefined)
							return
						}

						number =
							number.charAt(0) === "0" &&
							data.countryCode === "il"
								? number.substring(1)
								: number
						const phoneNumber = ["+", countryCode, number].join("")

						console.log(phoneNumber)

						if (setPhoneNumberError) {
							if (!isValid(phoneNumber)) {
								setPhoneNumberError(
									"yup_signup_phone_number_valid"
								)
								return
							}

							const exist = await isExist(phoneNumber)

							if (exist) {
								setPhoneNumberError(
									"yup_signup_phone_already_exist"
								)
								return
							}

							setPhoneNumberError(undefined)
						}

						applyValue(phoneNumber)
					}}
					// containerClass={dir && `react-tel-input-${dir}`}
				/>

				{/*{placeholder && (*/}
				{/*	<span className={field?.value && activeSpan}>*/}
				{/*		{placeholder}*/}
				{/*	</span>*/}
				{/*)}*/}

				<div className={styles.ErrorContainer}>
					{error && <p className={styles.InputTextError}>{error}</p>}
				</div>
			</label>
		</>
	)
}

export default InputPhoneNumber
