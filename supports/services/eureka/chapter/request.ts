import NsChapterModifierServiceRequest from '@services/eureka/chapter/request-types';

import { Chapter, ContentBasicInfo } from 'manabuf/common/v1/contents_pb';
import { UpsertChaptersRequest } from 'manabuf/eureka/v1/chapter_modifier_pb';

export function createUpsertChaptersRequest(
    bookId: string,
    chaptersList: NsChapterModifierServiceRequest.UpsertChapters
) {
    const request = new UpsertChaptersRequest();

    request.setBookId(bookId);

    chaptersList.forEach((chapter) => {
        const requestChapter = new Chapter();
        const requestBasicInfo = new ContentBasicInfo();

        if (chapter.chapterId) requestBasicInfo.setId(chapter.chapterId);
        requestBasicInfo.setName(chapter.chapterName);
        requestBasicInfo.setSchoolId(chapter.schoolId);
        requestBasicInfo.setDisplayOrder(chapter.displayOrder);

        requestChapter.setInfo(requestBasicInfo);

        request.addChapters(requestChapter);
    });

    return request;
}
