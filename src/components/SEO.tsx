import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  jsonLd?: Record<string, unknown>;
  breadcrumbs?: { name: string; url: string }[];
}

const SEO = ({ title, description, ogImage, ogType = "website", canonical, jsonLd, breadcrumbs }: SEOProps) => {
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
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", ogType, "property");
    if (ogImage) setMeta("og:image", ogImage, "property");
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
      link.href = canonical;
    }
    setMeta("twitter:card", ogImage ? "summary_large_image" : "summary", "name");
    setMeta("twitter:title", fullTitle, "name");
    setMeta("twitter:description", description, "name");
    if (ogImage) setMeta("twitter:image", ogImage, "name");

    // JSON-LD structured data
    let scriptEl = document.querySelector('script[data-seo-jsonld]') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.setAttribute("type", "application/ld+json");
        scriptEl.setAttribute("data-seo-jsonld", "true");
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
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
      document.title = "Austin House Beauty & Spa";
      const ldScript = document.querySelector('script[data-seo-jsonld]');
      if (ldScript) ldScript.remove();
      const bcScript = document.querySelector('script[data-seo-breadcrumb]');
      if (bcScript) bcScript.remove();
    };
  }, [title, description, ogImage, ogType, canonical, jsonLd, breadcrumbs]);

  return null;
};

export default SEO;
