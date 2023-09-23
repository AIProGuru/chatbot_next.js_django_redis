import * as Yup from "yup";
import {getSelectedStringIds} from "@/components/ui/Functions/GetSelectedIDs";

export const TryChatCreateGroupSchema = Yup.object().shape({
    group_name: Yup.string()
        .required('yup_tc_create_group_name_required')
        .test('emptyTitle', 'yup_tc_create_group_empty_title', (value: any) => {
            if (value) {
                const title = value.trim()
                return title.length > 0 && title.length <= 140
            }

            return false
        }),
    group: Yup.object()
        .test('itemsCountTest', 'yup_tc_create_group_limit', (value: any) => {
            const ids = getSelectedStringIds(value)
            return ids.length >= 2 && ids.length <= 5
        })
})