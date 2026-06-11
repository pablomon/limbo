import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
if (!projectId || !/^[a-z0-9-]+$/.test(projectId)) {
  throw new Error(
    "Missing or invalid PUBLIC_SANITY_PROJECT_ID. Copy .env.example to .env and set your Sanity project ID."
  );
}

export const sanityClient = createClient({
  projectId,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: import.meta.env.PROD,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
