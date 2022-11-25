export function bookDetailScreenRoute(courseId: string) {
    return `learning?course_id=${courseId}`;
}

export function topicDetailScreenRoute(
    courseId: string,
    bookId: string,
    chapterId: string,
    topicId: string
) {
    return `learning?course_id=${courseId}/losByTopic?book_id=${bookId}&chapter_id=${chapterId}&topic_id=${topicId}`;
}
