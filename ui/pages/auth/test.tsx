import {useAppSelector} from "@/redux/store"
import {useEffect} from "react"

function TestPage() {
	const data = useAppSelector((state) => state.UserInfoSlice)

	useEffect(() => {
		console.log("data", data)
	}, [data])

	return <div>Privet {JSON.stringify(data)}</div>
}

export default TestPage
// todo: THIS SHIT ALSO NEED TO BE DELETED.!
