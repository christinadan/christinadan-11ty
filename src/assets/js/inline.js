import { css } from 'store-css';

const url = 'https://fonts.googleapis.com/css2?family=Courier+Prime&family=Inter:wght@400;500;600;700&display=swap';
const storage = 'session';
const crossOrigin = 'anonymous';
const config = { url, storage, crossOrigin };

css(config);

if (localStorage.getItem('color-scheme') === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

if (sessionStorage.getItem('font-loaded')) {
  document.documentElement.classList.add('font-loaded');
}
