import Link from "next/link";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Building, GraduationCap, Menu, Rocket } from "lucide-react";
import { ThemeSwitcher } from "./theme/theme-switcher";

type NavLink = {
  href: string;
  label: string;
  icon?: React.ReactNode;
};

const navLinks: NavLink[] = [
  {
    href: "/projects",
    label: "Projects",
    icon: <Rocket size={16} />,
  },
  {
    href: "/education",
    label: "Education",
    icon: <GraduationCap size={16} />,
  },
  {
    href: "/experience",
    label: "Experience",
    icon: <Building size={16} />,
  },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="absolute left-0 top-0 h-full w-full overflow-hidden">
        <div className="relative h-full w-full">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#76ff98] to-[#89bbfc] opacity-50 dark:opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#76ff98] to-[#89bbfc] opacity-50 dark:opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>
      </div>
      <Sheet>
        <header className="sticky top-0 z-50 px-2 pt-2">
          <nav className="rounded-full border bg-background/80 px-4 py-2 backdrop-blur-md transition duration-200 ease-in-out">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-green font-bold">
                Johnny Lin
              </Link>
              <div className="hidden items-center space-x-2 md:flex">
                {navLinks.map((navLink, index) => (
                  <Button
                    asChild
                    key={index}
                    size={"sm"}
                    className="rounded-full"
                    variant={"greenOutline"}
                  >
                    <Link href={navLink.href} className="space-x-1">
                      {navLink.icon}
                      <p>{navLink.label}</p>
                    </Link>
                  </Button>
                ))}
                <ThemeSwitcher />
              </div>
              <div className="block md:hidden">
                <SheetTrigger asChild>
                  <Button
                    variant="greenOutline"
                    size={"icon"}
                    className="rounded-full"
                  >
                    <Menu size={16} />
                  </Button>
                </SheetTrigger>
                <SheetContent className="mr-2 mt-20 rounded-xl border bg-background/80 backdrop-blur-md transition duration-200 ease-in-out">
                  <SheetHeader>
                    <SheetTitle className="text-left">
                      Check Out Other Pages!
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="mt-4 flex flex-col space-y-2">
                    {navLinks.map((navLink, index) => (
                      <SheetClose asChild>
                        <Button
                          asChild
                          key={index}
                          size={"sm"}
                          className="justify-start rounded-full"
                          variant={"greenOutline"}
                        >
                          <Link href={navLink.href} className="space-x-1">
                            {navLink.icon}
                            <p>{navLink.label}</p>
                          </Link>
                        </Button>
                      </SheetClose>
                    ))}
                  </nav>
                  <SheetFooter className="mt-4 flex flex-row items-center justify-start gap-4">
                    <p>Theme:</p> <ThemeSwitcher />
                  </SheetFooter>
                </SheetContent>
              </div>
            </div>
          </nav>
        </header>
        <main className="centerWidth marginY-full z-0 h-full flex-grow">
          {children}
        </main>
        <footer className="z-50 px-2 pb-2">
          <div className="rounded-full border bg-background/50 p-2 px-4 py-2 backdrop-blur-md transition duration-200 ease-in-out">
            <div className="flex flex-row items-center justify-center space-x-2 text-sm">
              <p>© 2024 Johnny Lin</p>
            </div>
          </div>
        </footer>
      </Sheet>
    </div>
  );
}
