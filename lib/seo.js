const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://housebuyerguides.com";

/**
 * Build FAQ schema (JSON-LD) for a list of { question, answer }
 */
export function buildFAQSchema(faqList) {
  if (!faqList?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqList.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}

/**
 * Default OG image path
 */
export function getDefaultOgImage() {
  return `${SITE_URL}/og-image.png`;
}

/**
 * Build metadata object for a page (for generateMetadata or export const metadata)
 */
export function buildMetadata({ title, description, path = "" }) {
  const url = path ? `${SITE_URL}${path}` : SITE_URL;
  const ogImage = getDefaultOgImage();
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "HouseBuyerGuides.com",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: { canonical: url },
  };
}
