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

  // --- Client-side posts for bookshelf (stored in localStorage) ---
  const postForm = document.getElementById('post-form');
  const postsListEl = document.getElementById('posts-list');

  function loadPosts() {
    try {
      return JSON.parse(localStorage.getItem('bookshelf_posts') || '[]');
    } catch (e) { return []; }
  }

  function savePosts(posts) {
    localStorage.setItem('bookshelf_posts', JSON.stringify(posts));
  }

  function renderPosts() {
    if (!postsListEl) return;
    const posts = loadPosts().reverse();
    postsListEl.innerHTML = '';
    posts.forEach(function (p) {
      const el = document.createElement('article');
      el.className = 'user-post';
      el.innerHTML = `
        <div class="post-meta"><strong>${escapeHtml(p.title)}</strong> — <span class="post-author">${escapeHtml(p.author)}</span> <span class="post-date">${p.date}</span></div>
        <div class="post-body"><p>${escapeHtml(p.content).replace(/\n/g, '<br>')}</p></div>
        <div class="post-attachments">${(p.attachments||[]).map(a => renderAttachmentHtml(a)).join('')}</div>
      `;
      postsListEl.appendChild(el);
    });
  }

  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]; }); }

  function renderAttachmentHtml(a){
    if (!a || !a.type || !a.data) return '';
    if (a.type.startsWith('image/')) return `<img src="${a.data}" class="post-img">`;
    if (a.type.startsWith('video/')) return `<video controls class="post-video"><source src="${a.data}" type="${a.type}"></video>`;
    return '';
  }

  if (postForm) {
    postForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const author = document.getElementById('post-author').value.trim() || 'Anonymous';
      const title = document.getElementById('post-title').value.trim() || 'Untitled';
      const content = document.getElementById('post-content').value.trim();
      const files = document.getElementById('post-files').files;

      if (!content) return alert('Please write something for your post.');

      const maxFiles = 3;
      const maxSize = 3 * 1024 * 1024; // 3MB each
      if (files.length > maxFiles) return alert('Please attach up to 3 files.');

      const readFiles = [];
      const readers = [];
      for (let i=0;i<files.length;i++){
        const f = files[i];
        if (f.size > maxSize) return alert('Each file must be 3MB or smaller.');
        readers.push(new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = function(){ res({type: f.type, data: r.result}); };
          r.onerror = rej;
          r.readAsDataURL(f);
        }));
      }

      Promise.all(readers).then(function (attachments) {
        const posts = loadPosts();
        posts.push({
          id: Date.now(),
          author: author,
          title: title,
          content: content,
          attachments: attachments,
          date: new Date().toLocaleString()
        });
        savePosts(posts);
        postForm.reset();
        renderPosts();
      }).catch(function () { alert('Failed to read attachments.'); });
    });
  }

  // initial render of posts
  renderPosts();
});
