import { Link as ScrollLink } from "react-scroll";
import Link from "next/link";
import SocialLinks from "./socialLinks";

const navItems = [
  { to: "about", label: "About", offset: -100 },
  { to: "experience", label: "Experience", offset: -150 },
  { to: "projects", label: "Projects", offset: -120 },
  { to: "education", label: "Education", offset: -120 },
  { to: "certification", label: "Certifications", offset: -200 },
  { to: "contact", label: "Contact", offset: -200 },
];

const actionButtons = [
  {
    href: "https://www.linkedin.com/in/dev-sanyam/",
    label: "LinkedIn",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-linkedin-icon lucide-linkedin mr-2 h-4 w-4"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    href: "https://sanyam-jain16.github.io/portfolio/resume/SanyamJainResume_FullStack.pdf",
    label: "Download CV",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-download mr-2 h-4 w-4"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </svg>
    ),
  },
];

const Header = () => {
  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/3 lg:justify-between lg:py-12">
      <SocialLinks />
      <div className="w-5/6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl title">
          Sanyam Jain
        </h1>
        <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl">
          Software Engineer
        </h2>
        <i>Ahmedabad, Gujrat, India</i>
        <p className="mt-2 lg:max-w-sm leading-relaxed text-justify">
          I build accessible, inclusive products and digital experiences for the
          web. I enjoy taking on new challenges and collaborating with other
          developers to create innovative and impactful products that solve
          real-world problems.
        </p>

        <div className="mt-4 max-w-xs flex gap-4">
          {actionButtons.map((button, index) => (
            <Link
              key={index}
              className="click-button flex items-center rounded uppercase border border-teal-300 px-4 py-2 text-xs text-teal-300 font-medium"
              href={button.href}
              target="_blank"
              aria-label={button.label}
            >
              {button.icon}
              {button.label}
            </Link>
          ))}
        </div>

        <nav className="nav hidden lg:block" aria-label="In-page jump links">
          <ul className="mt-8 w-max">
            {navItems.map((item, index) => (
              <li key={index}>
                <ScrollLink
                  activeClass="active"
                  to={item.to}
                  className="group flex items-center py-3 cursor-pointer"
                  spy={true}
                  smooth={true}
                  offset={item.offset}
                  duration={200}
                >
                  <span className="nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none" />
                  <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200">
                    {item.label}
                  </span>
                </ScrollLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
