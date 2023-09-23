import Image from "next/image"

interface NextImageProps {
	src?: string
	width: number
	height: number
	alt?: string
	onClick?: Function
}

function NextImage(props: NextImageProps) {
	const {src, width, height, alt, onClick} = props

	if (src) {
		return (
			<Image
				src={src}
				width={width}
				height={height}
				alt={alt ? alt : ""}
				unoptimized={true}
			/>
		)
	}

	return null
}

export default NextImage
