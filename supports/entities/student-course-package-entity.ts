import { ArrayElement } from '@supports/types/cms-types';

export interface StudentCoursePackageEntity {
    courseId: string;
    courseName: string;
    studentPackageId: string;
    startDate: Date;
    endDate: Date;
    courseAvatar?: string;
    locationIds?: string[];
}

export interface StudentCoursePackageHasura {
    name: string;
    student_package_id: string;
    course_id: string;
    end_date: string;
    start_date: string;
}

export type StudentPackagesByListStudentIdQuery = {
    student_packages: Array<{
        properties: any;
        student_package_id: string;
        student_id: string;
        end_at: any;
        start_at: any;
    }>;
};

export interface StudentPackage
    extends ArrayElement<StudentPackagesByListStudentIdQuery['student_packages']> {}
