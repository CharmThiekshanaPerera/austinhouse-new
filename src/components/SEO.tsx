import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  breadcrumbs?: { name: string; url: string }[];
  keywords?: string;
}

const SEO = ({ title, description, ogImage, ogType = "website", canonical, jsonLd, breadcrumbs, keywords }: SEOProps) => {
  useEffect(() => {
    const fullTitle = `${title} | Austin House Beauty & Spa`;
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);
    
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", ogType, "property");
    if (ogImage) setMeta("og:image", ogImage, "property");
    
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    setMeta("twitter:card", ogImage ? "summary_large_image" : "summary", "name");
    setMeta("twitter:title", fullTitle, "name");
    setMeta("twitter:description", description, "name");
    if (ogImage) setMeta("twitter:image", ogImage, "name");

    // Clean up old JSON-LD scripts
    const oldScripts = document.querySelectorAll('script[data-seo-jsonld]');
    oldScripts.forEach(s => s.remove());

    // JSON-LD structured data
    if (jsonLd) {
      const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      schemas.forEach((schema, index) => {
        const scriptEl = document.createElement("script");
        scriptEl.setAttribute("type", "application/ld+json");
        scriptEl.setAttribute("data-seo-jsonld", "true");
        scriptEl.setAttribute("data-schema-index", index.toString());
        scriptEl.textContent = JSON.stringify(schema);
        document.head.appendChild(scriptEl);
      });
    }

    // Breadcrumb JSON-LD
    let breadcrumbEl = document.querySelector('script[data-seo-breadcrumb]') as HTMLScriptElement | null;
    if (breadcrumbs && breadcrumbs.length > 0) {
      if (!breadcrumbEl) {
        breadcrumbEl = document.createElement("script");
        breadcrumbEl.setAttribute("type", "application/ld+json");
        breadcrumbEl.setAttribute("data-seo-breadcrumb", "true");
        document.head.appendChild(breadcrumbEl);
      }
      breadcrumbEl.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      });
    } else if (breadcrumbEl) {
      breadcrumbEl.remove();
    }

    return () => {
      // We don't necessarily want to reset everything on unmount if another page is mounting
      // but we should clean up the JSON-LD at least
      const scripts = document.querySelectorAll('script[data-seo-jsonld]');
      scripts.forEach(s => s.remove());
      const bcScript = document.querySelector('script[data-seo-breadcrumb]');
      if (bcScript) bcScript.remove();
    };
  }, [title, description, ogImage, ogType, canonical, jsonLd, breadcrumbs, keywords]);

  return null;
};

export default SEO;
