import { CourseEntity } from './course-entity';

/// Entity to receive data from Learner/Teacher
export interface CourseListEntity {
    courses: CourseEntity[];
}
