import { Then } from '@cucumber/cucumber';

import {
    teacherDoesNotSeeTheSchoolDateColumn,
    teacherSeesTheSchoolDateColumn,
} from './syllabus-track-school-progress-definition';

Then(
    `teacher {string} the school date column`,
    async function (visible: 'sees' | 'does not see'): Promise<void> {
        const teacher = this.teacher;
        await teacher.instruction(`teacher ${visible} the school date column`, async () => {
            if (visible == 'sees') {
                await teacherSeesTheSchoolDateColumn(teacher);
            } else {
                await teacherDoesNotSeeTheSchoolDateColumn(teacher);
            }
        });
    }
);
