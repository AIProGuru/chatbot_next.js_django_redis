import * as Yup from "yup"

export const Step6Schema = Yup.object().shape({
    about: Yup.string()
        .test('cleanAbout', 'yup_pr_step6_about_no_number', (value: any) => {
            if (!value) return true
            const v = value.toString()
            
             
            
            if(/(.)\1{3,}/.test(value)) return false //cant write same letter 
            if(/[a-zA-Z\u0590-\u05FF]{15,}/.test(value)) return false// cant write words with more than
            if(/[0-9@\/\\_]/.test(value)) return false// cant write numbers \/0-9@_
            return /[a-zA-Z\u0590-\u05FF0-9 -]+/.test(value) // can use a-z, A-Z, א-ת, 0-9, spaces and _-
        })
        .test('minLengthTest', 'yup_pr_step6_about_min_length', (value: any) => {
            if (!value) return true
            const v = value.toString()
            if (v.length < 1) return true
            return !(v.length >= 1 && v.length < 60)
        })
        .test('maxLengthTest', 'yup_pr_step6_about_max_length', (value: any) => {
            if (!value) return true
            const v = value.toString()
            return v.length <= 500
        })
        
    
        
        .required("yup_pr_step6_about_required")
})