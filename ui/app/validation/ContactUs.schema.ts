import * as Yup from "yup";
import parsePhoneNumber from 'libphonenumber-js'

export const ContactUsSchema = Yup.object().shape({
    full_name: Yup.string().required('yup_contact_us_full_name_required'),
    email: Yup.string().required('yup_contact_us_email_required').email('yup_contact_us_email_must_be_email'),
    content: Yup.string().required('yup_contact_us_content_required'),
    phone_number: Yup.string().test('ifNotEmptyPhoneValid', 'yup_contact_us_phone_number_valid', (value: any) => {
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
}) //