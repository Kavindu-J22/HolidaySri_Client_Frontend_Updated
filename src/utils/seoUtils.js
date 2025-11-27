// SEO Utility Functions for Holidaysri

/**
 * Generate structured data for Organization
 */
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "Holidaysri",
  "description": "Sri Lanka's premier tourism and travel platform. Discover destinations, book tours, find accommodations, and explore the beauty of Sri Lanka.",
  "url": "https://www.holidaysri.com",
  "logo": "https://res.cloudinary.com/dqdcmluxj/image/upload/v1752712705/Hsllogo_3_gye6nd.png",
  "image": "https://res.cloudinary.com/dqdcmluxj/image/upload/v1752712705/Hsllogo_3_gye6nd.png",
  "telephone": "+94-XXX-XXXXXXX",
  "email": "info@holidaysri.com",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "LK",
    "addressRegion": "Sri Lanka"
  },
  "sameAs": [
    "https://www.facebook.com/holidaysri",
    "https://www.instagram.com/holidaysri",
    "https://twitter.com/holidaysri"
  ],
  "areaServed": {
    "@type": "Country",
    "name": "Sri Lanka"
  }
});

/**
 * Generate structured data for Website
 */
export const getWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Holidaysri",
  "url": "https://www.holidaysri.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.holidaysri.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});

/**
 * Generate structured data for TouristDestination
 */
export const getTouristDestinationSchema = (destination) => ({
  "@context": "https://schema.org",
  "@type": "TouristDestination",
  "name": destination.name,
  "description": destination.description,
  "image": destination.images?.[0]?.url || destination.image,
  "url": `https://www.holidaysri.com/destinations/${destination._id || destination.id}`,
  "geo": destination.coordinates ? {
    "@type": "GeoCoordinates",
    "latitude": destination.coordinates.lat,
    "longitude": destination.coordinates.lng
  } : undefined,
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "LK",
    "addressRegion": destination.province || "Sri Lanka"
  },
  "touristType": destination.type || "Tourist Attraction"
});

/**
 * Generate structured data for Service
 */
export const getServiceSchema = (service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.name,
  "description": service.description,
  "provider": {
    "@type": "TravelAgency",
    "name": "Holidaysri"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Sri Lanka"
  },
  "serviceType": service.type || "Tourism Service"
});

/**
 * Generate structured data for BreadcrumbList
 */
export const getBreadcrumbSchema = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": `https://www.holidaysri.com${crumb.path}`
  }))
});

/**
 * Generate structured data for Article/Blog Post
 */
export const getArticleSchema = (article) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "image": article.image,
  "author": {
    "@type": "Organization",
    "name": "Holidaysri"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Holidaysri",
    "logo": {
      "@type": "ImageObject",
      "url": "https://res.cloudinary.com/dqdcmluxj/image/upload/v1752712705/Hsllogo_3_gye6nd.png"
    }
  },
  "datePublished": article.publishedDate,
  "dateModified": article.modifiedDate || article.publishedDate
});

/**
 * Generate structured data for FAQPage
 */
export const getFAQSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

/**
 * Generate page title with brand
 */
export const generatePageTitle = (pageTitle) => {
  if (!pageTitle) return 'Holidaysri | Sri Lanka\'s Best Tourism Platform';
  return `${pageTitle} | Holidaysri`;
};

/**
 * Truncate description to optimal length
 */
export const truncateDescription = (description, maxLength = 160) => {
  if (!description) return '';
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3) + '...';
};

/**
 * Generate keywords from array
 */
export const generateKeywords = (keywordsArray) => {
  return keywordsArray.join(', ');
};

