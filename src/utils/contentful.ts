import { env } from "@/env";
import type {
  TypeBlogSkeleton,
  TypeCategorySkeleton,
} from "@/types/contentful";

import { type Asset, createClient, type Entry } from "contentful";

export const contentfulClient = createClient({
  accessToken: env.CONTENTFUL_API_KEY,
  space: env.CONTENTFUL_SPACE_ID,
});

// Imports
import { existsSync, mkdirSync, readFileSync, writeFile } from "fs"; // File system operations
import { dirname } from "path";

export async function localDevCache<T>(
  getFromContentful: Promise<T>,
  cacheFileName: string,
): Promise<T | null> {
  let data: T | null = null;

  // Skip caching in environments other than development
  if (env.NEXT_PUBLIC_NODE_ENV !== "development")
    return await getFromContentful;

  try {
    // Attempt to read data from the local cache file
    const fileData = readFileSync(`cache/${cacheFileName}`, "utf-8");
    data = JSON.parse(fileData) as T; // Parse the read data
  } catch {
    // If reading cache fails, log the status and fetch from Contentful
    console.log("No cache found, fetching from contentful");
    data = await getFromContentful;

    // Write the fetched data to the local cache
    const cacheFilePath = `cache/${cacheFileName}`;
    const directory = dirname(cacheFilePath);

    // Check if the directory exists, if not, create it
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }
    writeFile(cacheFilePath, JSON.stringify(data, null, 2), "utf8", (err) => {
      if (err) {
        // Log any errors that occur during cache writing
        console.error("Error writing to cache:", err);
        return;
      }
      // Log successful cache writing
      console.log(`Data written to cache/${cacheFileName}`);
    });
  }

  return data;
}

export type FullBlog = Omit<
  Entry<TypeBlogSkeleton, undefined, string>,
  "fields"
> & {
  fields: Omit<
    Entry<TypeBlogSkeleton, undefined, string>["fields"],
    "categories" | "seoImage"
  > & {
    categories: Entry<TypeCategorySkeleton, undefined, string>[];
    seoImage: Asset<undefined, string> | null;
  };
};

export function resolveCategories(
  blog: Entry<TypeBlogSkeleton, undefined, string>,
): FullBlog {
  return {
    ...blog,
    fields: {
      ...blog.fields,
      categories: (blog.fields.categories ?? [])
        .map((category) => {
          if ("fields" in category === false) {
            return null;
          }
          return category;
        })
        .filter((category) => !!category),
      seoImage: "fields" in blog.fields.seoImage ? blog.fields.seoImage : null,
    },
  };
}
