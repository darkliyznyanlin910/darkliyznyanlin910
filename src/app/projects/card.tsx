import Link from "next/link";

export type Project = {
  image: React.ReactNode;
  title: string;
  link: string;
  children: React.ReactNode;
};

export default function ProjectCard({ image, link, title, children }: Project) {
  return (
    <div className="hover:border-green relative flex flex-col justify-between overflow-hidden rounded-md border">
      <div className="flex items-center space-x-4 p-2 pl-5">
        <p className="text-lg font-medium leading-6 md:text-xl">
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="h-full rounded-md before:absolute before:inset-0 before:content-[''] hover:no-underline focus:no-underline active:no-underline"
          >
            {title}
          </Link>
        </p>
      </div>
      <div className="m-6 text-sm subpixel-antialiased md:text-base">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="col-span-1">{image}</div>
          <div className="col-span-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
