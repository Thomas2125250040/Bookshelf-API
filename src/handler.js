const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading
    } = request.payload;

    if (name === '' || name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    } else if (readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const finished = pageCount === readPage? true : false;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const book = {
        id, name, year, author, summary, publisher,
        pageCount, readPage, finished, reading, 
        insertedAt, updatedAt
    }

    books.push(book);

    const index = books.findIndex((n) => n.id === id);

    if (index !== -1) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data : {
                bookId: id
            }
        });
        response.code(201);
        return response;
    } else {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku.'
        })
        response.code(400);
    }
};

const getAllBooksHandler = (request, h) => {

    const reading = request.query.reading;
    const finishedBooks = request.query.finished;
    const name = request.query.name;

    if (reading !== undefined) {
        const book = books.filter((n) => n.reading === !!reading)
            .map( item => {
                return{
                id: item.id,
                name: item.name,
                publisher: item.publisher
            }});
        const response = h.response({
            status: 'success',
            data: {
                books: book
            }
        })
        response.code(200);
        return response;
    } else if (finishedBooks !== undefined) {
        if (finishedBooks == 1){
            const book = books.filter((n) => n.readPage == n.pageCount )
                .map( item => {
                    return{
                    id: item.id,
                    name: item.name,
                    publisher: item.publisher
                }});
            const response = h.response({
                status: 'success',
                data: {
                    books: book
                }
            })
            response.code(200);
            return response;
        } else {
            const book = books.filter((n) => n.readPage < n.pageCount )
                .map( item => {
                    return{
                    id: item.id,
                    name: item.name,
                    publisher: item.publisher
                }});
            const response = h.response({
                status: 'success',
                data: {
                    books: book
                }
            })
            response.code(200);
            return response;
        } 
    } else if(name !== undefined) {
        const book = books.filter((n) => n.name.toLowerCase().includes(name.toLowerCase()) )
            .map( item => {
                return{
                id: item.id,
                name: item.name,
                publisher: item.publisher
        }});
        const response = h.response({
            status: 'success',
            data: {
                books: book
            }
        });
        response.code(200);
        return response;
    } else {
        const book = books.map( item => {
            return{
            id: item.id,
            name: item.name,
            publisher: item.publisher
        }});
        const response = h.response({
            status: 'success',
            data: {
               books: book
            }
        });
        response.code(200);
        return response;
    };
    }

const getBookById = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((n) => n.id === bookId )[0];

    if(book !== undefined){
        const response = h.response({
            status: 'success',
            data: {
                book
            }
        });
        response.code(200);
        return response;
    } else {
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        });

        response.code(404);
        return response;
    }
};

const editBookById = (request, h) => {
    const { bookId } = request.params;

    const {
        name, year, author, summary, publisher, pageCount, readPage, reading
    } = request.payload;

    if (name === undefined || name === ''){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })
        response.code(400);
        return response;
    } else if (readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });

        response.code(400);
        return response;
    }

    const index = books.findIndex((n) => n.id === bookId);

    if (index != -1){
        const book = {
            ...books[index],
            name, 
            year, 
            author, 
            summary, 
            publisher, 
            pageCount, 
            readPage, 
            reading
        }

        books[index] = book;

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        })
        response.code(200);
        return response;

    } else {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        })

        response.code(404);
        return response;
    }
};

const deleteBookById = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((n) => n.id === bookId);

    if (index !== -1){

        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })
        response.code(200);
        return response;

    } else {

        const response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan'
        })
        response.code(404);
        return response;

    }
}

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookById,
    editBookById,
    deleteBookById
};