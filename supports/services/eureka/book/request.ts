import NsBookModifierServiceRequest from './request-types';
import { UpsertBooksRequest } from 'manabuf/eureka/v1/book_modifier_pb';

export function createUpsertBooksRequest(bookList: NsBookModifierServiceRequest.UpsertBooks[]) {
    const request = new UpsertBooksRequest();

    bookList.forEach((book) => {
        const requestBook = new UpsertBooksRequest.Book();

        requestBook.setName(book.name);
        requestBook.setSchoolId(book.schoolId);

        if (book.bookId) requestBook.setBookId(book.bookId);
        if (book.chapterIdsList) requestBook.setChapterIdsList(book.chapterIdsList);

        request.addBooks(requestBook);
    });

    return request;
}
