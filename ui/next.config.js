/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config")

const ContentSecurityPolicy = `
	default-src * 'unsafe-inline' 'unsafe-eval' http://localhost:* https://*.swingers.co.il https://swingers.co.il data:;
	script-src * 'unsafe-inline' 'unsafe-eval' http://localhost:* https://*.swingers.co.il https://swingers.co.il;
	script-src-elem * 'unsafe-inline' 'unsafe-eval' http://localhost:* https://*.swingers.co.il https://swingers.co.il;
	script-src-attr * 'unsafe-inline' 'unsafe-eval' http://localhost:* https://*.swingers.co.il https://swingers.co.il;
	style-src * 'unsafe-inline' http://localhost:* https://*.swingers.co.il https://swingers.co.il;
	style-src-elem * 'unsafe-inline' http://localhost:* https://*.swingers.co.il https://swingers.co.il;
	style-src-attr * 'unsafe-inline' http://localhost:* https://*.swingers.co.il https://swingers.co.il;
	font-src * http://localhost:* https://*.swingers.co.il https://swingers.co.il https://fonts.googleapis.com data:;
	img-src * http://localhost:* https://*.swingers.co.il https://swingers.co.il data:;
`

const securityHeaders = [
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
	{
		key: "X-Frame-Options",
		value: "SAMEORIGIN",
	},
	{
		key: "X-XSS-Protection",
		value: "1; mode=block",
	},
	{
		key: "Strict-Transport-Security",
		value: "max-age=63072000; includeSubDomains; preload",
	},
	{
		key: "Content-Security-Policy",
		value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
	},
	{
		key: "Referrer-Policy",
		value: "origin-when-cross-origin",
	},
	{
		key: "Permissions-Policy",
		value: 'camera=(), microphone=(), geolocation=(self "https://dev.swingers.co.il" "https://swingers.co.il" "http://localhost:3000")',
	},
]

