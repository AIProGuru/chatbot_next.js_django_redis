import * as Yup from "yup"

function heightTest(value: any) {
    const height = Number(parseInt(value))

    if (height.toString().startsWith('-')) {
        return false
    }

    if (height < 0 || height === 0) {
        return false
    }

    if (isNaN(height) || !height) {
        return true
    } else {
        return height >= 120 && height <= 220
    }
}
 
// man - [height, nickname, body_structure, body_hair, sexual_orientation, skin_tone, most_impressive, smoking]
// man - [height, nickname, body_structure, breast_size, sexual_orientation, skin_tone, most_impressive, smoking]

export const Step3SchemaMan = Yup.object().shape({
    nickname: Yup.string()
        .test('startsWithTest', 'yup_pr_step3_nickname_startsWithSpace', (value: any) => {
            return !(value && value.toString().startsWith(' '))
        })
        .test('specialCharactersTest', 'yup_pr_step3_nickname_noSpecialCharacters', (value: any) => {
            if (!value) return true
            const v = value.toString()

            if (v.length < 1) return true

            return /^[a-zA-Z\u0590-\u05FF0-9 _-]+$/.test(value)
            // return /^[a-zA-Z0-9_]+$/.test(value)
        }).required('yup_nickname_required'),
    height: Yup.string()
        .test('height-test', 'yup_pr_step3_height_120_220', (value: any) => {
            return heightTest(value)
        }).required('yup_height_required'),
    birthday: Yup.string()
        .required('yup_birthday_required'),
    body_structure: Yup.string()
        .required('yup_body_structure_required'),
    sexual_orientation: Yup.string()
        .required('yup_sexual_orientation_required'),
    skin_tone: Yup.string()
        .required('yup_skin_tone_required'),
    most_impressive: Yup.string()
        .required('yup_most_impressive_required'),
    smoking: Yup.string()
        .required('yup_smoking_required'),
    body_hair: Yup.string()
        .required('yup_body_hair_required'),
    })

export const Step3SchemaWoman = Yup.object().shape({
    nickname: Yup.string()
        .test('startsWithTest', 'yup_pr_step3_nickname_startsWithSpace', (value: any) => {
            return !(value && value.toString().startsWith(' '))
        })
        .test('specialCharactersTest', 'yup_pr_step3_nickname_noSpecialCharacters', (value: any) => {
            if (!value) return true
            const v = value.toString()

            if (v.length < 1) return true

            return /^[a-zA-Z\u0590-\u05FF0-9 _-]+$/.test(value)
            // return /^[a-zA-Z0-9_]+$/.test(value)
        }).required('yup_nickname_required'),
    height: Yup.string()
        .test('height-test', 'yup_pr_step3_height_120_220', (value: any) => {
            return heightTest(value)
        }).required('yup_height_required'),
    birthday: Yup.string()
        .required('yup_birthday_required'),
    body_structure: Yup.string()
        .required('yup_body_structure_required'),
    sexual_orientation: Yup.string()
        .required('yup_sexual_orientation_required'),
    skin_tone: Yup.string()
        .required('yup_skin_tone_required'),
    most_impressive: Yup.string()
        .required('yup_most_impressive_required'),
    smoking: Yup.string()
        .required('yup_smoking_required'),
    breast_size: Yup.string()
        .required('yup_breast_size_required'),
    })