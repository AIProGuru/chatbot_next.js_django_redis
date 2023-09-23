import styles from "./Image.module.scss"
import Image from "next/image" 
interface ImageProps {
	src: string
	onClick?: any
	alt?: string
}

function ImageHandler(props: ImageProps) {
	const {src, onClick, alt} = props

	return (
		<div onClick={onClick} className={styles.Image}>
			<Image 
			src={src}
			alt={alt ?? ''}
			width={0}
			height={0}
			sizes="100vw"
			style={{width:"100%", height:"auto"}}
			/>
		</div>
	)
}

export default ImageHandler
