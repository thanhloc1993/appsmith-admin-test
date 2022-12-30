import { getSchoolAdminTenantInterfaceFromRole } from '@legacy-step-definitions/utils';

import { When } from '@cucumber/cucumber';

import {
    BookWithTenant,
    CourseWithTenant,
    IMasterWorld,
    SchoolAdminRolesWithTenant,
    StudyPlanWithTenant,
} from '@supports/app-types';
import NsMasterCourseService from '@supports/services/master-course-service/request-types';

import { aliasStudyPlanItemsWithTenant, aliasStudyPlanNameWithTenant } from './alias-keys/syllabus';
import { schoolAdminHasCreatedStudyPlanV2 } from './syllabus-study-plan-common-definitions';
import { mapStudyPlanItemWithInfo } from './syllabus-study-plan-item-common-definitions';
import {
    Book,
    StudyPlanItem,
    StudyPlanItemStructure,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

When(
    '{string} creates a matched studyplan {string} by {string} for {string}',
    { timeout: 100000 },
    async function (
        this: IMasterWorld,
        schoolAdminRole: SchoolAdminRolesWithTenant,
        studyPlanTenant: StudyPlanWithTenant,
        bookTenant: BookWithTenant,
        courseTenant: CourseWithTenant
    ) {
        const cms = getSchoolAdminTenantInterfaceFromRole(this, schoolAdminRole);
        const course = this.scenario.get<NsMasterCourseService.UpsertCoursesRequest>(courseTenant);
        const tenant = bookTenant == 'book Tenant S1' ? 'Tenant S1' : 'Tenant S2';
        const book = this.scenario.get<Book>(bookTenant);
        const studyPlanItemRandoms = this.scenario.get<StudyPlanItem[]>(
            aliasStudyPlanItemsWithTenant(tenant)
        );

        const { studyPlanName, studyPlanItemRaws } = await schoolAdminHasCreatedStudyPlanV2(
            cms,
            course.id,
            [book],
            {
                studyPlanItems: studyPlanItemRandoms,
                studyplanTestCase: 'active',
            }
        );

        const studyPlanItems: StudyPlanItemStructure[] = mapStudyPlanItemWithInfo(
            studyPlanItemRaws,
            studyPlanItemRandoms
        );

        this.scenario.set(aliasStudyPlanNameWithTenant(tenant), studyPlanName);
        this.scenario.set(studyPlanTenant, studyPlanItems);
    }
);
