import { getCollection } from "astro:content";
import rss from "@astrojs/rss";

export async function GET(context) {
  // If your case studies are in a collection called 'projects' or 'case-studies'
  const projects = await getCollection("projects");

  return rss({
    title: "Ian Polatka | UI/UX Designer",
    description: "UI/UX Designer from The Commonwealth of Kentucky",
    site: context.site,
    items: projects.map((project) => ({
      title: project.data.title,
      pubDate: project.data.pubDate,
      description: project.data.description,
      // Map directly to your custom slugs
      link: `/${project.id}/`,
    })),
  });
}
