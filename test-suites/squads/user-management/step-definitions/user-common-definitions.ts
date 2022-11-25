import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import { StudentInformation } from '@legacy-step-definitions/types/content';
import {
    getRandomNumber,
    getRandomPhoneNumber,
    randomString,
    randomInteger,
    getRandomElementsWithLength,
    retrieveLowestLocations,
    checkValidNumberPhone,
} from '@legacy-step-definitions/utils';
import { gradeMasterAlias, retrieveLowestLocationsAlias } from '@user-common/alias-keys/student';

import { CMSInterface, ScenarioContextInterface } from '@supports/app-types';
import { Menu, MenuUnion } from '@supports/enum';
import { User_Eibanam_GetListGradeQuery } from '@supports/graphql/bob/bob-types';
import { ScenarioContext } from '@supports/scenario-context';
import { StudentDetailTab, LocationObjectGRPC, LocationInfoGRPC } from '@supports/types/cms-types';

import { schoolAdminAddStudentTags } from './student-info/user-tag/user-create-student-with-student-tag-definitions';
import {
    getLearnerInformationAfterCreateStudentSuccessfully,
    schoolAdminChooseTabInStudentDetail,
    clickOnAddNewParentDropdownButton,
    fillInParentInformation,
} from './user-create-student-definitions';
import {
    createRandomStudentData,
    goToAddStudentPageAndFillInStudentInformation,
} from './user-definition-utils';
import { clickOnSaveButtonInStudent } from './user-definition-utils';
import { checkExistedUser } from './user-hasura';
import { getAllGradeMaster } from 'step-definitions/utils';
import { waitForFetchingCourses } from 'test-suites/common/step-definitions/course-definitions';
import { StudentTagAction } from 'test-suites/squads/user-management/step-definitions/student-info/user-tag/type';

export async function waitForFirstLoading(
    menuType: MenuUnion,
    cms: CMSInterface,
    context: ScenarioContextInterface['context']
): Promise<void> {
    if (menuType === Menu.COURSES) {
        await waitForFetchingCourses(cms, context);
    }
}

export async function schoolAdminCreatingStudent(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
): Promise<StudentInformation> {
    const firstGrantedLocation = scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

    const randomStudentData = await createRandomStudentData(cms, {
        locations: [firstGrantedLocation],
    });

    await goToAddStudentPageAndFillInStudentInformation(cms, scenarioContext, randomStudentData);

    return randomStudentData;
}

export async function schoolAdminCreateStudentWithStudentTags(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    studentTagAction: StudentTagAction
) {
    const randomStudentData = await schoolAdminCreatingStudent(cms, scenarioContext);

    const studentTags = await schoolAdminAddStudentTags(cms, scenarioContext, studentTagAction);

    await clickOnSaveButtonInStudent(cms);

    const newStudentData = {
        ...randomStudentData,
        studentTags,
    };
    await getLearnerInformationAfterCreateStudentSuccessfully(cms, scenarioContext, newStudentData);
}

export async function schoolAdminCreateStudent(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const firstGrantedLocation = scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

    const randomStudentData = await createRandomStudentData(cms, {
        locations: [firstGrantedLocation],
    });

    await goToAddStudentPageAndFillInStudentInformation(cms, scenarioContext, randomStudentData);

    await clickOnSaveButtonInStudent(cms);

    await getLearnerInformationAfterCreateStudentSuccessfully(
        cms,
        scenarioContext,
        randomStudentData
    );
}

export async function schoolAdminCreatingParent(cms: CMSInterface) {
    const parentUsername = `e2e-parent.${getRandomNumber()}.${randomString(10)}@manabie.com`;
    const parentPhoneNumber = getRandomPhoneNumber();
    await cms.instruction(`Go to Family Tab`, async function () {
        await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.FAMILY);
    });
    await cms.instruction(`Click Add New Parent dropdown button`, async function () {
        await clickOnAddNewParentDropdownButton(cms);
    });

    const parentInfo = await fillInParentInformation(cms, parentUsername, parentPhoneNumber);

    return parentInfo;
}

export async function getRandomGradeMasterByContext(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const gradeMaster =
        scenarioContext.get<User_Eibanam_GetListGradeQuery['grade']>(gradeMasterAlias);
    const grades = gradeMaster ? gradeMaster : await getAllGradeMaster(cms);
    !gradeMaster && scenarioContext.set(gradeMasterAlias, grades);

    const randomIdxGrade = randomInteger(0, grades.length - 1);
    const randomGrade = grades[randomIdxGrade];
    await cms.attach(`Get random Grade Master: ${JSON.stringify(randomGrade)}`);
    if (!randomGrade) {
        await cms.attach(
            `Not found random Grade Master. Idx: ${randomIdxGrade}, all Grades master ${JSON.stringify(
                grades
            )}`
        );
    }
    return randomGrade;
}

export async function getRandomLocation(cms: CMSInterface, locationLength?: number) {
    const locationsList = await retrieveLowestLocations(cms);
    const randomLength = locationLength ? locationLength : randomInteger(1, 15);

    const studentLocations = getRandomElementsWithLength<LocationInfoGRPC>(
        locationsList,
        randomLength
    );
    return studentLocations;
}

export async function getRandomLocationByContext(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    locationLength?: number
) {
    const locationsList = await getRetrieveLowestLocationsByContext(cms, scenarioContext);
    const randomLength = locationLength ? locationLength : randomInteger(1, 15);

    const studentLocations = getRandomElementsWithLength<LocationInfoGRPC>(
        locationsList,
        randomLength
    );
    return studentLocations;
}

export async function getRetrieveLowestLocationsByContext(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const locationsContext = scenarioContext.get<LocationInfoGRPC[]>(retrieveLowestLocationsAlias);
    const locations = locationsContext ? locationsContext : await retrieveLowestLocations(cms);
    !locationsContext && scenarioContext.set(retrieveLowestLocationsAlias, locations);

    return locations;
}

export async function getRandomValidAndNotExistPhoneNumber(cms: CMSInterface) {
    let phoneNumber = getRandomPhoneNumber();
    let isExisted = await checkExistedUser(cms, { phone_number: phoneNumber });
    let isValidPhone = checkValidNumberPhone(phoneNumber, 'JP');
    while (isExisted || !isValidPhone) {
        phoneNumber = getRandomPhoneNumber();
        isExisted = await checkExistedUser(cms, { phone_number: phoneNumber });
        isValidPhone = checkValidNumberPhone(phoneNumber, 'JP');
    }

    return phoneNumber;
}
