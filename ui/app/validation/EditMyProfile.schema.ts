import { removeSpaces } from "@/components/ui/Functions/RemoveSpaces"
import * as Yup from "yup"

export const EditMyProfileSchema = Yup.object().shape({
    nickname: Yup.string()
        .test('startsWithTest', 'profile_edit_nickname_startsWithSpace', (value: any) => {
            return !(value && value.toString().startsWith(' '))
        })
        .test('specialCharactersTest', 'profile_edit_nickname_noSpecialCharacters', (value: any) => {
            if (!value) return true
            const v = removeSpaces(value.toString())
 
            if (v.length < 1) return true

            return /^[a-zA-Z\u0590-\u05FF0-9 _-]+$/.test(removeSpaces(value))
            // return /^[a-zA-Z0-9_]+$/.test(value)
        }).required("yup_nickname_required"),
    about: Yup.string()
        .test('cleanAbout', 'profile_edit_about_no_number', (value: any) => {
            if (!value) return true
            const v = value.toString()
            
            
            
            if(/(.)\1{3,}/.test(value)) return false //cant write same letter 
            if(/[a-zA-Z\u0590-\u05FF]{15,}/.test(value)) return false// cant write words with more than
            if(/[0-9@\/\\_]/.test(value)) return false// cant write numbers \/0-9@_
            return /[a-zA-Z\u0590-\u05FF0-9 -]+/.test(value) // can use a-z, A-Z, א-ת, 0-9, spaces and _-
        })
        .test('minLengthTest', 'profile_edit_about_min_length', (value: any) => {
            if (!value) return true
            const v = removeSpaces(value.toString())
            if (v.length < 1) return true
            return !(v.length >= 1 && v.length < 60)
        })
        .test('maxLengthTest', 'profile_edit_about_max_length', (value: any) => {
            if (!value) return true
            const v = removeSpaces(value.toString())
            return v.length <= 500
        }).required('yup_pr_step6_about_required')
})