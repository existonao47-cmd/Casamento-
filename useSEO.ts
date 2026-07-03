import { useEffect } from "react";

interface SEOOptions {
  title: string;
  description?: string;
}

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let tag = document.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export function useSEO({ title, description }: SEOOptions) {
  useEffect(() => {
    const fullTitle = `${title} | Amanda & Deivison`;
    document.title = fullTitle;
    setMeta("og:title", fullTitle, "property");

    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, "property");
    }
  }, [title, description]);
}
