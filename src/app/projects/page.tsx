import ProjectCard from "./card";
import Image from "next/image";
import type { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Projects",
  description: "Johnny Lin | Projects",
};

export default function Projects() {
  return (
    <div className="space-y-4">
      <div>
        <ProjectCard
          image={
            <Image
              src={"/projects/portfoliov2.png"}
              alt={"Portfolio"}
              width={2000}
              height={2000}
              className="w-full"
              priority
            />
          }
          title={"Portfolio V2"}
          link={"https://github.com/darkliyznyanlin910/portfolio"}
        >
          <div>
            <p>
              Most recently, I revamped my portfolio website to experiment with
              glassmorphism and to showcase my latest projects.
            </p>
          </div>
        </ProjectCard>
      </div>
      <div>
        <ProjectCard
          image={
            <Image
              src={"/projects/osiris.png"}
              alt={"Mysfit"}
              width={2000}
              height={2000}
              className="w-full"
              priority
            />
          }
          title={"Osiris.sg"}
          link={"https://osiris.sg"}
        >
          <div>
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
                Wrote{" "}
                <span className="text-green">technical documentation</span> to
                ease onboarding process for new developers.
              </li>
              <li>
                In charge of migrating infrastructure to{" "}
                <span className="text-green">AWS</span>.
              </li>
            </ul>
          </div>
        </ProjectCard>
      </div>
      <div>
        <ProjectCard
          image={
            <Image
              src={"/projects/mysfit.png"}
              alt={"Mysfit"}
              width={2000}
              height={2000}
              className="w-full"
              priority
            />
          }
          title={"Mysfit"}
          link={"https://dev.mysfitygn.com"}
        >
          <div className="text-wrap">
            <p>
              As a <span className="text-green">Full Stack Developer</span> at
              Mysfit Pte. Ltd., a start-up with 3 of my friends, I played a key
              role in designing and implementing the website architecture using{" "}
              <span className="text-green">Next.js</span> and{" "}
              <span className="text-green">NodeJS with TypeScript</span>. I
              reviewed and debugged code, coordinated a team of two developers,
              and actively participated in requirements gathering to solidify
              project prerequisites. I utilized my expertise in{" "}
              <span className="text-green">NodeJS</span>,{" "}
              <span className="text-green">Prisma ORM</span>, and{" "}
              <span className="text-green">SQL/No-SQL</span> databases to
              develop and manage databases efficiently. Additionally, I set up
              CI/CD pipelines for automated software deployments.
            </p>
          </div>
        </ProjectCard>
      </div>
      <div>
        <ProjectCard
          image={
            <Image
              src={"/projects/knl-portfolio.png"}
              alt={"Portfolio"}
              width={2000}
              height={2000}
              className="w-full"
              priority
            />
          }
          title={"Portfolio V1"}
          link={"https://github.com/darkliyznyanlin910/knl-portfolio"}
        >
          <div>
            <p>
              Welcome to my portfolio website! One day, I realized that I
              didn&apos;t have a consolidated platform to showcase my work, so I
              embarked on this personal project. It has been an exciting
              opportunity for me to explore and implement cutting-edge
              technologies like{" "}
              <span className="text-green">
                Incremental Static Regeneration (ISR)
              </span>{" "}
              and <span className="text-green">Edge Functions from Vercel</span>
              . With ISR, my website loads blazingly fast, ensuring a seamless
              user experience, while Edge Functions allow me to add dynamic
              functionality to my static website. I&apos;m proud to share my
              journey and the projects I&apos;ve worked on through this website,
              and I hope you enjoy exploring them as much as I enjoyed building
              them!
            </p>
          </div>
        </ProjectCard>
      </div>
      <div>
        <ProjectCard
          image={
            <Image
              src={"/projects/laravel-bootstrap.png"}
              alt={"E-commerce"}
              width={2000}
              height={2000}
              className="w-full"
              priority
            />
          }
          title={"E-commerce Website with PHP"}
          link={"https://github.com/darkliyznyanlin910/laravel-bootstrap"}
        >
          <div>
            <p>
              As one of my earliest projects in web development, this project
              holds a special place in my heart. What began as a simple school
              assignment to create a PHP website quickly turned into a journey
              of exploration and learning. I went beyond the initial
              requirements and delved into the{" "}
              <span className="text-green">Laravel framework</span>, expanding
              my skills and knowledge in web development. The result was a fully
              functional web application that showcases my ability to create
              dynamic and interactive websites using modern frameworks. This
              project marks an important milestone in my web development journey
              and serves as a testament to my eagerness to constantly learn and
              improve my skills.
            </p>
          </div>
        </ProjectCard>
      </div>
    </div>
  );
}
