import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex h-[calc(100dvh-144px)] w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
        <div className="relative size-40 min-w-40 md:size-80 md:min-w-80">
          <Image
            src={"/Johnny.JPG"}
            alt="Profile Picture"
            fill
            className="rounded-2xl object-cover shadow-lg"
          />
        </div>
        <div className="flex-grow space-y-2">
          <h1 className="h1">
            Hi I&apos;m <span className="text-green">Johnny Lin</span>,
          </h1>
          <p>
            Thank you for visiting my portfolio website! I am currently studying
            Information Systems in Singapore Management University (SMU). To
            learn more about my qualifications and experience, you can explore
            other sections in my website, and don&apos;t forget to download my
            resume to see what I can offer. Thank you!
          </p>
          <div className="flex items-center justify-start gap-2">
            <Button variant={"green"} size={"sm"}>
              <Link
                href={
                  "https://knl-personal-bucket.s3.ap-southeast-1.amazonaws.com/KaungNyanLin_Resume.pdf"
                }
                target="_blank"
              >
                Download Resume <span aria-hidden="true">→</span>
              </Link>
            </Button>
            <Button variant={"outline"} size={"icon"} className="rounded-full">
              <Link
                href={"https://github.com/darkliyznyanlin910"}
                target="_blank"
              >
                <Github size={16} />
              </Link>
            </Button>
            <Button variant={"outline"} size={"icon"} className="rounded-full">
              <Link
                href={"https://www.linkedin.com/in/kaung-nyan-lin/"}
                target="_blank"
              >
                <Linkedin size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
