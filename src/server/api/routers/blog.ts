import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  contentfulClient,
  localDevCache,
  resolveCategories,
} from "@/utils/contentful";
import type { TypeBlogSkeleton } from "@/types/contentful";

export const blogRouter = createTRPCRouter({
  getMany: publicProcedure
    .input(
      z
        .object({
          category: z.string(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const fromContentful = contentfulClient.getEntries<TypeBlogSkeleton>({
        content_type: "blog",
        include: 2,
        ...(!!input
          ? {
              "fields.categories[exists]": input.category,
            }
          : {}),
      });

      const res = await localDevCache(
        fromContentful,
        `blogs${input?.category ? "-" + input.category : ""}.json`,
      );

      return res?.items.map((blog) => resolveCategories(blog)) ?? [];
    }),
  getOne: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const fromContentful = contentfulClient.getEntries<TypeBlogSkeleton>({
        content_type: "blog",
        "fields.slug": input.slug,
        include: 2,
      });

      const res = await localDevCache(
        fromContentful,
        `blog-${input.slug}.json`,
      );

      return res?.items.map((blog) => resolveCategories(blog))[0] ?? null;
    }),
});
