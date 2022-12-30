import { LessonTeachingMedium, LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';

export type LessonTimeValueType = 'future' | 'past' | 'now';

export type TeachingMediumValueType = 'Offline' | 'Online';
export type LessonActionSaveType = 'Published' | 'Draft';

export type TeachingMedium = keyof typeof LessonTeachingMedium;
export type TeachingMethod = keyof typeof LessonTeachingMethod;

export type LessonManagementLessonTime = 'future' | 'past' | 'now';
export type LessonManagementLessonName = 'lesson L1' | 'lesson L2';
export type LessonUpsertFields =
    | 'lesson date'
    | 'end date'
    | 'start time'
    | 'end time'
    | 'teaching medium'
    | 'teaching method'
    | 'teacher'
    | 'center'
    | 'student';

type PotentialString = string | null;

export interface IndividualLessonInfo {
    lessonDate: PotentialString;
    dayOfWeek: PotentialString;
    startTime: PotentialString;
    endTime: PotentialString;
    teachingMedium: PotentialString;
    teachingMethod: PotentialString;
    location: PotentialString;
    teacherNames: PotentialString;
    studentNames: PotentialString[];
}

export interface GroupLessonInfo extends IndividualLessonInfo {
    courseName: PotentialString;
    className: PotentialString;
    recurringSettings: PotentialString;
}
