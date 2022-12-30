export const startTimeUpdate = '03:00';
export const endTimeUpdate = '16:00';
export const defaultText = 'Default Text';
export const updatedText = 'Updated Text';
export const secondClassNameSuffix = '2nd';

export const mathHandwritingAnswer = 'x=\\frac{1}{7}';

export const IndividualLessonReportFieldArray = [
    'Attendance Status',
    'Content',
    'Understanding',
    'Homework',
    'Attendance Notice',
    'Reason',
    'Attendance Note',
    'Homework Completion',
    'In-lesson Quiz',
    'Announcement',
    'Remark',
] as const;

export const materialVideoUat = '01GKRHB717GZBNC71XSZ0VVAYA';
export const materialPDFUat = '01GKRHB717GZBNC71XSW16FMNB';
export const materialPDFStag = '01GJF5Q31TV8Q4K6JA30N6YAR8';
export const materialVideoStag = '01GCTEG1F4017JCX881W0V2NX7';

export const materialByEnv = {
    uat: {
        pdf: materialPDFUat,
        video: materialVideoUat,
    },
    staging: {
        pdf: materialPDFStag,
        video: materialVideoStag,
    },
};
