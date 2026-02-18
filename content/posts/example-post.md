---
title: Example Post
slug: example-post
categories:
  - development
---

## Introduction

This is an example post demonstrating the markdown-to-Payload pipeline.

You can use **bold**, *italic*, ***bold and italic***, ~~strikethrough~~, and `inline code` formatting.

## Code Examples

Here's a TypeScript example:

```typescript
interface Post {
  title: string
  slug: string
  content: LexicalJSON
}
```

And a shell command:

```bash
bun run create-post content/posts/example-post.md
```

## Lists

- First item
- Second item with **bold**
- Third item

1. Ordered first
2. Ordered second
3. Ordered third

## Blockquote

> This is a blockquote with some *emphasized* text.

## Links

Check out [Payload CMS](https://payloadcms.com) for more info.

---

That's it for the example!
