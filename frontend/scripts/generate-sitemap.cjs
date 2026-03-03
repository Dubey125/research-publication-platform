const { SitemapStream, streamToPromise } = require('sitemap');
const { writeFileSync } = require('fs');

const routes = [
  '/',
  '/about',
  '/aims-scope',
  '/editorial-board',
  '/author-guidelines',
  '/publication-ethics',
  '/peer-review-policy',
  '/current-issue',
  '/archives',
  '/contact',
  '/submit-manuscript',
  '/admin/login'
];

(async () => {
  const stream = new SitemapStream({ hostname: process.env.SITE_URL || 'https://ijaif.org' });
  routes.forEach((url) => stream.write({ url, changefreq: 'weekly', priority: 0.8 }));
  stream.end();
  const sitemap = await streamToPromise(stream);
  writeFileSync('public/sitemap.xml', sitemap.toString());
  console.log('sitemap.xml generated in public/');
})();
