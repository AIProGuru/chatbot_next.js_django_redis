import {he, ru, enGB} from "date-fns/locale"
import {NextRouter} from "next/router"

const getDateLocale = (router: NextRouter) => {
	const locale = router.locale

	switch (locale) {
		case "ru":
			return ru

		case "en":
			return enGB

		case "he":
			return he

		default:
			return enGB
	}
}

export {getDateLocale}
