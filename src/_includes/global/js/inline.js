// Inline this check so it stops flashing initial theme on Firefox when deployed
var darkClass = 'dark';
var colorSchemeKey = 'color-scheme';

var chosenTheme = localStorage.getItem(colorSchemeKey);

if (chosenTheme === darkClass) {
  document.documentElement.classList.add(darkClass);
} else {
  document.documentElement.classList.remove(darkClass);
}
