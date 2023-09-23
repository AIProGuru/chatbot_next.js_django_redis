import * as Yup from "yup";

export const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().required('yup_auth_forgot_password_email_required').email('yup_auth_forgot_password_email_must_be_email'),
})