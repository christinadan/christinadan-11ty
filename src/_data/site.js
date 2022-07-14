const { CONTEXT, DEPLOY_PRIME_URL, ELEVENTY_ENV } = process.env;
const prodUrl = 'https://christinadan.com';
const url = CONTEXT === 'deploy-preview' ? DEPLOY_PRIME_URL : prodUrl;

module.exports = {
  environment: ELEVENTY_ENV,
  name: 'Christina Dan',
  description: 'A little corner of the web for Christina Dan, a software engineer in Dallas, TX.',
  url,
  domain: 'christinadan.com',
  feedUrl: `${url}/feed.xml`,
  favicon: {
    small: '/assets/img/favicon-16x16.png',
    large: '/assets/img/favicon-32x32.png',
  },
  author: {
    name: 'Christina Dan',
    email: 'hello@christinadan.com',
    twitter: '@christinadannn',
    image: `${url}/assets/img/author.jpg`,
  },
  resume: '/assets/static/Christina_Dan_Resume.pdf',
};
