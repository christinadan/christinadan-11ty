// https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/
const DARK_THEME = 'dark-theme';
const LIGHT_THEME = 'light-theme';
const toggle = document.getElementById('theme-toggle');
const theme = localStorage.getItem('theme');

if (theme === 'dark-theme') {
  document.body.classList.add(DARK_THEME);

  toggle.checked = true;
} else {
  document.body.classList.remove(DARK_THEME);

  toggle.checked = false;
}

toggle.addEventListener('change', (event) => {
  console.log(event.target.checked);
  const { checked } = event.target;

  if (checked) {
    document.body.classList.add(DARK_THEME);
    localStorage.setItem('theme', DARK_THEME);
  } else {
    document.body.classList.remove(DARK_THEME);
    localStorage.setItem('theme', LIGHT_THEME);
  }
});
