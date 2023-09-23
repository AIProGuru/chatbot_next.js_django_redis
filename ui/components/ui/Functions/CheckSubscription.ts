type Permissions = {
	[x: string]: Flag[]
}

export enum Flag {
	createProfile,
	subscriptionEdit,
	chatCreateGroup,
	showAvailableDescription,
}

const checkSubscription = (subscriptionType: string, flag: Flag | Flag[]) => {
	subscriptionType = subscriptionType.toLowerCase()

	const types: string[] = ["without", "single", "trial", "multi"]
	if (!types.includes(subscriptionType)) return false

	const permissions: Permissions = {
		without: [],
		single: [Flag.subscriptionEdit, Flag.chatCreateGroup, Flag.showAvailableDescription],
		trial: [
			Flag.createProfile,
			Flag.subscriptionEdit,
			Flag.chatCreateGroup,
			Flag.showAvailableDescription
		],
		multi: [
			Flag.createProfile,
			Flag.subscriptionEdit,
			Flag.chatCreateGroup,
			Flag.showAvailableDescription
		],
	}

	return Array.isArray(flag)
		? permissions[subscriptionType].filter((s) => flag.includes(s))
		: permissions[subscriptionType].includes(flag)
}

export {checkSubscription}
