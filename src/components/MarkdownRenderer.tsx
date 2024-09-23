"use client";

import React, { useState, useEffect } from "react";

interface MarkdownRenderProps {
  content: string;
}

const MarkdownRender: React.FC<MarkdownRenderProps> = ({ content }) => {
  const [renderedContent, setRenderedContent] = useState("");

  useEffect(() => {
    let isMounted = true;

    const renderMarkdown = async () => {
      // Import markdown-it and shiki only on the client side
      const MarkdownIt = (await import("markdown-it")).default;
      const Shiki = (await import("@shikijs/markdown-it")).default;

      const md = new MarkdownIt();

      const shiki = await Shiki({
        themes: {
          light: "github-dark",
          dark: "github-dark",
        },
      });

      md.use(shiki);

      if (isMounted) {
        const result = md.render(content);
        setRenderedContent(result);
      }
    };

    renderMarkdown();

    return () => {
      isMounted = false;
    };
  }, [content]);

  // Render a placeholder during SSR or while content is being processed
  if (typeof window === "undefined" || !renderedContent) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="prose"
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
};

export default MarkdownRender;
