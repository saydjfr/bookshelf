document.addEventListener('DOMContentLoaded', function(){
const books = [];
const SHOWUP_EVENT = 'showup-book';
const SAVE_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK-APPS';

const submitBook = document.getElementById('bookform');
submitBook.addEventListener('submit', function(event){
    Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Your Book has been Added",
        showConfirmButton: false,
        timer: 1500
        });
    event.preventDefault();

    const addbook = addBook();
    if(addbook !== null){
        const resetForm = document.getElementById('bookform');
        resetForm.reset();
    }
});

function addBook (){
    const titleBook = document. getElementById('inputTitle').value;
    const authorBook = document.getElementById('inputAuthor').value;
    const publicationBook = document.getElementById('inputYear').value;
    const year = parseInt(publicationBook);

    const generateID = generateId();
    const objectBook = generateObjectBook(generateID,titleBook,authorBook,year,false);

    books.push(objectBook);

    save();

    document.dispatchEvent(new Event(SHOWUP_EVENT));
}

function generateId(){
    return +new Date();
}

function generateObjectBook(id,title,author,year,isComplete){
    return{
        id,
        title,
        author,
        year,
        isComplete
    }
}

function addtoreadBook (objectBook){
    const textTitle = document.createElement('h2');
    textTitle.innerText = objectBook.title;

    const labelAuthor = document.createElement('p');
    labelAuthor.innerText = 'Author : ';
    const textAuthor = document.createElement('p');
    textAuthor.innerText = objectBook.author;
    const authorContainer = document.createElement('div');
    authorContainer.classList.add('auth');
    authorContainer.append(labelAuthor,textAuthor);

    const labelPublication = document.createElement('p');
    labelPublication.innerText = 'year : ';
    const textPublication = document.createElement('p');
    textPublication.innerText = objectBook.year;
    const publicationContainer = document.createElement('div');
    publicationContainer.classList.add('auth');
    publicationContainer.append(labelPublication,textPublication);

    const textContainer = document.createElement('div');
    textContainer.classList.add('iner');
    textContainer.append(textTitle,authorContainer,publicationContainer);

    const Container = document.createElement('div');
    Container.classList.add('item','shadow');
    Container.append(textContainer);
    Container.setAttribute('id',`book-$(objectBook.id)`);

    if(objectBook.isComplete){
        const undoReadingBtn = document.createElement('button');
        undoReadingBtn.classList.add('undo');

        undoReadingBtn.addEventListener('click', function(){
            undoAfterRead(objectBook.id);
        })

        Container.append(undoReadingBtn);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('add-book');

        checkButton.addEventListener('click', function(){
            addToAfterRead(objectBook.id);
        })

        Container.append(checkButton);
    }
    return Container;
}

function addListBook (objectBook){
    const textTitle = document.createElement('h2');
    textTitle.innerText = objectBook.title;

    const labelAuthor = document.createElement('p');
    labelAuthor.innerText = 'Author : ';
    const textAuthor = document.createElement('p');
    textAuthor.innerText = objectBook.author;
    const authorContainer = document.createElement('div');
    authorContainer.classList.add('auth');
    authorContainer.append(labelAuthor,textAuthor);

    const labelPublication = document.createElement('p');
    labelPublication.innerText = 'year : ';
    const textPublication = document.createElement('p');
    textPublication.innerText = objectBook.year;
    const publicationContainer = document.createElement('div');
    publicationContainer.classList.add('auth');
    publicationContainer.append(labelPublication,textPublication);

    const textContainer = document.createElement('div');
    textContainer.classList.add('iner');
    textContainer.append(textTitle,authorContainer,publicationContainer);

    const labelStatus = document.createElement('p');
    labelStatus.innerText = 'Status of Book : ';
    const textStatus = document.createElement('p');
    textStatus.classList.add('stats');
    if(objectBook.isComplete){
        textStatus.innerText = 'read';
    } else{
        textStatus.innerText = 'unread';
    }
    const statusContainer = document.createElement('div');
    statusContainer.classList.add('auth')
    statusContainer.append(labelStatus,textStatus);

    const Container = document.createElement('div');
    Container.classList.add('item','shadow');
    Container.append(textContainer, statusContainer);
    Container.setAttribute('id',`book-$(objekBook.id)`);

    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('delete');
    deleteBtn.addEventListener('click', function(){
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then((result) => {
            if (result.isConfirmed) {
                delBtn(objectBook.id);
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
              });
            }
          });
        
    });
    Container.append(deleteBtn);
    return Container;
}

function delBtn(bookId){
    const targetBook = findBookIndex(bookId);

    if(targetBook === -1) return;
    books.splice(targetBook,1);
    document.dispatchEvent(new Event(SHOWUP_EVENT));

    save();
}

function findBookIndex(bookId){
    for(const index in books){
        if(books[index].id === bookId){
            return index;
        }
    }

    return -1;
}

function addToAfterRead(bookId){
    const targetBook = findBook(bookId);

    if(targetBook == null) return;
    targetBook.isComplete = true;

    save();

    document.dispatchEvent(new Event(SHOWUP_EVENT));
}

function findBook (bookId){
    for(const listBook of books){
        if(listBook.id === bookId){
            return listBook;
        }
    }
    return null;
}

function undoAfterRead(bookId){
    const targetBook = findBook(bookId);
    if(targetBook == null) return;
    targetBook.isComplete = false;
    document.dispatchEvent(new Event(SHOWUP_EVENT));

    save();
}

document.addEventListener(SHOWUP_EVENT, function(){

    const listAllBook = document.getElementById('allBook');
    listAllBook.innerHTML = '';

    const addBook = document.getElementById('uncompletedBooks');
    addBook.innerHTML = '';

    const repeatBook = document.getElementById('completedBooks');
    repeatBook.innerHTML = '';

    for(const listallOfBook of books){
        const itemBook = addListBook(listallOfBook);
        listAllBook.append(itemBook);
    }

    for(const listBook of books){
        const elementBook = addtoreadBook(listBook);
        
        if(!listBook.isComplete){
            addBook.append(elementBook);
        } else{
            repeatBook.append(elementBook);
        }
        
    }
});

function save (){
    if(storageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVE_EVENT));
    }
}

function storageExist(){
    if(typeof(Storage)=== undefined ){
        alert('Maaf Browser Anda TIdak Mendukung Local Storage')
        return false;
    }
    return true;
}

    function loadDataBook (){
        const serialBook = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(serialBook);

        if(data !== null){
            for (const book of data){
                books.push(book);
            }
        }

        document.dispatchEvent(new Event(SHOWUP_EVENT));
    }

    if(storageExist()){
        loadDataBook();
    }


});


