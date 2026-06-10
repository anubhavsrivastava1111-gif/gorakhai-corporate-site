import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Gorakhai';
const SITE_URL = process.env.REACT_APP_SITE_URL || 'https://gorakhai.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export default function SEOMeta({
  title,
  description = 'Enterprise AI infrastructure for the modern organization. Orchestra IQ orchestrates your AI ecosystem. Arjun AI amplifies your team.',
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  canonicalPath = '',
  noIndex = false,
  schema = null,
}) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Enterprise AI Intelligence`;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />

      {/* OpenGraph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@gorakhai" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

// ─── Pre-built Schema Objects ────────────────────────────────────────────────

export const OrganizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Gorakhai',
  url: 'https://gorakhai.com',
  logo: 'https://gorakhai.com/logo.png',
  sameAs: [
    'https://www.linkedin.com/company/gorakhai',
    'https://twitter.com/gorakhai'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@gorakhai.com',
    contactType: 'customer service'
  },
  description: 'Enterprise AI infrastructure company. Orchestra IQ and Arjun AI — purpose-built AI platforms for the modern enterprise.'
};

export const WebSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Gorakhai',
  url: 'https://gorakhai.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://gorakhai.com/blog?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};

export function buildBlogPostSchema(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image_url,
    author: {
      '@type': 'Person',
      name: post.author_name
    },
    publisher: {
      '@type': 'Organization',
      name: 'Gorakhai',
      logo: {
        '@type': 'ImageObject',
        url: 'https://gorakhai.com/logo.png'
      }
    },
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://gorakhai.com/blog/${post.slug}`
    }
  };
}

export function buildJobPostingSchema(job) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.posted_at,
    employmentType: job.type?.toUpperCase().replace('-', '_'),
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Gorakhai',
      sameAs: 'https://gorakhai.com'
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location
      }
    },
    ...(job.salary_range && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: {
          '@type': 'QuantitativeValue',
          description: job.salary_range
        }
      }
    })
  };
}
