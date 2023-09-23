
export const accountTypes: any = {
    man: 'MAN',
    woman: 'WOMAN',
    couple: 'COUPLE',

    isCouple: (type: any)=>(type === accountTypes.couple),
    isMan: (type: any)=>(type === accountTypes.man),
    isWoman: (type: any)=>(type === accountTypes.woman),
    useManAge: (type: any)=>([accountTypes.man, accountTypes.couple].includes(type)),
    useWomanAge: (type: any)=>([accountTypes.woman, accountTypes.couple].includes(type)),
}

export const profileManWomanTypes: any = {
    man: 'man',
    woman: 'woman',
}