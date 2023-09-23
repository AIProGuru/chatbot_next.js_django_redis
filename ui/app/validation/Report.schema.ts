import * as Yup from "yup";
import {getSelectedIds} from "@/components/ui/Functions/GetSelectedIDs";

export const ReportSchema = Yup.object().shape({
    report_text: Yup.string().min(20, 'yup_report_report_text_min_20_characters').required('yup_report_report_text_required'),
    reason: Yup.object().test('atLeastOneSelected', 'yup_report_reason_required', (value: any) => {
        const ids = getSelectedIds(value)
        return ids.length > 0
    })
})