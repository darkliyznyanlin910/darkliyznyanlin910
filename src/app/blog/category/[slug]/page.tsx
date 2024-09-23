import BlogCard from "@/components/blog/BlogCard";
import { api } from "@/trpc/server";

export interface Props {
  params: { slug: string };
}

export default async function BlogsByCategory({ params }: Props) {
  const blogs = await api.blog.getMany({ category: params.slug });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-start gap-2">
        <h1 className="text-lg font-semibold text-white">
          Blogs posts in category:{" "}
        </h1>
        <span className="rounded-full border border-green px-2 text-base text-green">
          {params.slug}
        </span>
      </div>
      {blogs.map((blog) => (
        <BlogCard key={blog.sys.id} blog={blog} />
      ))}
    </div>
  );
}
