import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeBlogFields {
  title: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  seoImage: EntryFieldTypes.AssetLink;
  description: EntryFieldTypes.Text;
  categories?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeCategorySkeleton>
  >;
  content: EntryFieldTypes.Text;
}

export type TypeBlogSkeleton = EntrySkeletonType<TypeBlogFields, "blog">;
export type TypeBlog<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeBlogSkeleton, Modifiers, Locales>;

export interface TypeCategoryFields {
  slug: EntryFieldTypes.Symbol;
  name: EntryFieldTypes.Symbol;
}

export type TypeCategorySkeleton = EntrySkeletonType<
  TypeCategoryFields,
  "category"
>;
export type TypeCategory<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeCategorySkeleton, Modifiers, Locales>;
