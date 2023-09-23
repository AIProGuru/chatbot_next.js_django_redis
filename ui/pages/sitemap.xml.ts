// import makeApiUrl from "../src/api"
// import ViewedBlogIcon from "@/components/ui/Icons/ViewedBlog/ViewedBlogIcon"
import {wrapper} from "@/redux/store"
import {
	seoActicles,
	seoBlogs,
	seoForum,
	seoSection,
} from "@/services/anonymous.service"
// import {getBlogs, getForums} from "@/services/blog.service"
// import fs from "fs"
import getConfig from "next/config"

const {publicRuntimeConfig} = getConfig()

function SitemapXml() {}

export const getServerSideProps = wrapper.getServerSideProps((store) => {
	return async (context: any) => {
		const baseUrl = publicRuntimeConfig?.baseUrl || ""

		const blogsData = await store.dispatch(seoBlogs.initiate({}))

		const forumsData = await store.dispatch(seoForum.initiate({}))

		const articlesData = await store.dispatch(seoActicles.initiate({}))

		const sectionData = await store.dispatch(seoSection.initiate({}))

		console.log(articlesData?.data)

		const urls = [
			"",
			"/articles",
			"/blogs",
			"/forum",
			"/auth/forgot",
			"/auth/logout",
			"/auth/profile",
			"/auth/signin",
			"/auth/signup",
			"/blogs/create",
			"/forum/create",
			"/pages/contact-us/contact",
		]

		const staticPages = urls.map((route) => {
			return `${baseUrl}${route}`
		})

		console.log(staticPages.length + sectionData?.data.length + articlesData?.data.length + forumsData?.data.length + blogsData?.data.length)

		// generator
		const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">    
    ${staticPages
		.map((page) => {
			return `
            <url>
                <loc>${page}</loc>
                <changefreq>monthly</changefreq>
                <priority>1.0</priority>
              </url>
        `
		})
		.join("")}
    ${sectionData?.data
		?.map((section: any) => {
			return `
            <url>
                <loc>${baseUrl}/articles/${section?.id}</loc>
                <changefreq>monthly</changefreq>
                <priority>1.0</priority>
              </url>
        `
		})
		.join("")}
	${articlesData?.data
		?.map((article: any) => {
			return `
				<url>
						<loc>${
							baseUrl +
							`/articles/${article?.section_id}/` +
							encodeURIComponent(article?.slug)
						}</loc>
						<lastmod>${new Date(article.updated).toISOString()}</lastmod>
						<changefreq>monthly</changefreq>
						<priority>1.0</priority>
					</url>
		`
		})
		.join("")}
	${forumsData?.data
		?.map((forum: any) => {
			return `
				<url>
						<loc>${baseUrl + "/forum/" + encodeURIComponent(forum?.slug)}</loc>
						<lastmod>${new Date(forum.updated).toISOString()}</lastmod>
						<changefreq>monthly</changefreq>
						<priority>1.0</priority>
					</url>
		`
		})
		.join("")}
	${blogsData?.data
		?.map((blog: any) => {
			return `
				<url>
						<loc>${baseUrl + "/blogs/" + encodeURIComponent(blog?.slug)}</loc>
						<lastmod>${new Date(blog.updated).toISOString()}</lastmod>
						<changefreq>monthly</changefreq>
						<priority>1.0</priority>
					</url>
		`
		})
		.join("")}
	</urlset>
	`

		context.res.setHeader("Content-Type", "text/xml")
		context.res.write(sitemap)
		context.res.end()

		return {
			props: {},
		}
	}
})

export default SitemapXml
