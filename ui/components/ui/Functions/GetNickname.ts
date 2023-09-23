function getNickName(profileAd: any) {
  switch (profileAd?.profile_type) {
    case "MAN":
      return profileAd?.man?.nickname
    case "WOMAN":
      return profileAd?.woman?.nickname
    case "COUPLE":
      return profileAd?.couple_nickname
  }
}

export {getNickName}