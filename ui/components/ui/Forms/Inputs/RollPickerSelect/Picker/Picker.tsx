import styles from "./Picker.module.scss"
import {Swiper, SwiperSlide} from "swiper/react"
// import "swiper/css"
// import "swiper/css/pagination"
// import "swiper/css/bundle"
import {useCallback, useEffect, useState} from "react"

interface PickerProps {
	min: number
	max: number
	field?: any
	sort?: "reverse"
	defaultValue?: number | undefined
}

function Picker(props: PickerProps) {
	const {min, max, field, sort, defaultValue} = props

	const [items, setItems] = useState<number[]>([])
	const [currentSlide, setCurrentSlide] = useState(0)
	const [initialSlide, setInitialSlide] = useState<number | undefined>(
		undefined
	)
	const [updateCounter, setUpdateCounter] = useState(0)

	const generateArrayOfItems = useCallback(() => {
		const array = []

		if (sort && sort === "reverse") {
			for (let i = max; i >= min; i--) {
				array.push(i)
			}
		} else {
			for (let i = min; i <= max; i++) {
				array.push(i)
			}
		}

		setItems(array)
	}, [max, min, sort])

	useEffect(() => {
		generateArrayOfItems()
	}, [generateArrayOfItems])

	useEffect(() => {
		if (items && items.length > 0) {
			const slide = Math.ceil(items.length / 2)
			// if (defaultValue) {
			// 	const search = items.find((s) => s === defaultValue)
			// 	if (search) {
			// 		const index = items.indexOf(search)
			// 		setInitialSlide(index)
			// 	} else {
			// 		setInitialSlide(Math.ceil(items.length / 2))
			// 	}
			// } else {
			setInitialSlide(slide)
			// }
		}
	}, [items])

	function update(s: any) {
		if (updateCounter < 1) {
			setUpdateCounter((prevState) => prevState + 1)
		} else {
			setUpdateCounter((prevState) => prevState + 1)
			setCurrentSlide(s.activeIndex)
			field.onChange(items[s.activeIndex])
		}
	}

	// todo: implement default value

	if (!items || items.length < 1 || !initialSlide) return null

	return (
		<div className="SwiperProfileReg">
			<input type="text" {...(field && {...field})} hidden={true} />
			<div className={styles.Picker}>
				<Swiper
					freeMode={true}
					mousewheel={{
						releaseOnEdges: true,
					}}
					centeredSlides={true}
					slidesPerView={"auto"}
					spaceBetween={15}
					direction={"vertical"}
					className="swiper"
					onSlideChange={(s) => {
						update(s)
					}}
					initialSlide={initialSlide}
				>
					{items &&
						items.map((item: number, index: number) => {
							return (
								<SwiperSlide
									key={item}
									className={
										currentSlide === item
											? "swiper-slide swiper-slide-active"
											: "swiper-slide"
									}
								>
									{item}
								</SwiperSlide>
							)
						})}
				</Swiper>
			</div>
		</div>
	)
}

export default Picker
