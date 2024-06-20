import { CustomTimeline, TimelineEvent } from "@/components/Timeline";
import { GraduationCap } from "lucide-react";
import Image from "next/image";

const timelineEvents: TimelineEvent[] = [
  {
    logo: (
      <div className="rounded p-1 dark:bg-foreground">
        <Image src={"/education/SMU.png"} alt={"SMU"} width={40} height={40} />
      </div>
    ),
    icon: <GraduationCap size={40} />,
    title: "Bachelor of Science (Information Systems)",
    subtitle: "Singapore Management University",
    link: "https://computing.smu.edu.sg/bsc-information-systems",
    timeline: "Aug 2023 - Present",
    children: (
      <ul className="w-full list-inside list-disc space-y-1">
        <li>
          <span className="text-green">SMU .Hack, Technology Executive</span> -
          Part of a diverse team to organizes workshops, coding bootcamps and
          annual hackathons.
        </li>
        <li>
          <span className="text-green">SMU Ellipsis, Technology Director</span>{" "}
          - Leading a team of technology executives, organizing workshops,
          coding bootcamps and taking part in external projects.
        </li>
        <li>
          Received{" "}
          <span className="text-green">ASEAN Undergraduate Scholarship</span>.
        </li>
      </ul>
    ),
  },
  {
    logo: (
      <Image src={"/education/NUS.png"} alt={"NUS"} width={40} height={40} />
    ),
    icon: <GraduationCap size={40} />,
    title: "SP-NUS Collaboration Program",
    subtitle: "National University of Singapore",
    link: "https://www.sp.edu.sg/engineering-cluster/eee/news/eee/get-a-head-start-in-university-life-while-studying-for-an-eee-diploma-in-sp-join-the-sp-nus-collaboration-and-sp-sutd-pathway-programmes",
    timeline: "Aug 2022 - Nov 2022",
    children: (
      <ul className="w-full list-inside list-disc space-y-1">
        <li>Selected to join SP-NUS CP</li>
        <li>
          Completed Diploma course in{" "}
          <span className="text-green">5 semesters</span>
        </li>
        <li>
          Completed{" "}
          <span className="text-green">
            3 modules from NUS to get exemption
          </span>{" "}
          during my full-time degree
        </li>
      </ul>
    ),
  },
  {
    logo: <Image src={"/education/sp.ico"} alt={"SP"} width={40} height={40} />,
    icon: <GraduationCap size={40} />,
    title: "Diploma in Computer Engineering",
    subtitle: "Singapore Polytechnic",
    link: "https://sp.edu.sg/",
    timeline: "Apr 2020 - Mar 2023",
    children: (
      <ul className="w-full list-inside list-disc space-y-1">
        <li>
          Gained experience for IT security management systems (
          <span className="text-green">
            SIEM, Cyber Threat Intelligence Platforms
          </span>
          ) through hands-on practical lessons.
        </li>
        <li>
          Elected into <span className="text-green">Publicity Department</span>{" "}
          for Singapore Polytechnic International Students' Club (SPISC) in
          2021.
        </li>
        <li>
          <span className="text-green">
            Organized multiple student bonding events
          </span>{" "}
          for SPISC in AY2020/2021 and AY2021/2022
        </li>
        <li>
          <span className="text-green">Chairperson</span> in collaborating with
          Temasek Polytechnic International Students' Group and organized an
          inter-poly bonding event for 200 participants.
        </li>
      </ul>
    ),
  },
];

export default function Education() {
  return (
    <div className="w-full">
      <CustomTimeline timelineEvents={timelineEvents} />
    </div>
  );
}