module.exports = {
	async headers() {
		return [
			{
				// Apply these headers to all routes in your application.
				source: "/:path*",
				headers: securityHeaders,
			},
		]
	},
	async redirects() {
		return [
			{
				source: "/%D7%94%D7%A6%D7%94%D7%A8%D7%AA-%D7%A4%D7%A8%D7%98%D7%99%D7%95%D7%AA",
				destination: "/pages/privacy",
				permanent: true,
			},
			{
				source: "/%D7%A6%D7%A8%D7%95-%D7%A7%D7%A9%D7%A8",
				destination: "/pages/contact-us/contact",
				permanent: true,
			},
			{
				source: "/viewedUs.html",
				destination: "/peek-at-me",
				permanent: true,
			},
			{
				source: "/availabletoday.html",
				destination: "/available-today",
				permanent: true,
			},
			{
				source: "/mailbox.html",
				destination: "/",
				permanent: true,
			},
			{
				source: "/Etiquette",
				destination: "/articles/154/etiquette",
				permanent: true,
			},
			{
				source: "/%D7%94%D7%91%D7%9C%D7%95%D7%92%D7%99%D7%9D-%D7%94%D7%A0%D7%A6%D7%A4%D7%99%D7%9D-%D7%91%D7%99%D7%95%D7%AA%D7%A8",
				destination: "/blogs",
				permanent: true,
			},
			{
				source: "/newblogpost.html",
				destination: "/blogs",
				permanent: true,
			},
			{
				source: "/CLUB",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/do",
				destination: "/",
				permanent: true,
			},
			{
				source: "/%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1",
				destination:
					"/articles/3/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1-%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%A4%D7%A8%D7%95%D7%A4%D7%99%D7%9C-%D7%9E%D7%95%D7%95%D7%93%D7%90",
				destination:
					"/articles/51/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%A4%D7%A8%D7%95%D7%A4%D7%99%D7%9C-%D7%9E%D7%95%D7%95%D7%93%D7%90",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA",
				destination:
					"/articles/3/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1-%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1",
				permanent: true,
			},
			{
				source: "/%D7%A7%D7%94%D7%99%D7%9C%D7%AA_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%96%D7%95%D7%92%D7%95%D7%AA_%D7%9E%D7%95%D7%9E%D7%9C%D7%A6%D7%99%D7%9D",
				destination:
					"/articles/8/%D7%A7%D7%94%D7%99%D7%9C%D7%AA-%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%91%D7%99%D7%A9%D7%A8%D7%90%D7%9C",
				permanent: true,
			},
			{
				source: "/%D7%A7%D7%94%D7%99%D7%9C%D7%AA_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%96%D7%95%D7%92%D7%95%D7%AA_%D7%9E%D7%95%D7%9E%D7%9C%D7%A6%D7%99%D7%9D",
				destination:
					"/articles/8/%D7%A7%D7%94%D7%99%D7%9C%D7%AA-%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%91%D7%99%D7%A9%D7%A8%D7%90%D7%9C",
				permanent: true,
			},
			{
				source: "/%D7%A7%D7%94%D7%99%D7%9C%D7%AA_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%A8%D7%A9%D7%AA_%D7%90%D7%A7%D7%A1%D7%A7%D7%9C%D7%99%D7%91%D7%A8",
				destination:
					"/articles/8/%D7%A7%D7%94%D7%99%D7%9C%D7%AA-%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%A8%D7%A9%D7%AA-%D7%90%D7%A7%D7%A1%D7%A7%D7%9C%D7%99%D7%91%D7%A8",
				permanent: true,
			},
			{
				source: "/%25D7%2596%25D7%2595%25D7%2592%25D7%2595%25D7%25AA_%25D7%25A0%25D7%25A9%25D7%2595%25D7%2590%25D7%2599%25D7%259D_%25D7%259C%25D7%2590%25D7%2597%25D7%25A8%25D7%2599%25D7%259D/%25D7%2594%25D7%25A1%25D7%2595%25D7%2595%25D7%2599%25D7%25A0%25D7%2592%25D7%25A8%25D7%2599%25D7%259D&ved=2ahUKEwjR9smxisn3AhXb7rsIHbrdDrMQ0gIoBHoECBAQBg&usg=AOvVaw0fgSXPssfBF_2kvH0iFL6S",
				destination:
					"/articles/47/%D7%90%D7%95%D7%93%D7%95%D7%AA-%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%A0%D7%A9%D7%95%D7%90%D7%99%D7%9D-%D7%9C%D7%90%D7%97%D7%A8%D7%99%D7%9D",
				permanent: true,
			},
			{
				source: "/4play-swingers-club",
				destination: "/articles/155/מועדון-4play",
				permanent: true,
			},
			{
				source: "/%D7%9E%D7%A1%D7%99%D7%91%D7%AA_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%98%D7%99%D7%A4%D7%99%D7%9D_%D7%9C%D7%A7%D7%94%D7%99%D7%9C%D7%AA_%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1",
				destination: "/articles/155/מועדון-4play",
				permanent: true,
			},
			{
				source: "/23.2-swingers-party",
				destination: "/articles/155/מועדון-4play",
				permanent: true,
			},
			{
				source: "/online.html",
				destination: "/",
				permanent: true,
			},
			{
				source: "/20.3",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/15.3",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/11.1",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/20.2",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/halloween-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/23.2-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/CLUB",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/fun42-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/lingerie-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/4PLAY",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/23.6-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/6.4-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/adults-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/underground-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/12.1-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/3.5",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/21.12",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/9.8",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/5.7",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/2.11",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/11.08-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/10-07",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/18.12-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/22.7",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/28.12",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/14.8-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/23.3-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/25.8-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/4.1",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/13.8.21",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/21.9",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/25.6.21",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/31.10",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/22.3.21",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/10.6-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/20.1.22",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/2019-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/1.12-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/13.7-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/17.8-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/2017-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/10.2-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/27.9-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/30.9-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/12.11.21",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/20.4-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/27.7-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/14.11.14-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/12.02-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/14.10-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/30.6-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/20.3",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/15.3",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/11.1",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/20.2",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/halloween-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/23.2-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/CLUB/",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/fun42-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/lingerie-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/4PLAY",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/23.6-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/6.4-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/adults-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/underground-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/12.1-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/3.5",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/21.12",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/9.8",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/5.7",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/2.11",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/11.08-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/10-07",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/18.12-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/22.7",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/il/28.12",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/14.8-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/23.3-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/25.8-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/4.1",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/13.8.21",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/21.9",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/25.6.21",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/31.10",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/22.3.21",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/10.6-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/20.1.22",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/2019-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/1.12-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/13.7-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/17.8-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/2017-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/10.2-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/27.9-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/30.9-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/12.11.21",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/20.4-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/27.7-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/14.11.14-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/12.02-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/14.10-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/30.6-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/private-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/fetish-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/halloween-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/23.2-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/fun42-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/lingerie-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/23.6-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/6.4-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/adults-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/underground-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/12.1-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/11.08-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/18.12-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/14.8-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/23.3-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/25.8-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/28.4-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/10.6-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/2019-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/1.12-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/13.7-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/17.8-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/2017-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/10.2-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/27.9-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/30.9-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/20.4-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/27.7-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/14.11.14-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/12.02-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/14.10-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/30.6-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/6.9-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/4.11-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/6.10-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/8.7-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/8.6-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/dance-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/lips-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/erotic-dress-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/games-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/min-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/leg-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/milf-swingersparty",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/darks-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/massage-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/orali-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/purim2018-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/purim-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/swingers-party-20.3",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/voy-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/suca-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/visit-couples-swingers-purim-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/water-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1/MILF-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1/swingers-dance-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/%D7%9E%D7%A1%D7%99%D7%91%D7%AA-%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA/massage-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/%D7%9E%D7%A1%D7%99%D7%91%D7%AA-%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA/meet-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/4PLAY",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},

			{
				source: "/%D7%94%D7%97%D7%9C%D7%A4%D7%AA-%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%A9%D7%9C%D7%99%D7%A9%D7%99%D7%95%D7%AA",
				destination:
					"/articles/20/%D7%94%D7%97%D7%9C%D7%A4%D7%AA-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%A9%D7%9C%D7%99%D7%A9%D7%99%D7%95%D7%AA",
				permanent: true,
			},
			{
				source: "/%D7%A1%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1/%D7%96%D7%95%D7%92%D7%95%D7%AA_%D7%9E%D7%AA%D7%97%D7%99%D7%9C%D7%99%D7%9D",
				destination:
					"/articles/16/%D7%A1%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%9E%D7%AA%D7%97%D7%99%D7%9C%D7%99%D7%9D",
				permanent: true,
			},
			{
				source: "/%D7%A1%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1/%D7%9E%D7%A1%D7%99%D7%91%D7%AA_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA%D7%A1%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1/%D7%9E%D7%A1%D7%99%D7%91%D7%AA_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99%20%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%A4%D7%95%D7%A8%D7%95%D7%9D",
				destination: "/forum",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%A6%D7%90%D7%98_%D7%9C%D7%96%D7%95%D7%92%D7%95%D7%AA",
				destination:
					"/articles/3/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%A6%D7%90%D7%98_%D7%9C%D7%96%D7%95%D7%92%D7%95%D7%AA",
				permanent: true,
			},
			{
				source: "/private-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/%D7%9E%D7%A1%D7%99%D7%91%D7%AA_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%9B%D7%9C%D7%9C%D7%99_%D7%94%D7%AA%D7%A0%D7%94%D7%92%D7%95%D7%AA/",
				destination: "/articles/5/מסיבת-חילופי-זוגות-כללי-התנהגות",
				permanent: true,
			},
			{
				source: "/%D7%9E%D7%A1%D7%99%D7%91%D7%AA_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%9E%D7%A1%D7%99%D7%91%D7%95%D7%AA_%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92.",
				destination:
					"/articles/5/%D7%9E%D7%A1%D7%99%D7%91%D7%AA-%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%9E%D7%A1%D7%99%D7%91%D7%95%D7%AA-%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92",
				permanent: true,
			},
			{
				source: "/%D7%A1%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1/%D7%96%D7%95%D7%92_%D7%9E%D7%A4%D7%A0%D7%98%D7%96",
				destination: "/",
				permanent: true,
			},
			{
				source: "/Etiquette/",
				destination: "/",
				permanent: true,
			},
			{
				source: "/%D7%A1%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1/%D7%96%D7%95%D7%92_%D7%9E%D7%A4%D7%A0%D7%98%D7%96",
				destination: "/articles/16/סוינגרס-זוג-מפנטז",
				permanent: true,
			},
			{
				source: "/%D7%96%D7%95%D7%92%D7%95%D7%AA_%D7%A0%D7%A9%D7%95%D7%90%D7%99%D7%9D_%D7%9C%D7%90%D7%97%D7%A8%D7%99%D7%9D/%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1_%D7%A9%D7%9C_%D7%A4%D7%A0%D7%90%D7%99",
				destination:
					"/articles/17/זוגות-נשואים-לאחרים-סווינגרס-של-פנאי",
				permanent: true,
			},
			{
				source: "/do",
				destination: "/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/swing",
				destination: "/articles/9/חלופי-זוגות-swing",
				permanent: true,
			},
			{
				source: "/%D7%A1%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1/%D7%96%D7%95%D7%92%D7%95%D7%AA_%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%99%D7%9D",
				destination: "/articles/16/סוינגרס-זוגות-סווינגרים",
				permanent: true,
			},
			{
				source: "/%D7%96%D7%95%D7%92%D7%95%D7%AA_%D7%A0%D7%A9%D7%95%D7%90%D7%99%D7%9D_%D7%9C%D7%90%D7%97%D7%A8%D7%99%D7%9D/%D7%94%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%99%D7%9D",
				destination: "/articles/17/זוגות-נשואים-לאחרים-הסווינגרים",
				permanent: true,
			},
			{
				source: "/%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA_%D7%92%D7%95%D7%9C%D7%A9%D7%99%D7%9D/%D7%AA%D7%9E%D7%95%D7%A0%D7%94_%D7%A8%D7%90%D7%A9%D7%99%D7%AA_%D7%A9%D7%9C_%D7%96%D7%95%D7%92",
				destination: "/articles/50/תמונות-גולשים-תמונה-ראשית-של-זוג",
				permanent: true,
			},
			{
				source: "/%D7%94%D7%97%D7%9C%D7%A4%D7%AA_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA_%D7%A8%D7%95%D7%A1%D7%99%D7%9D",
				destination: "/articles/11/החלפת-זוגות-חילופי-זוגות-רוסים",
				permanent: true,
			},
			{
				source: "/%D7%90%D7%AA%D7%A8_%D7%94%D7%97%D7%9C%D7%A4%D7%AA_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%90%D7%AA%D7%A8%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA",
				destination: "/articles/14/אתר-החלפת-זוגות-אתרי-זוגות",
				permanent: true,
			},
			{
				source: "/%D7%A1%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1/%D7%A9%D7%9C%D7%91%D7%99_Swingers",
				destination: "/articles/16/סוינגרס-שלבי-swingers",
				permanent: true,
			},
			{
				source: "/%D7%94%D7%9B%D7%A8%D7%95%D7%99%D7%95%D7%AA_%D7%9C%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%99%D7%9D_%D7%98%D7%95%D7%A8%D7%A4%D7%99%D7%9D",
				destination: "/articles/20/הכרויות-לזוגות-סווינגרים-טורפים",
				permanent: true,
			},
			{
				source: "/%D7%94%D7%91%D7%9C%D7%95%D7%92%D7%99%D7%9D-%D7%94%D7%A0%D7%A6%D7%A4%D7%99%D7%9D-%D7%91%D7%99%D7%95%D7%AA%D7%A8",
				destination: "/blogs",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/swinging",
				destination:
					"/articles/3/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-swinging",
				permanent: true,
			},
			{
				source: "/%D7%94%D7%99%D7%9B%D7%A8%D7%95%D7%99%D7%95%D7%AA_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%90%D7%AA%D7%A8%D7%99_%D7%94%D7%9B%D7%A8%D7%95%D7%99%D7%95%D7%AA_%D7%9C%D7%A0%D7%A9%D7%99%D7%9D",
				destination: "/",
				permanent: true,
			},
			{
				source: "/%D7%94%D7%99%D7%9B%D7%A8%D7%95%D7%99%D7%95%D7%AA_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%90%D7%AA%D7%A8%D7%99_%D7%94%D7%9B%D7%A8%D7%95%D7%99%D7%95%D7%AA_%D7%9C%D7%A0%D7%A9%D7%99%D7%9D",
				destination: "/articles/49/היכרויות-זוגות-אתרי-הכרויות-לנשים",
				permanent: true,
			},
			{
				source: "/birthdayscouple.html",
				destination: "/",
				permanent: true,
			},
			{
				source: "/%D7%9E%D7%A1%D7%99%D7%91%D7%AA_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%98%D7%99%D7%A4%D7%99%D7%9D_%D7%9C%D7%A7%D7%94%D7%99%D7%9C%D7%AA_%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1",
				destination:
					"/articles/5/מסיבת-חילופי-זוגות-טיפים-לקהילת-סווינגרס",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA_%D7%91%D7%90%D7%99%D7%9C%D7%AA/%D7%94%D7%99%D7%9B%D7%A8%D7%95%D7%99%D7%95%D7%AA_%D7%9C%D7%96%D7%95%D7%92%D7%95%D7%AA",
				destination: "/articles/49/חילופי-זוגות-באילת-היכרויות-לזוגות",
				permanent: true,
			},
			{
				source: "/%D7%9E%D7%A1%D7%99%D7%91%D7%AA_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%9E%D7%A1%D7%99%D7%91%D7%95%D7%AA_%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92",
				destination: "/articles/5/מסיבת-חילופי-זוגות-מסיבות-סווינג",
				permanent: true,
			},
			{
				source: "/%D7%9E%D7%A1%D7%99%D7%91%D7%AA_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%96%D7%95%D7%92%D7%95%D7%AA_%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%99%D7%9D",
				destination: "/articles/5/מסיבת-חילופי-זוגות-זוגות-סווינגרים",
				permanent: true,
			},
			{
				source: "/%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA_%D7%92%D7%95%D7%9C%D7%A9%D7%99%D7%9D/%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA_%D7%A9%D7%9C_%D7%96%D7%95%D7%92%D7%95%D7%AA",
				destination: "/articles/50/תמונות-גולשים-תמונות-של-זוגות",
				permanent: true,
			},
			{
				source: "/%D7%94%D7%99%D7%9B%D7%A8%D7%95%D7%99%D7%95%D7%AA_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%96%D7%95%D7%92%D7%95%D7%AA",
				destination: "/en/articles/20/הכרויות-זוגות-זוגות",
				permanent: true,
			},
			{
				source: "/%D7%90%D7%AA%D7%A8_%D7%97%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1",
				destination: "/articles/13/אתר-חלופי-זוגות-סווינגרס",
				permanent: true,
			},
			{
				source: "/%D7%94%D7%97%D7%9C%D7%A4%D7%AA_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%97%D7%95%D7%A9_%D7%94%D7%95%D7%9E%D7%95%D7%A8",
				destination: "/articles/11/החלפת-זוגות-חוש-הומור",
				permanent: true,
			},
			{
				source: "/advancedsearch.html",
				destination: "/",
				permanent: true,
			},
			{
				source: "/חילופי-זוגות",
				destination: "/",
				permanent: true,
			},
			{
				source: "/search",
				destination: "/",
				permanent: true,
			},
			{
				source: "/%D7%94%D7%97%D7%9C%D7%A4%D7%AA_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%97%D7%95%D7%A9_%D7%94%D7%95%D7%9E%D7%95%D7%A8",
				destination: "/articles/11/החלפת-זוגות-חוש-הומור",
				permanent: true,
			},

			{
				source: "/%D7%97%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%96%D7%95%D7%92%D7%95%D7%AA_%D7%93%D7%AA%D7%99%D7%99%D7%9D",
				destination: "/articles/9/חלופי-זוגות-זוגות-דתיים",
				permanent: true,
			},
			{
				source: "/%D7%96%D7%95%D7%92%D7%95%D7%AA_%D7%9C%D7%A1%D7%A7%D7%A1/%D7%94%D7%9B%D7%A8%D7%95%D7%99%D7%95%D7%AA_%D7%A1%D7%A7%D7%A1%D7%99%D7%95%D7%AA",
				destination: "/articles/15/זוגות-לסקס-הכרויות-סקסיות",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%9E%D7%A1%D7%99%D7%91%D7%95%D7%AA_%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1",
				destination: "/articles/3/חילופי-זוגות-מסיבות-סווינגרס",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-21-22.10.21",
				destination: "/",
				permanent: true,
			},
			{
				source: "/%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA_%D7%92%D7%95%D7%9C%D7%A9%D7%99%D7%9D_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%9E%D7%A1%D7%99%D7%91%D7%95%D7%AA_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA",
				destination:
					"/articles/49/תמונות-גולשים-זוגות-מסיבות-חילופי-זוגות",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%A6%D7%9C%D7%A2_%D7%A0%D7%A9%D7%99%D7%AA",
				destination: "/articles/3/חילופי-זוגות-צלע-נשית",
				permanent: true,
			},
			{
				source: "/%D7%90%D7%95%D7%93%D7%95%D7%AA_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%A4%D7%A0%D7%98%D7%96%D7%99%D7%94_%D7%9E%D7%99%D7%A0%D7%99%D7%AA",
				destination: "/articles/47/אודות-חילופי-זוגות-פנטזיה-מינית",
				permanent: true,
			},
			{
				source: "/%D7%90%D7%AA%D7%A8_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%94%D7%97%D7%9C%D7%A4%D7%AA_%D7%96%D7%95%D7%92%D7%95%D7%AA",
				destination: "/articles/12/אתר-חילופי-זוגות-החלפת-זוגות",
				permanent: true,
			},
			{
				source: "/%D7%94%D7%9B%D7%A8%D7%95%D7%99%D7%95%D7%AA_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%96%D7%95%D7%92%D7%95%D7%AA_%D7%97%D7%93%D7%A9%D7%99%D7%9D",
				destination: "/articles/20/הכרויות-זוגות-זוגות-חדשים",
				permanent: true,
			},
			{
				source: "/%D7%96%D7%95%D7%92%D7%95%D7%AA_%D7%9C%D7%A1%D7%A7%D7%A1/%D7%96%D7%95%D7%92_%D7%9E%D7%91%D7%95%D7%92%D7%A8%D7%99%D7%9D",
				destination: "/articles/15/זוגות-לסקס-זוג-מבוגרים",
				permanent: true,
			},
			{
				source: "/%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA_%D7%92%D7%95%D7%9C%D7%A9%D7%99%D7%9D/%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA_%D7%A9%D7%9C_%D7%96%D7%95%D7%92%D7%95%D7%AA_%D7%91%D7%9E%D7%99%D7%99%D7%9C",
				destination: "/articles/50/תמונות-גולשים-תמונות-של-זוגות",
				permanent: true,
			},
			{
				source: "/%D7%90%D7%AA%D7%A8_%D7%94%D7%97%D7%9C%D7%A4%D7%AA_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%9E%D7%A4%D7%92%D7%A9%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA",
				destination: "/articles/14/אתר-החלפת-זוגות-מפגשי-זוגות",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%A1%D7%A7%D7%A1_%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%99",
				destination: "/articles/9/חלופי-זוגות-סקס-סווינגרי",
				permanent: true,
			},
			{
				source: "/wehavenotapproved.html",
				destination: "/",
				permanent: true,
			},
			{
				source: "/%D7%94%D7%9B%D7%A8%D7%95%D7%99%D7%95%D7%AA_%D7%9C%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%A0%D7%A2%D7%A8%D7%95%D7%AA_%D7%9C%D7%99%D7%95%D7%95%D7%99_%D7%9C%D7%9E%D7%A1%D7%99%D7%91%D7%AA_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA",
				destination:
					"/articles/20/הכרויות-לזוגות-נערות-ליווי-למסיבת-חילופי-זוגות",
				permanent: true,
			},
			{
				source: "/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%90%D7%A8%D7%95%D7%A2%D7%99%D7%9D_%D7%A4%D7%A8%D7%98%D7%99%D7%99%D7%9D_%D7%9C%D7%96%D7%95%D7%92%D7%95%D7%AA",
				destination:
					"/articles/4/מועדון-חילופי-זוגות-ארועים-פרטיים-לזוגות",
				permanent: true,
			},
			{
				source: "/%D7%9E%D7%A1%D7%99%D7%91%D7%AA-%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA",
				destination: "/articles/16/סוינגרס-מסיבת-חילופי-זוגות",
				permanent: true,
			},
			{
				source: "/%D7%A4%D7%95%D7%A8%D7%95%D7%9D_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%A7%D7%94%D7%99%D7%9C%D7%AA_%D7%97%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA",
				destination: "/articles/7/פורום-חילופי-זוגות-קהילת-חלופי-זוגות",
				permanent: true,
			},
			{
				source: "/%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA_%D7%92%D7%95%D7%9C%D7%A9%D7%99%D7%9D_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%A0%D7%A9%D7%99%D7%9D_%D7%93%D7%95_%D7%9E%D7%99%D7%A0%D7%99%D7%95%D7%AA",
				destination: "/articles/49/תמונות-גולשים-זוגות-נשים-דו-מיניות",
				permanent: true,
			},
			{
				source: "/%D7%9E%D7%A1%D7%99%D7%91%D7%AA_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%9E%D7%A1%D7%99%D7%91%D7%95%D7%AA_Swing_%D7%95%D7%A1%D7%9E%D7%99%D7%9D",
				destination:
					"/articles/5/מסיבת-חילופי-זוגות-מסיבות-swing-וסמים",
				permanent: true,
			},
			{
				source: "/%D7%90%D7%AA%D7%A8_%D7%97%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%A9%D7%95%D7%AA%D7%A4%D7%94_%D7%9C%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA",
				destination: "/articles/13/אתר-חלופי-זוגות-שותפה-לחילופי-זוגות",
				permanent: true,
			},
			{
				source: "/%D7%90%D7%AA%D7%A8_%D7%97%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%A9%D7%95%D7%AA%D7%A4%D7%94_%D7%9C%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA",
				destination: "/articles/9/חלופי-זוגות-זוגות-דתיים",
				permanent: true,
			},
			{
				source: "/%D7%9E%D7%A1%D7%99%D7%91%D7%AA_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%93%D7%99%D7%A1%D7%A7%D7%A8%D7%98%D7%99%D7%95%D7%AA_%D7%91%D7%9E%D7%A1%D7%99%D7%91%D7%95%D7%AA",
				destination: "/articles/5/מסיבת-חילופי-זוגות-דיסקרטיות-במסיבות",
				permanent: true,
			},
			{
				source: "/%D7%A6%D7%95%D7%A8%20%D7%A7%D7%A9%D7%A8",
				destination: "/pages/contact-us/contact",
				permanent: true,
			},
			{
				source: "/%D7%94%D7%91%D7%9C%D7%95%D7%92%D7%99%D7%9D-%D7%94%D7%97%D7%96%D7%A7%D7%99%D7%9D",
				destination: "/blogs",
				permanent: true,
			},
			{
				source: "/%D7%94%D7%91%D7%9C%D7%95%D7%92%D7%99%D7%9D-%D7%94%D7%A0%D7%A6%D7%A4%D7%99%D7%9D-%D7%91%D7%99%D7%95%D7%AA%D7%A8",
				destination: "/blogs",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%91%D7%9C%D7%95%D7%92",
				destination: "/blogs",
				permanent: true,
			},
			{
				source: "/%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA-%D7%9C%D7%A4%D7%A8%D7%95%D7%A4%D7%99%D7%9C-%D7%9E%D7%95%D7%95%D7%93%D7%90",
				destination: "/articles/51/חילופי-זוגות-פרופיל-מוודא",
				permanent: true,
			},
			{
				source: "/19.10-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/bar-swingers-meeting",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/2sea-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/8.8",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/bar",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/sexy-swingers-party",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/1.2",
				destination:
					"/articles/155/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-4play",
				permanent: true,
			},
			{
				source: "/%D7%A6%D7%A8%D7%95%20%D7%A7%D7%A9%D7%A8",
				destination: "/pages/contact-us/contact",
				permanent: true,
			},
			{
				source: "/index.php",
				destination: "/pages/contact-us/contact",
				permanent: true,
			},
			{
				source: "/mypics.html",
				destination: "/pages/contact-us/contact",
				permanent: true,
			},
			{
				source: "/profilefinalization.html",
				destination: "/profiles/my/edit",
				permanent: true,
			},
			{
				source: "/profileEdit.php",
				destination: "/profiles/my/edit",
				permanent: true,
			},
			{
				source: "/register/rsp/couple.html",
				destination: "/",
				permanent: true,
			},
			{ source: "/myviews.html", destination: "/", permanent: true },
			{ source: "/messagedus.html", destination: "/", permanent: true },
			{
				source: "/register.html",
				destination: "/auth/signup",
				permanent: true,
			},
			{
				source: "/welcome_sms",
				destination: "/auth/signin",
				permanent: true,
			},
			{ source: "/new_swingers_site", destination: "/", permanent: true },
			{
				source: "/%D7%A4%D7%95%D7%A8%D7%95%D7%9D_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1",
				destination: "/articles/7/פורום-חילופי-זוגות-סווינגרס",
				permanent: true,
			},
			{
				source: "/%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA_%D7%92%D7%95%D7%9C%D7%A9%D7%99%D7%9D_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA_%D7%A9%D7%9C_%D7%96%D7%95%D7%92%D7%95%D7%AA",
				destination:
					"/articles/49/%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA-%D7%92%D7%95%D7%9C%D7%A9%D7%99%D7%9D-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA-%D7%A9%D7%9C-%D7%96%D7%95%D7%92%D7%95%D7%AA",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA_%D7%93%D7%AA%D7%99%D7%99%D7%9D/%D7%96%D7%95%D7%92%D7%95%D7%AA_%D7%93%D7%AA%D7%99%D7%99%D7%9D",
				destination:
					"/articles/49/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%93%D7%AA%D7%99%D7%99%D7%9D-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%93%D7%AA%D7%99%D7%99%D7%9D",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA_%D7%93%D7%AA%D7%99%D7%99%D7%9D/%D7%96%D7%95%D7%92",
				destination:
					"/articles/49/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%93%D7%AA%D7%99%D7%99%D7%9D-%D7%96%D7%95%D7%92",
				permanent: true,
			},
			{
				source: "/%D7%90%D7%AA%D7%A8_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%99%D7%9D",
				destination:
					"/articles/12/%D7%90%D7%AA%D7%A8-%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%99%D7%9D",
				permanent: true,
			},
			{
				source: "/%D7%96%D7%95%D7%92%D7%95%D7%AA_%D7%9C%D7%A1%D7%A7%D7%A1/%D7%90%D7%99%D7%A9%D7%94_%D7%9C%D7%A9%D7%9C%D7%99%D7%A9%D7%99%D7%94",
				destination:
					"/articles/15/%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%9C%D7%A1%D7%A7%D7%A1-%D7%90%D7%99%D7%A9%D7%94-%D7%9C%D7%A9%D7%9C%D7%99%D7%A9%D7%99%D7%94",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA_%D7%93%D7%AA%D7%99%D7%99%D7%9D/%D7%93%D7%95_%D7%9E%D7%99%D7%A0%D7%99%D7%AA",
				destination:
					"/articles/49/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%93%D7%AA%D7%99%D7%99%D7%9D-%D7%93%D7%95-%D7%9E%D7%99%D7%A0%D7%99%D7%AA",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%90%D7%99%D7%A0%D7%93%D7%A7%D7%A1-%D7%90%D7%AA%D7%A8%D7%99%D7%9D",
				destination: "/articles/",
				permanent: true,
			},
			{
				source: "/%D7%94%D7%99%D7%9B%D7%A8%D7%95%D7%99%D7%95%D7%AA_%D7%9C%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%96%D7%95%D7%92%D7%95%D7%AA_%D7%9C%D7%A1%D7%A7%D7%A1",
				destination:
					"/articles/49/%D7%94%D7%99%D7%9B%D7%A8%D7%95%D7%99%D7%95%D7%AA-%D7%9C%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%9C%D7%A1%D7%A7%D7%A1",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%A6%D7%9C%D7%A2_%D7%A9%D7%9C%D7%99%D7%A9%D7%99%D7%AA",
				destination:
					"/articles/3/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%A6%D7%9C%D7%A2-%D7%A9%D7%9C%D7%99%D7%A9%D7%99%D7%AA",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%A9%D7%9C%D7%99%D7%A9%D7%99%D7%94",
				destination:
					"/articles/3/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%A9%D7%9C%D7%99%D7%A9%D7%99%D7%94",
				permanent: true,
			},
			{
				source: "/%D7%A1%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1/%D7%96%D7%95%D7%92%D7%95%D7%AA_%D7%99%D7%A9%D7%A8%D7%90%D7%9C%D7%99%D7%9D",
				destination:
					"/articles/49/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%93%D7%AA%D7%99%D7%99%D7%9D-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%93%D7%AA%D7%99%D7%99%D7%9D",
				permanent: true,
			},
			{
				source: "/%D7%94%D7%97%D7%9C%D7%A4%D7%AA-%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%94%D7%98%D7%95%D7%91_%D7%94%D7%A8%D7%A2_%D7%95%D7%94%D7%9E%D7%9B%D7%95%D7%A2%D7%A8_%D7%91%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA",
				destination:
					"/articles/20/%D7%94%D7%97%D7%9C%D7%A4%D7%AA-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%94%D7%98%D7%95%D7%91-%D7%94%D7%A8%D7%A2-%D7%95%D7%94%D7%9E%D7%9B%D7%95%D7%A2%D7%A8-%D7%91%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA",
				permanent: true,
			},
			{
				source: "/%D7%94%D7%9B%D7%A8%D7%95%D7%99%D7%95%D7%AA_%D7%9C%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%91%D7%A2%D7%9C%20%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F%20%D7%9C%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99%20%D7%96%D7%95%D7%92%D7%95%D7%AA",
				destination:
					"/articles/20/%D7%94%D7%9B%D7%A8%D7%95%D7%99%D7%95%D7%AA-%D7%9C%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%91%D7%A2%D7%9C-%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-%D7%9C%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA",
				permanent: true,
			},
			{
				source: "/%D7%9E%D7%A1%D7%99%D7%91%D7%AA_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%9E%D7%AA%D7%97%D7%99%D7%9C%D7%99%D7%9D_%D7%91%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA",
				destination:
					"/articles/10/%D7%9E%D7%A1%D7%99%D7%91%D7%AA-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%9E%D7%AA%D7%97%D7%99%D7%9C%D7%99%D7%9D-%D7%91%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA",
				permanent: true,
			},
			{
				source: "/%D7%A4%D7%95%D7%A8%D7%95%D7%9D_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%90%D7%95%D7%A8%D7%92%D7%99%D7%94",
				destination: "/forum",
				permanent: true,
			},
			{
				source: "/%D7%A7%D7%94%D7%99%D7%9C%D7%AA_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%9E%D7%A1%D7%99%D7%91%D7%95%D7%AA_%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92",
				destination:
					"/articles/8/%D7%A7%D7%94%D7%99%D7%9C%D7%AA-%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%9E%D7%A1%D7%99%D7%91%D7%95%D7%AA-%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92",
				permanent: true,
			},
			{
				source: "/%D7%90%D7%AA%D7%A8_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%9E%D7%A1%D7%99%D7%91%D7%95%D7%AA_%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1",
				destination:
					"/articles/12/%D7%90%D7%AA%D7%A8-%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%9E%D7%A1%D7%99%D7%91%D7%95%D7%AA-%D7%A1%D7%95%D7%95%D7%99%D7%A0%D7%92%D7%A8%D7%A1",
				permanent: true,
			},
			{
				source: "/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F_%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99_%D7%96%D7%95%D7%92%D7%95%D7%AA/%D7%90%D7%99%D7%A8%D7%95%D7%A2_%D7%A4%D7%A8%D7%98%D7%99",
				destination:
					"/articles/4/%D7%9E%D7%95%D7%A2%D7%93%D7%95%D7%9F-%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%90%D7%99%D7%A8%D7%95%D7%A2-%D7%A4%D7%A8%D7%98%D7%99",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA",
				destination: "/",
				permanent: true,
			},

			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-25-26.11.21",
				destination: "/events",
				permanent: true,
			},
			{ source: "/index.php", destination: "/", permanent: true },
			{
				source: "/register.html",
				destination: "/events",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-2-3.12.21",
				destination: "/events",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-30-31.12.21",
				destination: "/events",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-21-22.10.21",
				destination: "/events",
				permanent: true,
			},
			{
				source: "/%D7%9E%D7%A1%D7%99%D7%91%D7%AA-%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%91%D7%97%D7%99%D7%A0%D7%9D",
				destination: "/events",
				permanent: true,
			},
			{ source: "/8.8", destination: "/events", permanent: true },
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-11-12.11.21",
				destination: "/events",
				permanent: true,
			},
			{ source: "/2.12.21", destination: "/events", permanent: true },
			{ source: "/9.1", destination: "/events", permanent: true },
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-27-28.1.22",
				destination: "/events",
				permanent: true,
			},
			{ source: "/6.9", destination: "/events", permanent: true },
			{ source: "/8538", destination: "/events", permanent: true },
			{ source: "/australia", destination: "/events", permanent: true },
			{ source: "/27.1.21", destination: "/events", permanent: true },
			{ source: "/14.1.22", destination: "/events", permanent: true },
			{ source: "/20.10", destination: "/events", permanent: true },
			{ source: "/30.11", destination: "/events", permanent: true },
			{ source: "/index.html", destination: "/events", permanent: true },
			{ source: "/2.07", destination: "/events", permanent: true },
			{ source: "/5.3", destination: "/events", permanent: true },
			{
				source: "/swingcentral.com",
				destination: "/events",
				permanent: true,
			},
			{ source: "/26.1", destination: "/events", permanent: true },
			{ source: "/genres", destination: "/", permanent: true },
			{ source: "/30.12.21", destination: "/events", permanent: true },
			{ source: "/5.09", destination: "/events", permanent: true },
			{ source: "/08.09", destination: "/events", permanent: true },
			{
				source: "/too-swingers-party",
				destination: "/events",
				permanent: true,
			},
			{ source: "/10.9.21", destination: "/events", permanent: true },
			{ source: "/25.6.21", destination: "/events", permanent: true },
			{ source: "/29.8", destination: "/events", permanent: true },
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99",
				destination: "/events",
				permanent: true,
			},
			{ source: "/1.6", destination: "/events", permanent: true },
			{ source: "/16.4.21", destination: "/events", permanent: true },
			{ source: "/9.3", destination: "/events", permanent: true },
			{ source: "/chile", destination: "/events", permanent: true },
			{ source: "/18.6.21", destination: "/events", permanent: true },
			{ source: "/messagedus.html", destination: "/", permanent: true },
			{ source: "/products", destination: "/events", permanent: true },
			{ source: "/colombia", destination: "/events", permanent: true },
			{ source: "/4.7", destination: "/events", permanent: true },
			{ source: "/19.8.21", destination: "/events", permanent: true },
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-17-18.2.22",
				destination: "/events",
				permanent: true,
			},
			{ source: "/20.7", destination: "/events", permanent: true },
			{ source: "/17.9.21", destination: "/events", permanent: true },
			{ source: "/bolivia", destination: "/events", permanent: true },
			{ source: "/12.9", destination: "/events", permanent: true },
			{ source: "/7.5.21", destination: "/events", permanent: true },
			{
				source: "/×ž×¡×™×‘×ª-×—×™×œ×•×¤×™-×–×•×’×•×ª",
				destination: "/events",
				permanent: true,
			},
			{ source: "/argentina", destination: "/events", permanent: true },
			{
				source: "/10.7-swingers-party",
				destination: "/events",
				permanent: true,
			},
			{ source: "/freeze.html", destination: "/events", permanent: true },
			{ source: "/20.6", destination: "/events", permanent: true },
			{ source: "/18.6", destination: "/events", permanent: true },
			{
				source: "/ã—â€“ã—â€¢ã—â€™-ã—å“ã—â¢ã—â ã—â„¢ã—â„¢ã—å¸",
				destination: "/",
				permanent: true,
			},
			{
				source: "/blockedus.html",
				destination: "/events",
				permanent: true,
			},
			{ source: "/19.12.19", destination: "/events", permanent: true },
			{ source: "/8.7", destination: "/events", permanent: true },
			{
				source: "/validationok.html",
				destination: "/events",
				permanent: true,
			},
			{ source: "/28.08", destination: "/events", permanent: true },
			{ source: "/02.08", destination: "/events", permanent: true },
			{ source: "/30.4.21", destination: "/events", permanent: true },
			{ source: "/4.11", destination: "/events", permanent: true },
			{ source: "/11.2.22", destination: "/events", permanent: true },
			{ source: "/21.12", destination: "/events", permanent: true },
			{ source: "/31.1", destination: "/events", permanent: true },
			{
				source: "/loggedinhomepage.html",
				destination: "/events",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-17-18.2.22",
				destination: "/events",
				permanent: true,
			},
			{ source: "/new_swingers_site", destination: "/", permanent: true },
			{ source: "/25.8", destination: "/events", permanent: true },
			{
				source: "/purim-men-dresscode",
				destination: "/events",
				permanent: true,
			},
			{ source: "/1.7.21", destination: "/events", permanent: true },
			{ source: "/15.8", destination: "/events", permanent: true },
			{ source: "/28.2", destination: "/events", permanent: true },
			{ source: "/4.10", destination: "/events", permanent: true },
			{ source: "/24.2.22", destination: "/events", permanent: true },
			{
				source: "/bar-swingers-meeting",
				destination: "/events",
				permanent: true,
			},
			{ source: "/15.12.17", destination: "/events", permanent: true },
			{ source: "/19.11.21", destination: "/events", permanent: true },
			{ source: "/8.6", destination: "/events", permanent: true },
			{
				source: "/ourfavsp.html",
				destination: "/events",
				permanent: true,
			},
			{
				source: "/morprofile.html",
				destination: "/events",
				permanent: true,
			},
			{ source: "/croatia", destination: "/events", permanent: true },
			{ source: "/17.1", destination: "/events", permanent: true },
			{ source: "/28.5.21", destination: "/events", permanent: true },
			{ source: "/austria", destination: "/events", permanent: true },
			{ source: "/16.1.20", destination: "/events", permanent: true },
			{
				source: "/love-swingers-party",
				destination: "/events",
				permanent: true,
			},
			{ source: "/cambodia", destination: "/events", permanent: true },
			{ source: "/25.2.22", destination: "/events", permanent: true },
			{ source: "/weblocked.html", destination: "/", permanent: true },
			{ source: "/about", destination: "/", permanent: true },
			{ source: "/mailhistory.html", destination: "/", permanent: true },
			{ source: "/04.05", destination: "/events", permanent: true },
			{ source: "/25.07", destination: "/events", permanent: true },
			{ source: "/10.07", destination: "/events", permanent: true },
			{ source: "/contact", destination: "/events", permanent: true },
			{ source: "/canada", destination: "/events", permanent: true },
			{ source: "/28.11.19", destination: "/events", permanent: true },
			{ source: "/16.11.17", destination: "/events", permanent: true },
			{ source: "/27.7", destination: "/events", permanent: true },
			{ source: "/29.7.21", destination: "/events", permanent: true },
			{
				source: "/wemessaged.html",
				destination: "/events",
				permanent: true,
			},
			{ source: "/9.12.21", destination: "/events", permanent: true },
			{ source: "/1.12", destination: "/events", permanent: true },
			{
				source: "/availabletoday.html",
				destination: "/events",
				permanent: true,
			},
			{ source: "/9.9.21", destination: "/events", permanent: true },
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-10-11.3.22",
				destination: "/events",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-3-4.3.22",
				destination: "/events",
				permanent: true,
			},
			{ source: "/31.12.19", destination: "/events", permanent: true },
			{ source: "/20.4", destination: "/events", permanent: true },
			{ source: "/24.10", destination: "/events", permanent: true },
			{ source: "/27.2", destination: "/events", permanent: true },
			{
				source: "/notactive.html",
				destination: "/events",
				permanent: true,
			},
			{ source: "/24.9.21", destination: "/events", permanent: true },
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-23.12.21",
				destination: "/events",
				permanent: true,
			},
			{
				source: "/be-swingers-party",
				destination: "/events",
				permanent: true,
			},
			{ source: "/14.06", destination: "/events", permanent: true },
			{
				source: "/notapprvedus.html",
				destination: "/events",
				permanent: true,
			},
			{ source: "/14.8", destination: "/events", permanent: true },
			{
				source: "/profilefinalization.html",
				destination: "/events",
				permanent: true,
			},
			{ source: "/myviews.html", destination: "/", permanent: true },
			{ source: "/1.4.22", destination: "/events", permanent: true },
			{ source: "/welcome_sms", destination: "/", permanent: true },
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-24.3.22",
				destination: "/events",
				permanent: true,
			},
			{
				source: "/purim-sexy-dresscode",
				destination: "/events",
				permanent: true,
			},
			{ source: "/23.9.21", destination: "/events", permanent: true },
			{
				source: "/ourfavsp.html",
				destination: "/events",
				permanent: true,
			},
			{ source: "/settings", destination: "/events", permanent: true },
			{
				source: "/ourfavsp.html",
				destination: "/events",
				permanent: true,
			},
			{ source: "/aaa", destination: "/", permanent: true },
			{ source: "/7.10.21", destination: "/events", permanent: true },
			{ source: "/5.12", destination: "/events", permanent: true },
			{ source: "/14.02", destination: "/events", permanent: true },
			{
				source: "/27.1-swingers-party",
				destination: "/events",
				permanent: true,
			},
			{
				source: "/mailhistory.html",
				destination: "/",
				permanent: true,
			},
			{
				source: "/birthday_tips",
				destination: "/events",
				permanent: true,
			},
			{ source: "/18.3.22", destination: "/events", permanent: true },
			{ source: "/4.9", destination: "/events", permanent: true },
			{ source: "/bahrain", destination: "/events", permanent: true },
			{ source: "/8714", destination: "/events", permanent: true },
			{ source: "/25.3", destination: "/events", permanent: true },
			{ source: "/5.4.21", destination: "/events", permanent: true },
			{ source: "/1.2", destination: "/events", permanent: true },
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-10-11.2.22",
				destination: "/events",
				permanent: true,
			},
			{ source: "/24.3.22", destination: "/events", permanent: true },
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-13-14.1.22",
				destination: "/events",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-18-19.11.21",
				destination: "/events",
				permanent: true,
			},
			{ source: "/12.3", destination: "/events", permanent: true },
			{ source: "/22.8", destination: "/events", permanent: true },
			{ source: "/3", destination: "/events", permanent: true },
			{
				source: "/weapprovedprivate.html",
				destination: "/events",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-17-18.3.22",
				destination: "/events",
				permanent: true,
			},
			{ source: "/3.10", destination: "/events", permanent: true },
			{ source: "/21.9", destination: "/events", permanent: true },
			{ source: "/20.9", destination: "/events", permanent: true },
			{ source: "/7.8", destination: "/events", permanent: true },
			{
				source: "/approvedusprivate.html",
				destination: "/",
				permanent: true,
			},
			{ source: "/1.3", destination: "/events", permanent: true },
			{ source: "/12.8.21", destination: "/events", permanent: true },
			{ source: "/13.3", destination: "/events", permanent: true },
			{ source: "/22.7.21", destination: "/events", permanent: true },
			{
				source: "/callsharon.html",
				destination: "/pages/contact-us/contact",
				permanent: true,
			},
			{ source: "/15.7.21", destination: "/events", permanent: true },
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-14-15.10.21",
				destination: "/events",
				permanent: true,
			},
			{
				source: "/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-4-5.11.21",
				destination: "/events",
				permanent: true,
			},
			{ source: "/5.8.21", destination: "/events", permanent: true },
			{ source: "/8988", destination: "/events", permanent: true },
			{ source: "/3.12.21", destination: "/events", permanent: true },
			{ source: "/27.10", destination: "/events", permanent: true },
			{ source: "/www", destination: "/", permanent: true },
			{ source: "/6.6 ", destination: "/events", permanent: true },
			{ source: "/19.9", destination: "/events", permanent: true },
			{
				source: "/rejectedpicstous.html",
				destination: "/events",
				permanent: true,
			},
			{ source: "/12.12", destination: "/events", permanent: true },
			{
				source: "/two4two-swingers-party",
				destination: "/events",
				permanent: true,
			},
			{ source: "/2.3", destination: "/events", permanent: true },
			{ source: "/13.7", destination: "/events", permanent: true },
			{ source: "/birthdays.html", destination: "/", permanent: true },
			{ source: "/29.11", destination: "/events", permanent: true },
			{ source: "/23.1", destination: "/events", permanent: true },
			{ source: "/wefavp.html", destination: "/events", permanent: true },
			{ source: "/13.11", destination: "/events", permanent: true },
			{ source: "/14.11.19", destination: "/events", permanent: true },
		]
	},
	reactStrictMode: true,
	publicRuntimeConfig: {
		// Will be available on both server and client
		apiUrl: process.env.API_URL,
		authUrl: process.env.AUTH_URL,
		captchaClientKey: process.env.CAPTCHA_CLIENT_KEY,
		measurementClientKey: process.env.MEASUREMENT_ID,
		baseUrl: process.env.BASE_URL,
		botId: process.env.BOT_ID,
		chatApiUrl: process.env.CHAT_API_URL,
	}, 
	i18n,
	images: {
		formats: ["image/webp", "image/avif"],
		domains: process.env.BUCKETS ? process.env.BUCKETS.split(",") : [],
		minimumCacheTTL: 86400,
	}
}
