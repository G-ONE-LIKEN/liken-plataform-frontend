import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Canonicaliza el dominio: liken.lat → www.liken.lat (301).
  // El LB de GCE no soporta redirects por host, así que se hace acá.
  // Solo afecta a las páginas servidas por Next; /api lo enruta el ingress
  // directo al gateway y no pasa por este redirect.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "liken.lat" }],
        destination: "https://www.liken.lat/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
