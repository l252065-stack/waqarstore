import type { Metadata } from "next";

const SITE_NAME = "Waqar Store";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://waqarstore.com";
const SITE_DESCRIPTION =
  "Premium men's clothing — shop the latest arrivals in tops, bottoms, formal wear and accessories.";

export function buildMetadata(options?: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const {
    title,
    description = SITE_DESCRIPTION,
    path = "",
    image = "/og-image.jpg",
    noIndex = false,
  } = options ?? {};

  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_URL}${path}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: { canonical: url },
  };
}
