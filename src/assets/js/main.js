// See /_includes/global/js/inline.js for additional theme code
const darkClass = 'dark';
const lightClass = 'light';
const colorSchemeKey = 'color-scheme';
const isDarkColorScheme = document.documentElement.classList.contains('dark');
const toggle = document.getElementById('theme-toggle');

toggle.checked = isDarkColorScheme;

toggle.addEventListener('change', (event) => {
  const { checked } = event.target;

  if (checked) {
    document.documentElement.classList.add(darkClass);

    localStorage.setItem(colorSchemeKey, darkClass);
  } else {
    document.documentElement.classList.remove(darkClass);

    localStorage.setItem(colorSchemeKey, lightClass);
  }
});
