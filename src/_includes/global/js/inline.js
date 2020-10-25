/* global FontFaceObserver:readonly */

// Inline this check so it stops flashing initial theme on Firefox when deployed
const chosenTheme = localStorage.getItem('color-scheme');

if (chosenTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

const fontInter = new FontFaceObserver('Inter');

fontInter.load(null, 5000).then(() => {
  document.documentElement.classList.add('wf-active');
});
