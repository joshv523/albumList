// Album class: represents an album
class Album {
  constructor(title, artist, genre, albumId) {
    this.title = title;
    this.artist = artist;
    this.genre = genre;
    this.albumId = albumId;
  }
}

// UI class: handle UI tasks
class UI {
  static displayAlbums() {
    const albums = Storage.getAlbums();

    albums.forEach( (album) => UI.addAlbumToList(album));
  }

  static addAlbumToList(album) {
    const list = document.querySelector('#album-list');
    const row = document.createElement('tr');
    row.classList.add('table-secondary');

    row.innerHTML = `
      <td>${album.title}</td>
      <td>${album.artist}</td>
      <td>${album.genre}</td>
      <td>${album.albumId}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteAlbum(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className =  `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#album-form');
    container.insertBefore(div, form);
    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#artist').value = '';
    document.querySelector('#genre').value = '';
    document.querySelector('#albumId').value = '';
  }
}

// Storage class: handles localStorage
class Storage {
  // returns list of albums from localStorage
  static getAlbums() {
    let albums;
    if (localStorage.getItem('albums') === null) {
      albums = [];
    } else {
      albums = JSON.parse(localStorage.getItem('albums'));
    }

    return albums;
  }
  
  // adds an album to localStorage
  static addAlbum(album) {
    const albums = Storage.getAlbums();

    albums.push(album);

    localStorage.setItem('albums', JSON.stringify(albums));
  }

  // removes an album from localStorage
  static removeAlbum(albumId) {
    const albums = Storage.getAlbums();

    albums.forEach((album, index) => {
      if (album.albumId === albumId) {
        albums.splice(index, 1);
      }
    });

    localStorage.setItem('albums', JSON.stringify(albums));
  }

  // search for duplicate albumId
  static checkForDuplicate(albumId) {
    const albums = Storage.getAlbums();
    let isDuplicate;

    albums.forEach((album) => {
      if(album.albumId === albumId) {
        isDuplicate = true;
      }
    })
    return isDuplicate;
  }
}

// Event: display albums
document.addEventListener('DOMContentLoaded', UI.displayAlbums);
document.addEventListener('DOMContentLoaded', UI.showAlert('Enter any album in the input form below and add it to your album list', 'success'));

// Event: add an album
document.querySelector('#album-form').addEventListener('submit', (e) => {
  // prevent actual submit
  e.preventDefault();
  
  // get form values
  const title = document.querySelector('#title').value;
  const artist = document.querySelector('#artist').value;
  const genre = document.querySelector('#genre').value;
  const albumId = document.querySelector('#albumId').value;

  // get albums array from Storage
  const albums = Storage.getAlbums();

  // validate submission
  if (title === '' || artist === '' || genre === '' || albumId === '') {
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
    // first, check if the albumId already exists in localStorage
    const duplicateExists = Storage.checkForDuplicate(albumId);
    if (duplicateExists) {
      // show alert message for when duplicate exists
      UI.showAlert('An album with that ID already exists. Please enter a different ID.', 'danger');
    } else {
      // instantiate album
      const album = new Album(title, artist, genre, albumId);
      // add album to UI
      UI.addAlbumToList(album);
      // add album to Storage
      Storage.addAlbum(album);
      // show album added successfully message
      UI.showAlert('Album added successfully', 'success');
      // clear input fields
      UI.clearFields();
    }
  }
});

// Event: remove an album
document.querySelector('#album-list').addEventListener('click', (e) => {
  // Remove album from UI
  UI.deleteAlbum(e.target);
  
  // Remove album from Storage
  Storage.removeAlbum(e.target.parentElement.previousElementSibling.textContent);

  // show removed successfully message
  UI.showAlert('Album deleted successfully!', 'success');
})