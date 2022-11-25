import { CreateLessonSavingMethod } from 'manabuf/bob/v1/lessons_pb';
import { IndividualLessonReportFieldArray } from 'test-suites/squads/lesson/common/constants';
import { convertEnumKeys } from 'test-suites/squads/lesson/utils/utils';

export type LessonTimeValueType = 'future' | 'past';
export type LessonType = 'individual' | 'group'; // For bdd
export type TeachingMethodValueType = 'Individual' | 'Group';
export type TeachingMediumValueType = 'Offline' | 'Online';
export type LessonReportActionType = 'Submit All' | 'Save Draft';

export type LessonUpsertFields =
    | 'lesson date'
    | 'end date'
    | 'start time'
    | 'end time'
    | 'teaching medium'
    | 'teaching method'
    | 'teacher'
    | 'center'
    | 'student'
    | 'course'
    | 'class';

export interface ClassCSV {
    course_id: string;
    location_id: string;
    course_name?: string;
    location_name?: string;
    class_name: string;
}

export type ActionCanSee = 'see' | 'not see';
export type ComparePosition = 'before' | 'after';
export type MethodSavingType = 'One Time' | 'Weekly Recurring';

export type AttendanceStatusValues = 'Attend' | 'Absent' | 'Late' | 'Leave Early' | '';
export type AttendanceNoticeValues = 'In Advance' | 'No contact' | 'On the day' | '';
export type AttendanceReasonValues =
    | 'Family reasons'
    | 'Physical condition'
    | 'Other'
    | 'School event'
    | '';
export type UnderstandingValues = 'A' | 'B' | 'C' | 'D';
export type HomeworkCompletionValues = 'COMPLETED' | 'IN_PROGRESS' | 'INCOMPLETE';

export type AutocompleteLessonReportValues = {
    STATUS: AttendanceStatusValues;
    NOTICE: AttendanceNoticeValues;
    REASON: AttendanceReasonValues;
    UNDERSTANDING: UnderstandingValues;
};

export type LessonReportStatus = 'Submitted' | 'Draft';
export type ComponentVisibleState = 'enabled' | 'disabled';

export type GroupLessonReportField =
    | 'Content'
    | 'Remark (Internal Only)'
    | 'Homework'
    | 'Announcement'
    | 'Homework Completion'
    | 'In-lesson Quiz'
    | 'Remark';

export type LessonReportPageType = 'detail' | 'upsert';

export type UpsertType = 'editing' | 'creating';

export type LessonReportPageWithUpsertType = 'detail' | UpsertType;

export const lessonSavingMethodKeys = convertEnumKeys(CreateLessonSavingMethod);
export type LessonSavingMethodType = keyof typeof lessonSavingMethodKeys;

export type IndividualLessonReportField = typeof IndividualLessonReportFieldArray[number];

export type LessonStatusType = 'Published' | 'Completed' | 'Cancelled';
