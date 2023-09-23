import React, {useState, useEffect} from "react"
import {SendLocationProps} from "@/services/users.service"

type TLocation = {
	loaded: boolean
	coordinates?: SendLocationProps
	error?: {
		code: string
		message: string
	}
}

const useGeoLocation = () => {
	const [location, setLocation] = useState<TLocation>({
		loaded: false,
		coordinates: {lat: 0, lon: 0},
	})

	const onSuccess = (location: any) => {
		setLocation({
			loaded: true,
			coordinates: {
				lat: location.coords.latitude.toFixed(2),
				lon: location.coords.longitude.toFixed(2),
			},
		})
	}

	const onError = (error: any) => {
		setLocation({
			loaded: true,
			error: {
				code: error.code,
				message: error.message,
			},
		})
	}

	useEffect(() => {
		if (!("geolocation" in navigator)) {
			onError({
				code: 0,
				message: "Geolocation not supported",
			})
		}

		// navigator.geolocation.getCurrentPosition(onSuccess, onError)
		const geoLocationWatchId = navigator.geolocation.watchPosition(onSuccess, onError)

		return () => {
			navigator.geolocation.clearWatch(geoLocationWatchId);
		};

	}, [])

	return location
}

export default useGeoLocation
