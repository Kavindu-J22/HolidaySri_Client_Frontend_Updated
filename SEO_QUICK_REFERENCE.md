# 🚀 SEO Quick Reference Card

## Quick Start - Add SEO to Any Page

### 1. Import SEO Component
```jsx
import SEO from '../components/SEO/SEO';
```

### 2. Add to Your Component
```jsx
const YourPage = () => {
  return (
    <>
      <SEO
        title="Your Page Title | Holidaysri"
        description="Your page description (150-160 chars)"
        keywords="keyword1, keyword2, keyword3"
        canonical="https://www.holidaysri.com/your-page"
      />
      <div>
        {/* Your page content */}
      </div>
    </>
  );
};
```

### 3. Update sitemap.xml
Add your page to `client/public/sitemap.xml`:
```xml
<url>
  <loc>https://www.holidaysri.com/your-page</loc>
  <lastmod>2025-11-27</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## SEO Component Props

| Prop | Type | Required | Example |
|------|------|----------|---------|
| `title` | string | ✅ | "Page Title \| Holidaysri" |
| `description` | string | ✅ | "Page description 150-160 chars" |
| `keywords` | string | ✅ | "keyword1, keyword2, keyword3" |
| `canonical` | string | ✅ | "https://www.holidaysri.com/page" |
| `image` | string | ❌ | "https://example.com/image.jpg" |
| `structuredData` | object/array | ❌ | `getOrganizationSchema()` |
| `noindex` | boolean | ❌ | `false` |
| `nofollow` | boolean | ❌ | `false` |

---

## Structured Data Examples

### Organization Schema
```jsx
import { getOrganizationSchema } from '../utils/seoUtils';

<SEO structuredData={getOrganizationSchema()} />
```

### Website Schema
```jsx
import { getWebsiteSchema } from '../utils/seoUtils';

<SEO structuredData={getWebsiteSchema()} />
```

### Multiple Schemas
```jsx
import { getOrganizationSchema, getWebsiteSchema } from '../utils/seoUtils';

<SEO structuredData={[
  getOrganizationSchema(),
  getWebsiteSchema()
]} />
```

### FAQ Schema
```jsx
import { getFAQSchema } from '../utils/seoUtils';

const faqs = [
  { question: "Question 1?", answer: "Answer 1" },
  { question: "Question 2?", answer: "Answer 2" }
];

<SEO structuredData={getFAQSchema(faqs)} />
```

---

## Best Practices

### Title Tags
- ✅ Keep under 60 characters
- ✅ Include brand name: "Page Title | Holidaysri"
- ✅ Use unique titles for each page
- ✅ Include primary keyword

### Meta Descriptions
- ✅ Keep between 150-160 characters
- ✅ Include call-to-action
- ✅ Use unique descriptions
- ✅ Include target keywords naturally

### Keywords
- ✅ 5-10 relevant keywords
- ✅ Don't keyword stuff
- ✅ Use natural language
- ✅ Include long-tail keywords

### Images
- ✅ Use 1200x630px for social sharing
- ✅ Optimize file size
- ✅ Use descriptive alt text
- ✅ Host on CDN

---

## Sitemap Priorities

| Priority | Pages |
|----------|-------|
| 1.0 | Homepage |
| 0.9 | About, Services, Main Features |
| 0.8 | Browse Pages, Contact |
| 0.7 | Service Pages |
| 0.5 | Policy Pages |

---

## Change Frequencies

| Frequency | Pages |
|-----------|-------|
| daily | Homepage, Browse Pages |
| weekly | Services, Features |
| monthly | About, Contact |
| yearly | Policy Pages |

---

## Testing Tools

### Google Tools
- **Rich Results Test**: https://search.google.com/test/rich-results
- **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
- **Search Console**: https://search.google.com/search-console

### Social Media
- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Inspector**: https://www.linkedin.com/post-inspector/

### Performance
- **Lighthouse**: Chrome DevTools > Lighthouse
- **PageSpeed Insights**: https://pagespeed.web.dev/

---

## Common Issues & Solutions

### Issue: SEO not showing
**Solution:** Make sure `<HelmetProvider>` wraps your app in App.jsx

### Issue: Duplicate titles
**Solution:** Each page should have unique title prop

### Issue: Description too long
**Solution:** Keep descriptions between 150-160 characters

### Issue: Structured data errors
**Solution:** Test with Google Rich Results Test

---

## Files Reference

| File | Purpose |
|------|---------|
| `client/src/components/SEO/SEO.jsx` | SEO component |
| `client/src/utils/seoUtils.js` | Structured data utilities |
| `client/public/robots.txt` | Crawler instructions |
| `client/public/sitemap.xml` | Site structure |
| `client/public/manifest.json` | PWA metadata |
| `client/index.html` | Base meta tags |

---

## Need Help?

📖 **Full Documentation**: See `SEO_IMPLEMENTATION_GUIDE.md`  
📊 **Summary**: See `SEO_SUMMARY.md`  
🔧 **This Guide**: Quick reference for common tasks

---

**Last Updated:** November 27, 2025

