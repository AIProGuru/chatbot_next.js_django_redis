import * as Yup from "yup";
import {getSelectedIds} from "@/components/ui/Functions/GetSelectedIDs";
import { removeSpaces } from "@/components/ui/Functions/RemoveSpaces";

export const ProfileRegistrationStep5Schema = Yup.object().shape({
    suits: Yup.object().test('limit', 'yup_PRStep5_suits_limit', (value: any) => {
        const ids = getSelectedIds(value)
        return ids.length <= 3
    }).test('required', "yup_PRStep5_suits_required", (value: any) => {
        const ids = getSelectedIds(value)
        return ids.length > 0
    }),
    favorites: Yup.object().test('limit', 'yup_PRStep5_favorites_limit', (value: any) => {
        const ids = getSelectedIds(value)
        return ids.length <= 5
    }).test('required', "yup_PRStep5_favorites_required", (value: any) => {
        const ids = getSelectedIds(value)
        return ids.length > 0
    }),
    stages: Yup.object().test('limit', 'yup_PRStep5_stages_limit', (value: any) => {
        const ids = getSelectedIds(value)
        return ids.length <= 5
    }).test('required', "yup_PRStep5_stages_required", (value: any) => {
        const ids = getSelectedIds(value)
        return ids.length > 0
    }),
    acts: Yup.object().test('limit', 'yup_PRStep5_acts_limit', (value: any) => {
        const ids = getSelectedIds(value)
        return ids.length <= 5
    }).test('required', "yup_PRStep5_acts_required", (value: any) => {
        const ids = getSelectedIds(value)
        return ids.length > 0
    }),
    hosted: Yup.string().test('required', "yup_PRStep5_hosted_required", (value: any) => {
        return value != ""
    }),
    spaces: Yup.string().test('required', "yup_PRStep5_spaces_required", (value: any) => {
        return value != ""
    }) // try to see if changing from string to object does something

})
 