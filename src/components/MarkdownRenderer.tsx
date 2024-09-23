interface MarkdownRenderProps {
  content: string;
}

const MarkdownRender = async ({ content }: MarkdownRenderProps) => {
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

  return (
    <div
      className="prose"
      dangerouslySetInnerHTML={{ __html: md.render(content) }}
    />
  );
};

export default MarkdownRender;
