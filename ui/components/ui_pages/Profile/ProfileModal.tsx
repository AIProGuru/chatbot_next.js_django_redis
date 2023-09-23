import {useEffect, useState} from "react"
import {useRouter} from "next/router"

function ProfileModal() {
	const router = useRouter()
	const {uid} = router.query

	const [id, setID] = useState<string | undefined>(undefined)

	useEffect(() => {
		if (uid && typeof uid === "string") {
			setID(uid)
		}
	}, [uid])

	useEffect(() => {
		console.log("effect, no deps")
	}, [])

	useEffect(() => {
		console.log("effect, id deps no condition")

		if (id) {
			console.log("effect, id deps")
		}
	}, [id])

	return <div>Profile modal {id}</div>
}

export default ProfileModal
