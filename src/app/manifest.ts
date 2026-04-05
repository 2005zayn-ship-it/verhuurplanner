import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Verhuurplanner",
    short_name: "Verhuurplanner",
    description:
      "Beschikbaarheidskalender voor vakantieverhuurders. Beheer je reservaties en toon je beschikbaarheid op je website.",
    start_url: "/",
    display: "standalone",
    background_color: "#f0f7ff",
    theme_color: "#1d6fa4",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
