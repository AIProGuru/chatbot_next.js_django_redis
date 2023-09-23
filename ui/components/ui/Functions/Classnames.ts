function cc(classNames: any[]) {
	return classNames.filter((className) => className).join(" ")
}

export {cc, cc as classnames}
