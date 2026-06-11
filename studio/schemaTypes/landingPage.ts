import { defineField, defineType } from "sanity";

export default defineType({
  name: "landingPage",
  title: "Landing Page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", title: "Title", validation: (r) => r.required() }),
    defineField({ name: "subtitle", type: "text", title: "Subtitle" }),
    defineField({ name: "ctaLabel", type: "string", title: "CTA Button Label" }),
    defineField({ name: "ctaUrl", type: "url", title: "CTA URL" }),
    defineField({ name: "heroImage", type: "image", title: "Hero Image", options: { hotspot: true } }),
  ],
  __experimental_actions: ["update", "publish"],
});
