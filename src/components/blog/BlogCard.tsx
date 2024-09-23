"use client";

import React from "react";
import Image from "next/image";
import type { FullBlog } from "@/utils/contentful";
import CategoryPill from "./CategoryPill";
import { useRouter } from "next/navigation";

interface BlogCardProps {
  blog: FullBlog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const router = useRouter();
  const truncate = (str: string, num: number) => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-lg border border-background bg-background shadow-md hover:border-green"
      onClick={() => router.push(`/blog/${blog.fields.slug}`)}
    >
      {blog.fields.seoImage && (
        <div className="relative h-48 w-full">
          <Image
            src={"https:" + blog.fields.seoImage.fields.file!.url}
            alt={blog.fields.seoImage.fields.title ?? ""}
            layout="fill"
            className="object-contain"
          />
        </div>
      )}
      <div className="p-6">
        <h2 className="mb-2 text-xl font-semibold text-green">
          {blog.fields.title}
        </h2>
        {blog.fields.description && (
          <p className="mb-2 text-muted-foreground">
            {truncate(blog.fields.description, 100)}
          </p>
        )}
        <div className="mb-4 flex flex-wrap gap-2">
          {blog.fields.categories?.map((category) => (
            <CategoryPill key={category.sys.id} category={category} />
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatDate(blog.sys.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
