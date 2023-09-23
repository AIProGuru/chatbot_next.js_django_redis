import * as Yup from "yup";
import parsePhoneNumber from "libphonenumber-js";
import { removeSpaces } from "@/components/ui/Functions/RemoveSpaces";

// import {accountTypes} from "./constants";

function ageTest(value: any, minAge = 18) {
    const age = Number(parseInt(value))

    if (age.toString().startsWith('-')) {
        return false
    }

    if (age < 0 || age === 0) {
        return false
    }

    if (isNaN(age) || !age) {
        return true
    } else {
        return !(age > 0 && age < minAge);
    }
}

function maxAgeTest(value: any, maxAge: number) {
    const age = Number(parseInt(value))
    return age <= maxAge
}

function minlegnthTest(value: string, minValue: number) {
	if (value.length < minValue) {
		return false
	} else {
		return true
	}
}

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
        return height >= 90 && height <= 220
    }
}

// export const validationSignup = Yup.object().shape({
//     username: Yup.string().required('Username is required'),
//     email: Yup.string()
//             .required('Email is required')
//             .email('Email is invalid'),
//     password: Yup.string()
//         .min(6, 'Password must be at least 6 characters')
//         .required('Password is required'),
//     confirmPassword: Yup.string()
//         .oneOf([Yup.ref('password'), null], 'Passwords must match')
//         .required('Confirm Password is required'),
//
//     phone: Yup.string(),
//     otp: Yup.string(),
// })

export const validationSignInEmailUsername = Yup.object().shape({
    usernameEmail: Yup.string()
        .required('Username or email is required'),
    password: Yup.string()
        .required('Password is required'),
})

export const validationSignInPhone = Yup.object().shape({
    phone_number: Yup.string().test('ifNotEmptyPhoneValid', 'yup_signin_phone_number_valid', (value: any) => {
        if (!value) return false
        const v = value.toString()
        if (v.length < 1) return false

        const phoneNumber = parsePhoneNumber(value)
        return !!phoneNumber?.isValid()
    }),
})

export const validationSignInOtp = Yup.object().shape({
    otp: Yup.string()
        .required('Otp is required'),
})

export const validationEventCoupleStep1 = Yup.object().shape({
    age_man: Yup.string()
        .test('man-age-test', 'Age must be 18 or greater', (value: any) => {
            return ageTest(value, 18)
        }).required("Man's age is required"),
    age_woman: Yup.string()
        .test('woman-age-test', 'Age must be 18 or greater', (value: any) => {
            return ageTest(value, 18)
        }).required("Woman's age is required"),
    profile_type: Yup.string()
        .required('Profile type is required'),
    nickname_man: Yup.string()
        .required("Man's nickname is required"),
    nickname_woman: Yup.string()
        .required("Woman's nickname is required"),
})

export const validationEventManStep1 = Yup.object().shape({
    age_man: Yup.string()
        .test('man-age-test', 'Age must be 18 or greater', (value: any) => {
            return ageTest(value, 18)
        }).required('Age is required'),
    profile_type: Yup.string()
        .required('Profile type is required'),
    nickname_man: Yup.string()
        .required("Man's nickname is required"),
})

export const validationEventWomanStep1 = Yup.object().shape({
    age_woman: Yup.string()
        .test('woman-age-test', 'Age must be 18 or greater', (value: any) => {
            return ageTest(value, 18)
        }).required('Age is required'),
    profile_type: Yup.string()
        .required('Profile type is required'),
    nickname_woman: Yup.string()
        .required("Woman's nickname is required"),
})

export const validationEventPhoneStep2 = Yup.object().shape({
    phone_number: Yup.string()
        .required('Phone number is required'),
})

// export const validationStep1 = Yup.object().shape({
//     manAge: Yup.string()
//         .test('man-age-test', 'Age must be 18 or greater', (value: any) => {
//             return ageTest(value, 18)
//         }),
//     womanAge: Yup.string()
//         .test('woman-age-test', 'Age must be 18 or greater', (value: any) => {
//             return ageTest(value, 18)
//         }),
//     accountType: Yup.string()
//         .required('Account type is required'),
//     region: Yup.object(),
//     // relation: Yup.string(),
//     suit: Yup.object(),
// })

const profileValidationSchema = {
    bDay: Yup.string(),
    height: Yup.string()
        .test('height-test', 'Height (in cm) must be between 90-220', (value: any) => {
            return heightTest(value)
        }),
    bodyStructure: Yup.string(),
    mostImpressive: Yup.string(),
    sexualOrientation: Yup.string(),
    skinTone: Yup.string(),
    smokingType: Yup.string(),
    nickname: Yup.string(),
};
// export const profileManValidationSchema = {
//     ...profileValidationSchema,
//     bodyHeir: Yup.string()
// };
// export const profileWomanValidationSchema = {
//     ...profileValidationSchema,
//     chestSize: Yup.string()
// };
// export const validationStep2: any = {
//     language: Yup.object(),
//     familyStatus: Yup.string()
//         .nullable(),
//     prefer: Yup.string()
//         .nullable(),
//     available: Yup.string()
//         .nullable(),
// };

