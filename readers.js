/* Reader profiles and e-books are stored locally in IndexedDB for this static-site demo. */
(function () {
  'use strict';

  const DB_NAME = 'in-the-margins-readers';
  const STORE_NAME = 'profiles';
  const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
  const MAX_BOOK_BYTES = 10 * 1024 * 1024;
  const allowedBookExtensions = ['pdf', 'epub', 'txt'];
  let db;
  let editingId = null;

  const byId = (id) => document.getElementById(id);
  const profileForm = byId('reader-form');
  const bookForm = byId('book-form');
  const list = byId('reader-list');
  const profileFeedback = byId('profile-feedback');
  const bookFeedback = byId('book-feedback');

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE_NAME)) {
          request.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function getProfiles() {
    return new Promise((resolve, reject) => {
      const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  function saveProfile(profile) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).put(profile);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  }

  function safeText(parent, tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = value || '';
    parent.appendChild(node);
    return node;
  }

  function initials(name) {
    return String(name || '?').trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase();
  }

  function refreshOwnerOptions(profiles) {
    const select = byId('book-owner');
    const selected = select.value;
    select.replaceChildren(new Option('Select your profile', ''));
    profiles.forEach((profile) => select.add(new Option(profile.name, profile.id)));
    if (profiles.some((profile) => profile.id === selected)) select.value = selected;
    else if (editingId && profiles.some((profile) => profile.id === editingId)) select.value = editingId;
  }

  function renderProfiles(profiles) {
    const search = byId('reader-search').value.trim().toLocaleLowerCase();
    const shown = profiles.filter((profile) => `${profile.name} ${profile.location || ''}`.toLocaleLowerCase().includes(search));
    list.replaceChildren();
    byId('directory-empty').hidden = shown.length > 0;
    if (!shown.length && profiles.length) {
      byId('directory-empty').textContent = 'No readers match that search. Try another name or city.';
      byId('directory-empty').hidden = false;
    } else if (!profiles.length) {
      byId('directory-empty').textContent = 'No reader profiles yet. Create one above to be the first on the shelf.';
    }

    shown.sort((a, b) => a.name.localeCompare(b.name)).forEach((profile) => {
      const card = document.createElement('article');
      card.className = 'reader-card';
      const head = document.createElement('div');
      head.className = 'reader-card-head';
      const avatar = document.createElement('div');
      avatar.className = 'reader-avatar';
      avatar.setAttribute('aria-label', `${profile.name}'s profile picture`);
      if (profile.photo) {
        const image = document.createElement('img');
        image.src = profile.photo;
        image.alt = '';
        avatar.appendChild(image);
      } else {
        avatar.textContent = initials(profile.name);
      }
      head.appendChild(avatar);
      const identity = document.createElement('div');
      safeText(identity, 'h3', '', profile.name);
      if (profile.location) safeText(identity, 'p', 'reader-location', profile.location);
      head.appendChild(identity);
      card.appendChild(head);
      if (profile.bio) safeText(card, 'p', 'reader-bio', profile.bio);
      safeText(card, 'h4', 'reader-books-heading', `E-books (${(profile.books || []).length})`);
      if (profile.books && profile.books.length) {
        const books = document.createElement('ul');
        books.className = 'reader-books';
        profile.books.forEach((book) => {
          const item = document.createElement('li');
          item.className = 'reader-book';
          const description = document.createElement('div');
          safeText(description, 'span', 'reader-book-title', book.title);
          if (book.author) safeText(description, 'span', 'reader-book-author', book.author);
          item.appendChild(description);
          if (book.file instanceof Blob) {
            const download = document.createElement('a');
            download.href = URL.createObjectURL(book.file);
            download.download = book.fileName || `${book.title}.${book.extension || 'pdf'}`;
            download.textContent = 'Open / download';
            download.setAttribute('aria-label', `Open or download ${book.title}`);
            item.appendChild(download);
          }
          books.appendChild(item);
        });
        card.appendChild(books);
      } else {
        safeText(card, 'p', 'reader-no-books', 'No e-books added yet.');
      }
      const actions = document.createElement('div');
      actions.className = 'reader-card-actions';
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'reader-edit-button';
      edit.textContent = 'Edit profile';
      edit.addEventListener('click', () => startEditing(profile));
      actions.appendChild(edit);
      card.appendChild(actions);
      list.appendChild(card);
    });
    refreshOwnerOptions(profiles);
  }

  async function refresh() {
    const profiles = await getProfiles();
    renderProfiles(profiles);
  }

  function startEditing(profile) {
    editingId = profile.id;
    byId('reader-name').value = profile.name || '';
    byId('reader-location').value = profile.location || '';
    byId('reader-bio').value = profile.bio || '';
    byId('reader-photo').value = '';
    byId('profile-form-title').textContent = 'Edit your reader profile';
    byId('save-profile-button').textContent = 'Save changes';
    byId('cancel-edit').hidden = false;
    byId('reader-name').focus();
    byId('book-owner').value = profile.id;
    window.scrollTo({ top: profileForm.getBoundingClientRect().top + window.scrollY - 20, behavior: 'smooth' });
  }

  function resetEditor() {
    editingId = null;
    profileForm.reset();
    byId('profile-form-title').textContent = 'Create your reader profile';
    byId('save-profile-button').textContent = 'Save profile';
    byId('cancel-edit').hidden = true;
  }

  function readPhoto(file) {
    if (!file) return Promise.resolve(null);
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return Promise.reject(new Error('Choose a JPG, PNG, or WebP profile picture.'));
    if (file.size > MAX_PHOTO_BYTES) return Promise.reject(new Error('Profile pictures must be 2 MB or smaller.'));
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Could not read the profile picture.'));
      reader.readAsDataURL(file);
    });
  }

  profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    profileFeedback.textContent = '';
    const name = byId('reader-name').value.trim();
    if (!name) return;
    try {
      const profiles = await getProfiles();
      const previous = profiles.find((profile) => profile.id === editingId);
      const chosenPhoto = byId('reader-photo').files[0];
      const photo = chosenPhoto ? await readPhoto(chosenPhoto) : (previous && previous.photo) || null;
      const profile = {
        id: editingId || `reader-${crypto.randomUUID()}`,
        name,
        location: byId('reader-location').value.trim(),
        bio: byId('reader-bio').value.trim(),
        photo,
        books: previous ? previous.books || [] : [],
        createdAt: previous ? previous.createdAt : new Date().toISOString()
      };
      await saveProfile(profile);
      const savedId = profile.id;
      resetEditor();
      await refresh();
      byId('book-owner').value = savedId;
      profileFeedback.textContent = 'Profile saved on this device.';
    } catch (error) {
      profileFeedback.textContent = error.message || 'Could not save your profile. Check available browser storage.';
    }
  });

  byId('cancel-edit').addEventListener('click', resetEditor);
  byId('reader-search').addEventListener('input', refresh);

  bookForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    bookFeedback.textContent = '';
    const ownerId = byId('book-owner').value;
    const file = byId('book-file').files[0];
    const extension = file && file.name.split('.').pop().toLowerCase();
    if (!ownerId) { bookFeedback.textContent = 'Create or select a reader profile first.'; return; }
    if (!file || !allowedBookExtensions.includes(extension)) { bookFeedback.textContent = 'Choose a PDF, EPUB, or TXT file.'; return; }
    if (file.size > MAX_BOOK_BYTES) { bookFeedback.textContent = 'E-books must be 10 MB or smaller.'; return; }
    try {
      const profile = (await getProfiles()).find((item) => item.id === ownerId);
      if (!profile) { bookFeedback.textContent = 'That profile could not be found. Please refresh and try again.'; return; }
      profile.books = profile.books || [];
      profile.books.push({ id: `book-${crypto.randomUUID()}`, title: byId('book-title').value.trim(), author: byId('book-author').value.trim(), fileName: file.name, extension, file });
      await saveProfile(profile);
      bookForm.reset();
      await refresh();
      byId('book-owner').value = ownerId;
      bookFeedback.textContent = 'E-book added to the reader profile on this device.';
    } catch (error) {
      bookFeedback.textContent = error.name === 'QuotaExceededError' ? 'Browser storage is full. Remove some files or use a smaller e-book.' : 'Could not save the e-book. Check browser storage and try again.';
    }
  });

  openDatabase().then(async (database) => {
    db = database;
    await refresh();
  }).catch(() => {
    byId('directory-empty').textContent = 'Your browser could not open local storage. Please use a modern browser with IndexedDB enabled.';
    byId('directory-empty').hidden = false;
    profileForm.querySelector('button[type="submit"]').disabled = true;
    bookForm.querySelector('button[type="submit"]').disabled = true;
  });
})();
