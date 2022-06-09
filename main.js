const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

document.addEventListener(SAVED_EVENT, () => {
  console.log("Data berhasil di simpan.");
});

function findBook(bookId) {
  for (bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return bookId;
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const { id, isComplete, title, author, year } = bookObject;
  let textTitle = document.createElement("h2");
  textTitle.classList.add("font-bold", "text-center", "mb-2");
  textTitle.innerText = title.toUpperCase();
  let textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis : ${author.toUpperCase()}`;
  let textYear = document.createElement("p");
  textYear.innerText = `Tahun : ${year}`;
  let article = document.createElement("div");
  article.classList.add(
    "block",
    "p-6",
    "rounded-lg",
    "shadow-lg",
    "bg-white",
    "max-w-sm",
    "my-2"
  );
  article.setAttribute("id", `book-${id}`);
  article.classList.add("bookItem");
  article.append(textTitle, textAuthor, textYear);

  if (isComplete) {
    const undoButton = document.createElement("button");
    undoButton.innerHTML = "Belum selesai";
    undoButton.classList.add(
      "bg-blue-600",
      "rounded-lg",
      "py-1",
      "px-2",
      "mr-2",
      "text-sm",
      "mt-2",
      "text-white"
    );
    undoButton.addEventListener("click", function () {
      removeFromCompleted(id);
    });

    const deletButton = document.createElement("button");
    deletButton.innerHTML = "Hapus buku";
    deletButton.classList.add(
      "bg-red-700",
      "rounded-lg",
      "py-1",
      "px-2",
      "mr-2",
      "text-sm",
      "mt-2",
      "text-white"
    );
    deletButton.addEventListener("click", function () {
      deletedBook(id);
    });
    article.append(undoButton, deletButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.innerHTML = "Selesai dibaca";
    checkButton.classList.add(
      "bg-blue-600",
      "rounded-lg",
      "py-1",
      "px-2",
      "mr-2",
      "text-sm",
      "mt-2",
      "text-white"
    );
    checkButton.addEventListener("click", function () {
      addToCompleted(id);
    });
    const deletButton = document.createElement("button");
    deletButton.innerHTML = "Hapus buku";
    deletButton.classList.add(
      "bg-red-700",
      "rounded-lg",
      "py-1",
      "px-2",
      "mr-2",
      "text-sm",
      "mt-2",
      "text-white"
    );
    deletButton.addEventListener("click", function () {
      deletedBook(id);
    });
    article.append(checkButton, deletButton);
  }
  return article;
}

function addToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deletedBook(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget === bookId) return;
  swal({
    title: "Apakah kamu yakin?",
    text: "Setelah dihapus, Buku tidak dapat dikembalikan",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      books.splice(books.indexOf(bookTarget), 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
      swal("Buku berhasil dihapus", {
        icon: "success",
      });
    }
  });
}

function addBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const isComplete = document.getElementById("check").checked;
  const id = +new Date();
  const bookObject = { title, author, year, isComplete, id };
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

const cancelInput = document.getElementById("cancel");
cancelInput.addEventListener("click", clearBook);

function clearBook() {
  const form = document.getElementById("inputBook");
  form.reset();
  return form;
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
    clearBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById("belumDibaca");
  uncompletedBookList.innerHTML = "";
  const completedBookList = document.getElementById("selesaiDibaca");
  completedBookList.innerHTML = "";
  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) {
      completedBookList.append(bookElement);
    } else {
      uncompletedBookList.append(bookElement);
    }
  }

  const btnCari = document.getElementById("btnSearch");
  btnCari.addEventListener("click", function (e) {
    e.preventDefault();
    let cari = document.getElementById("search").value;
    searchBook(cari.toLowerCase());
  });
});


function searchBook(keyword) {
  const bookList = document.querySelectorAll(".bookItem");
  for (let book of bookList) {
    const judul = book.childNodes[0];
    if (!judul.innerText.toLowerCase().includes(keyword)) {
      judul.parentElement.style.display = "none";
    } else {
      judul.parentElement.style.display = "";
    }
  }
}
