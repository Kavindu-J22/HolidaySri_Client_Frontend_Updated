import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'Holidaysri | Sri Lanka\'s Best Tourism Platform',
  description = 'Discover Sri Lanka with Holidaysri - Your premier tourism and travel platform. Book tours, find accommodations, explore destinations, hire tour guides, and experience the beauty of Sri Lanka.',
  keywords = 'Sri Lanka tourism, Sri Lanka travel, Sri Lanka tours, Sri Lanka hotels, Sri Lanka destinations, tour packages Sri Lanka, travel Sri Lanka, visit Sri Lanka, Sri Lanka vacation, Sri Lanka holiday, tour guides Sri Lanka, Sri Lanka attractions, things to do in Sri Lanka, Sri Lanka travel guide',
  author = 'Holidaysri',
  image = 'https://res.cloudinary.com/dqdcmluxj/image/upload/v1752712705/Hsllogo_3_gye6nd.png',
  url = typeof window !== 'undefined' ? window.location.href : 'https://www.holidaysri.com',
  type = 'website',
  twitterCard = 'summary_large_image',
  twitterSite = '@holidaysri',
  canonical = typeof window !== 'undefined' ? window.location.href : 'https://www.holidaysri.com',
  structuredData = null,
  noindex = false,
  nofollow = false
}) => {
  // Clean title - remove extra spaces and ensure proper format
  const cleanTitle = title.trim();
  
  // Ensure description is within optimal length (150-160 characters)
  const cleanDescription = description.trim().substring(0, 160);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{cleanTitle}</title>
      <meta name="description" content={cleanDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonical} />
      
      {/* Robots Meta Tags */}
      {(noindex || nofollow) && (
        <meta name="robots" content={`${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`} />
      )}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={cleanTitle} />
      <meta property="og:description" content={cleanDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={cleanTitle} />
      <meta property="og:site_name" content="Holidaysri" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:title" content={cleanTitle} />
      <meta name="twitter:description" content={cleanDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={cleanTitle} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta httpEquiv="content-language" content="en" />
      
      {/* Geo Tags for Sri Lanka */}
      <meta name="geo.region" content="LK" />
      <meta name="geo.placename" content="Sri Lanka" />
      
      {/* Mobile App Meta Tags */}
      <meta name="apple-mobile-web-app-title" content="Holidaysri" />
      <meta name="application-name" content="Holidaysri" />
      
      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

