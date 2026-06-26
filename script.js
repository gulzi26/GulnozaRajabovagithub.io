document.addEventListener('DOMContentLoaded', function () {
  // Main page shelf tabs
  const buttons = document.querySelectorAll('.shelf-tab');

  // Map filter values to page URLs
  const pageMap = {
    'all': 'index.html#shelves',
    'books': 'books.html',
    'classroom': 'classroom.html',
    'journey': 'journey.html',
    'personal': 'personal.html',
    'work': 'work.html'
  };

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = btn.getAttribute('data-filter');
      const page = pageMap[filter];
      
      if (page) {
        window.location.href = page;
      }
    });
  });

  // Bookshelf category buttons
  const categoryBtns = document.querySelectorAll('.book-category-btn');
  const bookCards = document.querySelectorAll('.book-card');

  categoryBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const category = btn.getAttribute('data-book-category');

      // Update active button
      categoryBtns.forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      // Show/hide books
      bookCards.forEach(function (card) {
        if (category === 'all' || card.getAttribute('data-book-category') === category) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Set "All" as active by default for book categories
  if (categoryBtns.length > 0) {
    categoryBtns[0].classList.add('active');
  }
});
