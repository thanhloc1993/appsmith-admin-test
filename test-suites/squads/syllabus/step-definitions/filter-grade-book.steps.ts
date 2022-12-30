import { gradesCMSMap } from '@legacy-step-definitions/utils';
import {
    schoolAdminApplyFilterAdvanced,
    schoolAdminOpenFilterAdvanced,
} from '@syllabus-utils/cms-common';
import { asyncForEach, getRandomElement, randomBoolean } from '@syllabus-utils/common';
import { aliasFirstGrantedLocation } from '@user-common/alias-keys/locations';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import {
    autocompleteBaseOption,
    courseAutocomplete,
    gradeAutoCompleteHFInput,
} from './cms-selectors/cms-keys';
import {
    aliasCourseName,
    aliasGradeBookFilterType,
    aliasGradeBookFilterWithCourse,
} from 'test-suites/squads/syllabus/step-definitions/alias-keys/syllabus';
import {
    gradeBookTableCourseName,
    gradeBookTableGrade,
} from 'test-suites/squads/syllabus/step-definitions/cms-selectors/grade-book';
import { convertOneOfStringTypeToArray } from 'test-suites/squads/syllabus/utils/common';
import { createARandomStudentGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

type FilterType = 'grade and course' | 'grade or course';

Then('school admin has created student with enrolled status', async function () {
    const firstGrantedLocation = this.scenario.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

    await this.cms.instruction('School admin creates student with enrolled status', async () => {
        const { student } = await createARandomStudentGRPC(this.cms, {
            parentLength: 0,
            studentPackageProfileLength: 0,
            locations: [firstGrantedLocation],
            defaultEnrollmentStatus: 'STUDENT_ENROLLMENT_STATUS_ENROLLED',
        });

        this.scenario.set(learnerProfileAliasWithAccountRoleSuffix('student'), student);
    });
});

When(
    'school admin filters with {string} of student in grade book',
    async function (filterType: string) {
        const courseName = this.scenario.get(aliasCourseName);
        const student = this.scenario.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix('student')
        );
        const studentGrade = student.gradeValue || 0;

        const filters = convertOneOfStringTypeToArray<FilterType>(filterType);
        const filter = getRandomElement<FilterType>(filters);

        let courses: string[] = [];
        let grades: number[] = [];

        switch (filter) {
            case 'grade and course': {
                courses = [courseName];
                grades = [studentGrade];
                break;
            }

            case 'grade or course': {
                const filterWithCourse = randomBoolean();
                this.scenario.set(aliasGradeBookFilterWithCourse, filterWithCourse);

                if (filterWithCourse) {
                    courses = [courseName];
                    grades = [];
                } else {
                    grades = [studentGrade];
                    courses = [];
                }
                break;
            }

            default:
                throw new Error(`Unknown filter ${filter}`);
        }

        await this.cms.instruction('School admin opens filter advanced', async () => {
            await schoolAdminOpenFilterAdvanced(this.cms);
        });

        if (courses.length > 0) {
            await asyncForEach(courses, async (name) => {
                await this.cms.instruction(`School admin selects course ${name}`, async () => {
                    await this.cms.page?.fill(courseAutocomplete, name);
                    await this.cms.waitingAutocompleteLoading();
                    await this.cms.chooseOptionInAutoCompleteBoxByText(name);
                });
            });

            await this.cms.page?.keyboard.press('Escape');
        }

        if (grades.length > 0) {
            await this.cms.page?.click(gradeAutoCompleteHFInput);

            await asyncForEach(grades, async (grade) => {
                const gradeOption = gradesCMSMap[String(grade) as keyof typeof gradesCMSMap];

                await this.cms.instruction(
                    `School admin selects grade ${gradeOption}`,
                    async () => {
                        await this.cms.page?.click(
                            `${autocompleteBaseOption}:has-text("${gradeOption}")`
                        );
                    }
                );
            });

            await this.cms.page?.keyboard.press('Escape');
        }

        await this.cms.instruction('School admin applies filters', async () => {
            await schoolAdminApplyFilterAdvanced(this.cms);
            await this.cms.page?.keyboard.press('Escape');
        });

        await this.cms.waitForSkeletonLoading();

        this.scenario.set(aliasGradeBookFilterType, filter);
    }
);

Then('school admin sees data matches with the above filters', async function () {
    const courseName = this.scenario.get(aliasCourseName);
    const student = this.scenario.get<UserProfileEntity>(
        learnerProfileAliasWithAccountRoleSuffix('student')
    );
    const studentGrade = student.gradeValue || 0;
    const grade = gradesCMSMap[String(studentGrade) as keyof typeof gradesCMSMap];
    const filterType = this.scenario.get<FilterType>(aliasGradeBookFilterType);
    const filterWithCourse = this.scenario.get<boolean>(aliasGradeBookFilterWithCourse);

    await this.cms.instruction(`School admin sees data matching with filter`, async () => {
        switch (filterType) {
            case 'grade or course': {
                if (filterWithCourse) {
                    await this.cms.page?.waitForSelector(
                        `${gradeBookTableCourseName}:has-text("${courseName}")`
                    );
                } else {
                    await this.cms.page?.waitForSelector(
                        `${gradeBookTableGrade}:has-text("${grade}")`
                    );
                }
                break;
            }

            case 'grade and course': {
                await this.cms.page?.waitForSelector(`${gradeBookTableGrade}:has-text("${grade}")`);
                await this.cms.page?.waitForSelector(
                    `${gradeBookTableCourseName}:has-text("${courseName}")`
                );
                break;
            }

            default:
                throw new Error(`Unknown type ${filterType}`);
        }
    });
});
