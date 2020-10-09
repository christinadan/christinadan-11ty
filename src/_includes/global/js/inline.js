// Inline this check so it stops flashing initial theme on Firefox when deployed
const darkClass = 'dark';
const colorSchemeKey = 'color-scheme';

const chosenTheme = localStorage.getItem(colorSchemeKey);

if (chosenTheme === darkClass) {
  document.documentElement.classList.add(darkClass);
} else {
  document.documentElement.classList.remove(darkClass);
}
