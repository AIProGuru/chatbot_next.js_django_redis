import striptags from "striptags"

function stripTags(html: any) {
	// const tmp = document.implementation.createHTMLDocument("New").body
	// tmp.innerHTML = html
	// return tmp.textContent || tmp.innerText || ""
	return striptags(html, ["<br/>", "<br>"], "\n").replace(/&nbsp;/g, "")
}

export {stripTags}
