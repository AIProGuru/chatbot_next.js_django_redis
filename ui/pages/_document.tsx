import Document, {
  Html,
  Head,
  Main,
  NextScript, 
  DocumentContext,
} from "next/document"
import { useRouter } from "next/router"


class MyDocument extends Document {
	static async getInitialProps(ctx:DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx)
		return {...initialProps, locale: ctx?.locale || "en"}
	}

	render() {
		return (
			<Html dir={this.props.locale === "he" ? "rtl" : "ltr"}>
				<Head />
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument