// Inline this check so it stops flashing initial theme on Firefox when deployed
const chosenTheme = localStorage.getItem('color-scheme');

if (chosenTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

let fontLoaded = false;

fontLoaded = JSON.parse(sessionStorage.getItem('font-loaded'));

if (fontLoaded) {
  document.documentElement.classList.add('font-loaded');
}
