import * as Yup from "yup";
import {getSelectedIds} from "@/components/ui/Functions/GetSelectedIDs";

export const ProfileRegistrationStep2Schema = Yup.object().shape({
    language: Yup.object().test('atLeastOneSelected', 'yup_PRStep2_language_required_at_least_one', (value: any) => {
        const ids = getSelectedIds(value)
        return ids.length > 0
    }),
    location: Yup.number().required('yup_PRStep2_location_required'),
    settlement: Yup.number().required('yup_PRStep2_settlement_required'),
}) 