const minSelected = (min: number, max: number) => {
    return (value: any) => {
        let count = 0
        for (const key of Object.keys(value)) {
            if (value[key]) count += 1
        }

        if (count >= min && count <= max) {
            return true
        } else {
            return false
        }
    }
}

// export const validationStep3: any = {
//     favorite: Yup.object()
//         .test('selected-favorite', 'Up to 4 picks', minSelected(0, 4)), //1-4
//     act: Yup.object()
//         .test('selected-favorite', 'Up to 5 picks', minSelected(0, 5)), //1-5
//     stage: Yup.object()
//         .test('selected-favorite', 'Up to 4 picks', minSelected(0, 4)), //1-4
//     alcohol: Yup.string()
//         .nullable(),
//     smokingPrefer: Yup.string()
//         .nullable(),
//     experience: Yup.string()
//         .nullable(),
//     hosted: Yup.string()
//         .nullable(),
//     about: Yup.string(),
//     // phone: Yup.string()
//     //     .required('Phone is required')
//     //     .matches(
//     //         /^[0][5][0|2-5|9]{1}[-]{0,1}[0-9]{7}$/,
//     //         "Phone number must be integer and be in format 05(0,2,3,4,5,9)-(0000000) (e.g. 054-7475720)"
//     //     ),
//     is_agree_terms: Yup.bool()
//         .oneOf([true], 'Accept Ts & Cs is required') // todo: why one of?
// };

// profile signup validation
export const validationProfileSignupCoupleStep1 = Yup.object().shape({
    age: Yup.object().shape({
        man: Yup.string()
            .required('man_age_is_required')
            .test('man-age-test', 'age_must_be_18_or_greater', (value: any) => {
                return ageTest(value, 18)
            })
            .test('man-max-age-test', 'age_must_be_80_or_less', (value: any) => {
                return maxAgeTest(value, 80)
            }),
        woman: Yup.string()
            .required('woman_age_is_required')
            .test('woman-age-test', 'age_must_be_18_or_greater', (value: any) => {
                return ageTest(value, 18)
            })
            .test('woman-max-age-test', 'age_must_be_80_or_less', (value: any) => {
                return maxAgeTest(value, 80)
            }),
    }),
    profile_type: Yup.string()
        .required('profile_type_is_required'),
    couple_nickname: Yup.string()
        .required('couple_nickname_is_required'),
    relation: Yup.string().required('yup_PRStep1_relation_required'),
})

export const validationProfileSignupManStep1 = Yup.object().shape({
    age: Yup.object().shape({
        man: Yup.string()
            .required('man_age_is_required')
            .test('man-age-test', 'age_must_be_18_or_greater', (value: any) => {
                return ageTest(value, 18)
            })
            .test('man-max-age-test', 'age_must_be_80_or_less', (value: any) => {
                return maxAgeTest(value, 80)
            }),
    }),
    profile_type: Yup.string()
        .required('profile_type_is_required'),
    relation: Yup.string().required('yup_PRStep1_relation_required'),
})

export const validationProfileSignupWomanStep1 = Yup.object().shape({
    age: Yup.object().shape({
        woman: Yup.string()
            .required('woman_age_is_required')
            .test('woman-age-test', 'age_must_be_18_or_greater', (value: any) => {
                return ageTest(value, 18)
            }).test('woman-max-age-test', 'age_must_be_80_or_less', (value: any) => {
                return maxAgeTest(value, 80)
            }),
    }),
    profile_type: Yup.string()
        .required('profile_type_is_required'),
    relation: Yup.string().required('yup_PRStep1_relation_required'),
})

export const minLengthBlogTitle = 5
export const minLengthBlogDescription = 30
export const validationBlog = Yup.object().shape({
    title: Yup.string()
        .test('blog-title-test', `Minimum title length over ${minLengthBlogTitle} characters`, (value: any) => {
            return minlegnthTest(removeSpaces(value), minLengthBlogTitle)
        }).required(`Title is required`),
    description: Yup.string()
				.test('blog-title-test', `Minimum description length over ${minLengthBlogDescription} characters`, (value: any) => {
						return minlegnthTest(value, minLengthBlogDescription)
				}).required('Description type is required'),
})

// export const minLengthForumTitle = 5
// export const minLengthForumDecription = 30
export const validationForum = Yup.object().shape({
    title: Yup.string()
        .test('blog-title-test', `Minimum title length over ${minLengthBlogTitle} characters`, (value: any) => {
            return minlegnthTest(removeSpaces(value), minLengthBlogTitle)
        }).required(`Title is required`),
    description: Yup.string()
				.test('blog-description-test', `Minimum description length over ${minLengthBlogDescription} characters`, (value: any) => {
						return minlegnthTest(value, minLengthBlogDescription)
				}).required('Description type is required'),
})