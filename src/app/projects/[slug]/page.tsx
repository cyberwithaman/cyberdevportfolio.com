import ProjectSlug from "@/app/components/Project/ProjectSlug";
import { Metadata, ResolvingMetadata } from "next";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
    props: Props,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parent: ResolvingMetadata
): Promise<Metadata> {
    // Get the slug from the params
    const resolvedParams = await props.params;
    const slug = resolvedParams.slug;

    try {
        // Connect to the database
        await connectDB();

        // Fetch the project data based on the slug
        const project = await Project.findOne({ slug });

        // If project not found, return default metadata
        if (!project) {
            return {
                title: "Project Not Found | AI-SecOps Research",
                description: "The requested project could not be found.",
            };
        }

        // Return dynamic metadata based on the project
        return {
            title: `${project.title} | AI-SecOps Research`,
            description: project.description,
            keywords: project.technologies.join(", ") + ", cybersecurity, AI-SecOps, security solutions",
            openGraph: {
                title: project.title,
                description: project.description,
                images: project.imageUrl ? [project.imageUrl] : undefined,
            },
        };
    } catch (error) {
        console.error("Error fetching project metadata:", error);

        // Fallback to default metadata if there's an error
        return {
            title: "Project | AI-SecOps Research",
            description: "Explore our projects and research in AI-SecOps.",
        };
    }
}

export default function ProjectSlugPage() {
    return <ProjectSlug />;
}