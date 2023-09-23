import {setCookie, deleteCookie} from 'cookies-next';
import {toggleLoggedIn} from "@/redux/slices/AuthSlice";

export const loginUser = (data: any, dispatch: any, router: any, userProfileInfo: any, resetLoading?: Function) => {
    const {
        access_token: accessToken,
        refresh_token: refreshToken
    } = data

    // setCookie('accessToken', accessToken, {sameSite:"lax"});
    // setCookie('refreshToken', refreshToken, {sameSite:"lax"});
    setCookie('accessToken', accessToken);
    setCookie('refreshToken', refreshToken);

    dispatch(
        toggleLoggedIn({
            jwt: accessToken,
            ...data,
        })
    )
  
    let path;
 
    if (userProfileInfo?.freeze === true){
        path = '/auth/freeze';
    } /*else if (
        !!userProfileInfo.register
        && userProfileInfo.register > 0
        && userProfileInfo.register < 7
    ) {
        path = `/auth/signup/${userProfileInfo.current_profile_id ?? '0' }/step/${userProfileInfo.register}`;
    }*/ else if (userProfileInfo?.profiles && userProfileInfo?.profiles.length === 1){
        path = '/';
    } else {
        path = '/auth/profile/select'
    }

    router && router.push(path).then(() => {
        resetLoading && resetLoading(false)
        router.reload()
    })
}


export const logoutUser = (ctx?: any) => {
    if (ctx) {
        deleteCookie('accessToken', ctx);
        deleteCookie('refreshToken', ctx);
    } else {
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
    }
}


// export async function logoutPrompt(router: any) {
//     await signOut({
//         // callbackUrl: `${window.location.origin}/logout`,
//     })
//     const params = {
//         client_id: process.env.COGNITO_CLIENT_ID,
//         logout_uri: `${window.location.origin}/logout`,
//     }
//     // @ts-ignore
//     const url = `https://${process.env.COGNITO_DOMAIN}/logout?${new URLSearchParams(params)}`
//     router.push(url)
// }

export const isServer = () => {
    return typeof window === 'undefined'
}
export const isClient = () => {
    return typeof window !== 'undefined'
}

function isObjectEmpty<T>(obj: T) {
    // https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
    return (
        obj && // 👈 null and undefined check
        Object.keys(obj).length === 0 &&
        Object.getPrototypeOf(obj) === Object.prototype
    )
}

function clearObject<T>(obj: T) {
    // https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
    for (const propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined || String(obj[propName]) === "") {
            delete obj[propName]
        }

        if (typeof obj[propName] === "object") {
            obj[propName] = clearObject(obj[propName])
        }
    }

    // https://stackoverflow.com/questions/25421233/javascript-removing-undefined-fields-from-an-object
    return JSON.parse(JSON.stringify(obj))
}

export {isObjectEmpty, clearObject}