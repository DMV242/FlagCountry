document.addEventListener('DOMContentLoaded', () => {
  const lightModeButton = document.querySelector('.mode__ligth');
  const darkModeButton = document.querySelector('.mode__dark');
  const body = document.body;

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  };

  // Apply saved theme on initial load
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // Default to light theme or system preference if not saved
    applyTheme('light');
  }

  lightModeButton.addEventListener('click', (e) => {
    e.preventDefault();
    applyTheme('light');
    localStorage.setItem('theme', 'light');
  });

  darkModeButton.addEventListener('click', (e) => {
    e.preventDefault();
    applyTheme('dark');
    localStorage.setItem('theme', 'dark');
  });
});
