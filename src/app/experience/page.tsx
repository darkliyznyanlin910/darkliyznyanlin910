import { CustomTimeline, type TimelineEvent } from "@/components/Timeline";
import { Building } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Experience | Johnny Lin's Portfolio",
  description: "Here are some of the experiences I have had!",
};

const timelineEvents: TimelineEvent[] = [
  {
    logo: (
      <Image
        src={"/experience/schooloncloud.svg"}
        alt={"School on Cloud"}
        width={40}
        height={40}
      />
    ),
    icon: <Building size={30} />,
    title: "Software Engineer",
    subtitle: "School on Cloud Pte. Ltd.",
    link: "https://schooloncloud.asia",
    timeline: "Mar 2024 - Present",
    children: (
      <ul className="w-full list-inside list-disc space-y-1">
        <li>
          Designed and implemented a robust{" "}
          <span className="text-green">video transcoding pipeline</span>{" "}
          utilizing AWS services (e.g., S3, Lambda, Elastic Transcoder) and
          Terraform, enhancing media processing efficiency and scalability.
        </li>
        <li>
          Developed an extension for the{" "}
          <span className="text-green">Contentful platform</span>, enhancing the
          existing Content Management System to support additional content types
          such as videos and e-commerce, thereby increasing platform versatility
          and ease of content management.
        </li>
        <li>
          Developed a
          <span className="text-green">
            {" "}
            search engine-optimized video streaming website
          </span>
          , achieving a 40% increase in user traffic by implementing responsive
          design and advanced SEO strategies.
        </li>
      </ul>
    ),
  },
  {
    logo: (
      <Image
        src={"/experience/osiris.png"}
        alt={"Osiris"}
        width={40}
        height={40}
      />
    ),
    icon: <Building size={30} />,
    title: "Software Engineer",
    subtitle: "Osiris.sg",
    link: "https://osiris.sg",
    timeline: "Aug 2023 - Present",
    children: (
      <ul className="w-full list-inside list-disc space-y-1">
        <li>
          Designed{" "}
          <span className="text-green">
            Real-time MQTT communication schema
          </span>{" "}
          for IoT Platform.
        </li>
        <li>
          Implemented a{" "}
          <span className="text-green">
            synchronized and multi-platform authentication
          </span>
          .
        </li>
        <li>
          Devised and published a{" "}
          <span className="text-green">private NPM package</span> for
          users&apos; IoT devices to connect to Osiris Platform.
        </li>
        <li>
          Wrote <span className="text-green">technical documentation</span> to
          ease onboarding process for new developers.
        </li>
        <li>
          In charge of migrating infrastructure to{" "}
          <span className="text-green">AWS</span>.
        </li>
      </ul>
    ),
  },
  {
    logo: (
      <Image
        src={"/experience/mysfit.png"}
        alt={"Mysfit"}
        width={40}
        height={40}
      />
    ),
    icon: <Building size={30} />,
    title: "Full Stack Developer",
    subtitle: "Mysfit Pte. Ltd.",
    timeline: "Nov 2022 - May 2023",
    children: (
      <ul className="w-full list-inside list-disc space-y-1">
        <li>
          Planned website architecture, frontend -{" "}
          <span className="text-green">Next.js</span>, backend -
          <span className="text-green">NodeJS with Typescript</span>, API -{" "}
          <span className="text-green">TRPC</span>.
        </li>
        <li>Reviewed code, debugged problems, and corrected issues.</li>
        <li>Coordinated 2 developers as team lead.</li>
        <li>
          Participated in requirements gathering to solidify prerequisites and
          determine best technical solution to meet business needs.
        </li>
        <li>
          Used NodeJS, Prisma ORM and SQL/No-SQL to develop and manage
          databases.
        </li>
        <li>
          Coordinated efficient, large-scale and automated software deployments
          by setting up <span className="text-green">CI/CD pipelines</span>.
        </li>
      </ul>
    ),
  },
  {
    logo: (
      <Image
        src={"/education/sp.ico"}
        alt={"Singapore Polytechnic"}
        width={40}
        height={40}
      />
    ),
    icon: <Building size={30} />,
    title: "Software Engineer Intern",
    subtitle: "Autonomous Electric Vehicle Project @ Singapore Polytechnic",
    timeline: "Mar 2022 - Sep 2022",
    children: (
      <ul className="w-full list-inside list-disc space-y-1">
        <li>
          <span className="text-green">Achieved Distinction</span> for this
          internship project.
        </li>
        <li>
          Consulted with supervisors and initiated project goals and timeline.
        </li>
        <li>Volunteered as team leader for team of 7 internship students.</li>
        <li>
          Served as a point of contact person for my department to supervisors.
        </li>
        <li>
          <span className="text-green">
            Improved autonomous navigation system
          </span>{" "}
          and <span className="text-green">object detection algorithm</span> to
          be more reliable.
        </li>
        <li>
          Implemented private LAN network in SP campus to test remote operating
          system of Autonomous Vehicle.
        </li>
        <li>
          Implemented <span className="text-green">secured API</span> and{" "}
          <span className="text-green">website</span> for users to book
          Autonomous Vehicle.
        </li>
        <li>
          Developed <span className="text-green">better</span> and{" "}
          <span className="text-green">more optimized</span> 3D mapping
          software.
        </li>
        <li>
          Collaborated with other departments to develop a centralized
          <span className="text-green">system architecture</span>.
        </li>
      </ul>
    ),
  },
];

export default function Experience() {
  return (
    <div className="w-full">
      <CustomTimeline timelineEvents={timelineEvents} />
    </div>
  );
}
