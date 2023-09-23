import * as Yup from "yup";
import {PasswordRulesSchema} from "@/app/validation/common/PasswordRules.schema";

export const ResetPasswordSchema = Yup.object().shape({
    ...PasswordRulesSchema
})