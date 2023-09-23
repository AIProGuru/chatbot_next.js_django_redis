import * as Yup from "yup"

const PasswordRulesSchema = {
    password: Yup.string().required('yup_reset_password_required')
        .test('lowerCaseTest', 'yup_password_lowercase', (value: any) => {
            return /^(?=.*[a-z])/.test(value)
        })
        .test('upperCaseTest', 'yup_password_uppercase', (value: any) => {
            return /^(?=.*[A-Z])/.test(value)
        })
        .test('digitTest', 'yup_password_digit', (value: any) => {
            return /^(?=.*[0-9])/.test(value)
        })
        .test('lengthTest', 'yup_password_length', (value: any) => {
            return value.toString().length >= 6
        }),
    password_confirmation: Yup.string().required('yup_password_confirmation_required').oneOf([Yup.ref('password'), null], 'yup_password_confirmation_not_match'),
}

export {PasswordRulesSchema}