// See /_includes/global/js/inline.js for additional theme code
var darkClass = 'dark';
var lightClass = 'light';
var colorSchemeKey = 'color-scheme';
var isDarkColorScheme = document.documentElement.classList.contains('dark');
var toggle = document.getElementById('theme-toggle');

toggle.checked = isDarkColorScheme;

toggle.addEventListener('change', function (event) {
  const { checked } = event.target;

  if (checked) {
    document.documentElement.classList.add(darkClass);

    localStorage.setItem(colorSchemeKey, darkClass);
  } else {
    document.documentElement.classList.remove(darkClass);

    localStorage.setItem(colorSchemeKey, lightClass);
  }
});
