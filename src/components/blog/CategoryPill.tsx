import type { TypeCategorySkeleton } from "@/types/contentful";
import type { Entry } from "contentful";
import Link from "next/link";

interface CategoryPillProps {
  category: Entry<TypeCategorySkeleton, undefined, string>;
}

export default function CategoryPill({ category }: CategoryPillProps) {
  return (
    <Link
      key={category.sys.id}
      className="mr-2 box-border rounded-full border border-muted bg-muted px-2 py-1 text-sm text-green hover:border-green"
      href={`/blog/category/${category.fields.slug}`}
    >
      {category.fields.name}
    </Link>
  );
}
