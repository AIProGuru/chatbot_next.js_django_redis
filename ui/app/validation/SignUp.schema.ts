import * as Yup from "yup";
import parsePhoneNumber from "libphonenumber-js"
import {SignUpValidationTypes, ValidateSignUpData} from "@/services/common.service";
import {PasswordRulesSchema} from "@/app/validation/common/PasswordRules.schema";

// https://stackoverflow.com/a/69929361

export const SignUpSchema = Yup.object().shape({
    username: Yup.string().required('yup_signup_username_required')
        .test('startsWithTest', 'yup_signup_username_startsWithSpace', (value: any) => {
            return !(value && value.toString().startsWith(' '))
        })
        .test('specialCharactersTest', 'yup_signup_username_noSpecialCharacters', (value: any) => {
            // return /^[a-zA-Z0-9_]+$/.test(value)
            return /^[a-zA-Z\u0590-\u05FF0-9 _-]+$/.test(value)
        })
        .test('validationTest', 'yup_signup_username_already_exist', async (value: any) => {
            try {
                const result: any = await ValidateSignUpData(SignUpValidationTypes.username, value)
                return !!(result && result.data && result.data.detail === true)
            } catch (e) {
                console.log(e)
                return false
            }
        }),
    email: Yup.string().required('yup_signup_email_required').email('yup_signup_email_must_be_email')
        .test('validationTest', 'yup_signup_email_already_exist', async (value: any) => {
            try {
                const result: any = await ValidateSignUpData(SignUpValidationTypes.email, value)
                return !!(result && result.data && result.data.detail === true)
            } catch (e) {
                console.log(e)
                return false
            }
        }),
    ...PasswordRulesSchema,
    phone_number: Yup.string()
        .test('ifNotEmptyPhoneValid', 'yup_signup_phone_number_valid', (value: any) => {
            // console.log(value)
            // return false
            if (value) {
                if (value.toString().length < 1) {
                    return true
                } else {
                    const phoneNumber = parsePhoneNumber(value)
                    return !!phoneNumber?.isValid()
                }
            } else {
                return true
            }
        })
        .test('validationTest', 'yup_signup_phone_already_exist', async (value: any) => {
            if (value) {
                if (value.toString().length < 1) {
                    return true
                } else {
                    try {
                        const result: any = await ValidateSignUpData(SignUpValidationTypes.phone, value)
                        return !!(result && result.data && result.data.detail === true)
                    } catch (e) {
                        console.log(e)
                        return false
                    }
                }
            } else {
                return true
            }
        }),
    agreement: Yup.boolean().required('yup_signup_agreement_required')
})