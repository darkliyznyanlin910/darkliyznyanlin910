import CategoryPill from "@/components/blog/CategoryPill";
import MarkdownRender from "@/components/MarkdownRenderer";
import { api } from "@/trpc/server";
import { format } from "date-fns";

export interface Props {
  params: { slug: string };
}

export default async function BlogPost({ params }: Props) {
  const blog = await api.blog.getOne({ slug: params.slug });
  return (
    <div className="py-4">
      {!blog ? (
        <p>Blog not found.</p>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{blog.fields.title}</h1>
            <div className="flex flex-wrap gap-2">
              {blog.fields.categories?.map((category) => (
                <CategoryPill key={category.sys.id} category={category} />
              ))}
            </div>
            <p className="text-muted-foreground">
              Posted at:{" "}
              {format(new Date(blog.sys.createdAt), "HH:mm dd MMMM yyyy")}
            </p>
            {blog.sys.updatedAt !== blog.sys.createdAt && (
              <p className="text-muted-foreground">
                Last updated at:{" "}
                {format(new Date(blog.sys.updatedAt), "HH:mm dd MMMM yyyy")}
              </p>
            )}
          </div>
          <MarkdownRender content={blog.fields.content} />
        </div>
      )}
    </div>
  );
}
