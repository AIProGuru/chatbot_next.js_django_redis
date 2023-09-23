import {useAppSelector} from "@/redux/store"
import {UserInfo} from "@/redux/slices/UserInfoSlice"

export const useGetUserProfilesInfo = (): UserInfo => {
	return useAppSelector((state) => state.UserInfoSlice.userInfo)
}
 