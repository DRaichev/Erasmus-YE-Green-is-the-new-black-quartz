import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzComponent } from "./quartz/components/types"
import { h } from "preact"

// Custom footer component
const CustomFooter: QuartzComponent = () => {
  const year = new Date().getFullYear()
  return h("footer", null, h("p", null, `Created by 7 © ${year}`))
}
CustomFooter.css = `
footer {
  text-align: left;
  margin-bottom: 4rem;
  opacity: 0.7;
}
`

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: CustomFooter,
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      filterFn: (node) => {
        return node.data?.frontmatter?.hide !== true
      },
      sortFn: (a, b) => {
        if ((!a.data?.filePath && !b.data?.filePath) || (!a.data?.filePath && b.data?.filePath)) {
          return 0
        } else if (a.data?.filePath && !b.data?.filePath) {
          return 1
        } else if (a.data?.filePath && b.data?.filePath) {
          return a.data.filePath.localeCompare(b.data.filePath)
        }
        return 0
      }
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      filterFn: (node) => {
        // Hide pages with the hide tag or hide: true in frontmatter
        if (node.data?.tags?.includes("hide")) {
          return false;
        }
        // Keep the default filter behavior for other pages
        return node.slugSegment !== "tags";
      },
    }),
  ],
  right: [],
}
