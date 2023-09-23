import styles from "./StoriesCarousel.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"

interface StoriesCarouselProps {
	children: any
}

function StoriesCarousel(props: StoriesCarouselProps) {
	const {children} = props
	const router = useRouter()

	const dir = getDirection(router)

	return (
		<div className={cc([styles.StoriesCarousel, dir && styles[dir]])}>
			{children}
		</div>
	)
}

export default StoriesCarousel
