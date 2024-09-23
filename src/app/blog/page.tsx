import BlogCard from "@/components/blog/BlogCard";
import { api } from "@/trpc/server";

export default async function BlogsPage() {
  const blogs = await api.blog.getMany();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-start gap-2">
        <h1 className="text-lg font-semibold text-white">Blog Posts</h1>
      </div>
      {blogs.map((blog) => (
        <BlogCard key={blog.sys.id} blog={blog} />
      ))}
    </div>
  );
}
