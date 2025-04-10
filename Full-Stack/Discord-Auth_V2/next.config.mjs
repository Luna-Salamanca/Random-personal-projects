// ---- /next.config.mjs ----

import createMDX from '@next/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeImgSize from 'rehype-img-size';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// Security headers
const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

// MDX configuration
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkFrontmatter, remarkToc],
    rehypePlugins: [
      rehypeSlug,
      [rehypeImgSize, { dir: 'public' }],
      [rehypeAutolinkHeadings, {
        behaviour: 'append',
        properties: {
          ariaHidden: true,
          tabIndex: -1,
          className: 'hash-link',
        },
      }],
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Page extensions
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  
  // Image configuration
  images: {
    domains: ['xivapi.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xivapi.com',
        pathname: '/i/**',
      },
    ],
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/ultimates/:slug',
        destination: '/ultimate/:slug',
        permanent: true,
      },
    ];
  },

  // Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },

  // Basic settings
  reactStrictMode: true,
};

// Export configuration
export default withMDX(nextConfig);
