import type {
  NavigationLinks,
  SiteConfiguration,
  SocialLinks,
} from "@/types.ts";

export const SITE: SiteConfiguration = {
  title: "Rabbitholes",
  description:
    "Personal Blog.",
  url: "https://rabbitholes.in/",
  author: "Narendra",
  locale: "en-US",
};

export const NAV_LINKS: NavigationLinks = {
  about: {
    path: "/about",
    label: "About",
  },
  blog: {
    path: "/blog",
    label: "Blog",
  },
  projects: {
    path: "/projects",
    label: "Projects",
  },
  contact: {
    path: "/contact",
    label: "Contact",
  },
};

export const SOCIAL_LINKS: SocialLinks = {
  email: {
    label: "Email",
    url: "mailto:skapashinarendra@gmail.com",
  },
  github: {
    label: "GitHub",
    url: "https://github.com/imtherealnaska",
  },
  twitter: {
    label: "Twitter",
    url: "https://twitter.com/NarendraKapashi",
  },
};
