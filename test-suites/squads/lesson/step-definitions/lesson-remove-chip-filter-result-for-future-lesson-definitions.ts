import {
    aliasDayOfTheWeek,
    aliasGrade,
    aliasLessonInfo,
    aliasLocationName,
    aliasSearchKeyword,
    aliasStudentName,
    aliasTeacherName,
    aliasCourseName,
} from '@legacy-step-definitions/alias-keys/lesson';
import {
    schoolAdminApplyFilterAdvanced,
    schoolAdminOpenFilterAdvanced,
} from '@legacy-step-definitions/cms-common-definitions';
import { applyFilterAdvancedButton } from '@legacy-step-definitions/cms-selectors/cms-keys';
import {
    chipAutocompleteIconDelete,
    chipAutocompleteText,
} from '@legacy-step-definitions/cms-selectors/lesson';
import { retrieveLessonEndpoint } from '@legacy-step-definitions/endpoints/lesson-management';
import { getLessonDataOnLessonDetailPage } from '@legacy-step-definitions/lesson-edit-lesson-by-updating-and-adding-definitions';
import {
    applyTimePicker,
    changeTimePicker,
} from '@legacy-step-definitions/lesson-management-utils';
import { goToLessonInfoFirstLesson } from '@legacy-step-definitions/lesson-search-future-lesson-definitions';
import { userIsOnLessonDetailPage } from '@legacy-step-definitions/lesson-teacher-can-delete-individual-lesson-report-of-future-lesson-definitions';
import {
    arrayHasItem,
    getUsersFromContextByRegexKeys,
    pick1stElement,
} from '@legacy-step-definitions/utils';
import { learnerProfileAlias, teacherProfileAlias } from '@user-common/alias-keys/user';

import { Page } from 'playwright-core';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { formatDate } from '@supports/utils/time/time';

import { CreateLessonRequestData } from '@services/bob-lesson-management/bob-lesson-management-service';

import moment from 'moment';
import {
    atTheFirstLessonRowInList,
    coursesAutocompleteHF,
    coursesAutocompleteInput,
    datePickerWithValueV2,
    filterAdvancedEndTime,
    filterAdvancedFromDateV2,
    filterAdvancedLessonDayOfTheWeek,
    filterAdvancedLessonDayOfTheWeekV2,
    filterAdvancedStartTime,
    filterAdvancedToDateV2,
    gradesAutocompleteHF,
    gradesAutocompleteInput,
    lessonCenterColumn,
    lessonInfoLocation,
    lessonInfoCourseColumn,
    lessonInfoGradeColumn,
    lessonInfoStudentNameColumn,
    lessonInfoTeachers,
    lessonLink,
    lessonTeacherColumn,
    lessonTimeColumn,
    locationsLowestLevelAutocompleteInputV3,
    locationsLowestLevelAutocompleteV3,
    studentsAutocompleteFilterInputV2,
    studentsAutocompleteHF,
    teacherAutocompleteV3,
} from 'test-suites/squads/lesson/common/cms-selectors';
import { selectTeacher } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { convertStudentGrade } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

export type TimeOptions =
    | 'Lesson Start Date'
    | 'Lesson End Date'
    | 'Start Time'
    | 'End Time'
    | 'Lesson day of the week';

export type OtherFilteredOptions = 'Teacher Name' | 'Student Name' | 'Center' | 'Grade' | 'Course';

export type FilteredFieldTitle = TimeOptions | OtherFilteredOptions;

export type FilteredOptionWithExpectedValueAndSelector = {
    [key in OtherFilteredOptions]: {
        selector: string;
        expectedValue: string;
    };
};

type RecordRowDataOfLessonList = {
    lessonDate: string;
    startTime: string;
    endTime: string;
    lessonCenter: string;
    lessonTeachers: string;
};

export async function selectStartOrEndDate(cms: CMSInterface, date: string, type: 'start' | 'end') {
    const page = cms.page!;

    const filterAdvanceDate = type === 'start' ? filterAdvancedFromDateV2 : filterAdvancedToDateV2;
    await page.click(filterAdvanceDate);
    await page.click(datePickerWithValueV2(date));
    await applyTimePicker(cms);
}

export async function selectDayOfTheWeek(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    order: number
) {
    const page = cms.page!;
    await page.click(filterAdvancedLessonDayOfTheWeekV2);
    await cms.chooseOptionInAutoCompleteBoxByOrder(order > 7 ? 1 : order);
    const dayOfTheWeek = await page.textContent(chipAutocompleteText);
    scenarioContext.set(aliasDayOfTheWeek, dayOfTheWeek);
    await page.keyboard.press('Escape');
}

export async function selectCenterByName(cms: CMSInterface, centerName: string) {
    const page = cms.page!;
    await page.fill(locationsLowestLevelAutocompleteInputV3, centerName);
    await cms.waitingAutocompleteLoading();
    await cms.chooseOptionInAutoCompleteBoxByText(centerName);
}

export async function selectStudent(cms: CMSInterface, studentName: string) {
    await cms.page!.fill(studentsAutocompleteFilterInputV2, studentName);
    await cms.waitingAutocompleteLoading();
    await cms.chooseOptionInAutoCompleteBoxByText(studentName);
    await cms.page!.keyboard.press('Escape');
}

export async function selectGrade(cms: CMSInterface, grade: number) {
    const page = cms.page!;

    const studentGrade = convertStudentGrade(grade);

    if (!studentGrade) throw Error('Invalid grade');

    await page.fill(gradesAutocompleteInput, studentGrade);
    await cms.waitingAutocompleteLoading();
    await cms.chooseOptionInAutoCompleteBoxByText(studentGrade);
    await page.keyboard.press('Escape');
}

export async function selectCourse(cms: CMSInterface, courseName: string) {
    const page = cms.page!;
    await page.fill(coursesAutocompleteInput, courseName);
    await cms.waitingAutocompleteLoading();
    await cms.chooseOptionInAutoCompleteBoxByText(courseName);
    await page.keyboard.press('Escape');
}

export async function selectApplyButton(cms: CMSInterface) {
    const page = cms.page!;
    await page.waitForSelector(applyFilterAdvancedButton);
    await schoolAdminApplyFilterAdvanced(cms);
    await page.keyboard.press('Escape');
}

export async function removeAChipInFilterPopup(
    cms: CMSInterface,
    wrapper: string,
    element: string
) {
    await cms.selectElementWithinWrapper(wrapper, element);
    await selectApplyButton(cms);
    await cms.page!.keyboard.press('Escape');
}

export async function assertDayOfTheWeek(
    cms: CMSInterface,
    lessonDayOfTheWeek: string,
    filteredDayOfTheWeek: string
) {
    await cms.instruction(`user checks day of the week`, async function () {
        weExpect(
            lessonDayOfTheWeek,
            'user expects lesson day of the week equal to filtered day of the week'
        ).toEqual(filteredDayOfTheWeek);
    });
}

export async function assertLessonDateAndTime(
    cms: CMSInterface,
    lessonTime: string,
    filteredLessonTime: string,
    type: 'start' | 'end'
) {
    await cms.instruction(`user checks ${type} time`, async function () {
        type === 'start'
            ? weExpect(lessonTime >= filteredLessonTime).toEqual(true)
            : weExpect(lessonTime <= filteredLessonTime).toEqual(true);
    });
}

export async function getLessonDataAtFirstRowOnLessonList(
    cms: CMSInterface
): Promise<RecordRowDataOfLessonList> {
    const page = cms.page!;

    // Get date of the lesson
    const lessonDate = await page.textContent(atTheFirstLessonRowInList(lessonLink));
    if (!lessonDate) throw Error('There is no lesson date');

    // Get time of the lesson
    const lessonTime = await page.textContent(atTheFirstLessonRowInList(lessonTimeColumn));
    if (!lessonTime) throw Error('There is no lesson time');

    const [startTime, endTime] = lessonTime.split(' - ');

    // Get center of the lesson
    const lessonCenter = await page.textContent(atTheFirstLessonRowInList(lessonCenterColumn));
    if (!lessonCenter) throw Error('There is no lesson center');

    // Get teachers of the lesson
    const lessonTeachers = await page.textContent(atTheFirstLessonRowInList(lessonTeacherColumn));
    if (!lessonTeachers) throw Error('There is no lesson teachers');

    return {
        lessonDate,
        startTime,
        endTime,
        lessonCenter,
        lessonTeachers,
    };
}

export async function goToDetailOf1stLessonOnLessonList(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    shouldCheckSearchKeyword = false
) {
    const page = cms.page!;

    await cms.instruction('Go to the first lesson of lesson list', async function () {
        await page.click(atTheFirstLessonRowInList(lessonLink));
    });

    await cms.instruction('User is on lesson detail page', async function () {
        await userIsOnLessonDetailPage(cms);
    });

    if (shouldCheckSearchKeyword) {
        await cms.instruction('User sees search keyword in lesson detail page', async function () {
            const keyword = scenarioContext.get(aliasSearchKeyword);
            const { studentNames } = await getLessonDataOnLessonDetailPage(cms);

            const isSomeStudentNameContainTheKeyWord = studentNames.some(
                (name) => name && name.includes(keyword)
            );

            weExpect(
                isSomeStudentNameContainTheKeyWord,
                'Expect names of students list contain the search keyword'
            ).toEqual(true);
        });
    }
}

export async function filterCheckOnLessonsList(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    criteria: FilteredFieldTitle,
    lessonInfo: CreateLessonRequestData
) {
    const { startTime: lessonInfoStartTime, endTime: lessonInfoEndTime } = lessonInfo;
    if (!lessonInfoStartTime || !lessonInfoEndTime) throw Error('Can not get created lesson info');

    const { lessonDate, endTime, lessonCenter, lessonTeachers } =
        await getLessonDataAtFirstRowOnLessonList(cms);

    switch (criteria) {
        case 'Lesson Start Date': {
            const filteredLessonStartDate = formatDate(lessonInfoStartTime, 'YYYY/MM/DD');
            weExpect(
                filteredLessonStartDate >= lessonDate,
                `Expect filtered date (${filteredLessonStartDate}) >= lesson date (${lessonDate})`
            ).toEqual(true);
            break;
        }

        case 'Lesson End Date': {
            const filteredLessonEndDate = formatDate(lessonInfoEndTime, 'YYYY/MM/DD');
            weExpect(
                filteredLessonEndDate <= lessonDate,
                `Expect filtered date (${filteredLessonEndDate}) <= lesson date (${lessonDate})`
            ).toEqual(true);
            break;
        }

        case 'Start Time':
        case 'End Time': {
            const filteredLessonEndTime = formatDate(lessonInfoEndTime, 'HH:mm');
            const filteredLessonStartTime = formatDate(lessonInfoStartTime, 'HH:mm');

            const beforeEndTimeCondition = filteredLessonStartTime <= endTime;
            const afterEndTimeCondition = filteredLessonEndTime >= endTime;

            weExpect(
                beforeEndTimeCondition || afterEndTimeCondition,
                `Expect filtered start time: ${filteredLessonStartTime} is before or equal lesson end time: ${endTime} 
         or filtered end time: ${filteredLessonEndTime} is after or equal lesson end time: ${endTime}`
            ).toEqual(true);
            break;
        }

        case 'Lesson day of the week': {
            const filteredDayOfTheWeek = scenarioContext.get(aliasDayOfTheWeek);
            const formattedLessonDateAtFirstRow = lessonDate.split('/').join('-');

            // use moment().locale('en') to make sure day of the week is english
            const lessonDayOfTheWeek = moment(formattedLessonDateAtFirstRow)
                .locale('en')
                .format('dddd');

            await assertDayOfTheWeek(cms, lessonDayOfTheWeek, filteredDayOfTheWeek);
            break;
        }

        case 'Center': {
            const filteredCenter = scenarioContext.get(aliasLocationName);

            weExpect(
                filteredCenter,
                'Expect center of the lesson is equal the center that filtered'
            ).toEqual(lessonCenter);
            break;
        }

        case 'Teacher Name': {
            const filteredTeacherName = scenarioContext.get(aliasTeacherName);

            weExpect(
                lessonTeachers,
                'Expect teachers of the lesson contains the teacher name that filtered'
            ).toContain(filteredTeacherName);
            break;
        }
    }
}

async function filterCheckOnLessonDetail(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    criteria: FilteredFieldTitle
) {
    switch (criteria) {
        case 'Course': {
            const filteredCourseName = scenarioContext.get(aliasCourseName);
            const { studentCourses } = await getLessonDataOnLessonDetailPage(cms);

            weExpect(
                studentCourses,
                'Expect courses of students list contain the course that filtered'
            ).toContain(filteredCourseName);
            break;
        }

        case 'Grade': {
            const filteredGrade = scenarioContext.get<number>(aliasGrade);
            const { studentGrades } = await getLessonDataOnLessonDetailPage(cms);

            weExpect(
                studentGrades,
                'Expect grades of students list contain the grade that filtered'
            ).toContain(convertStudentGrade(filteredGrade));
            break;
        }

        case 'Student Name': {
            const filteredStudent = scenarioContext.get(aliasStudentName);
            const { studentNames } = await getLessonDataOnLessonDetailPage(cms);

            weExpect(
                studentNames,
                'Expect names of students list contain the student that filtered'
            ).toContain(filteredStudent);
            break;
        }
    }
}

export async function assertAnOptionInLessonListAndLessonInfo(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    options: FilteredFieldTitle[];
    shouldCheckSearchKeyword?: boolean;
}) {
    const { cms, scenarioContext, options, shouldCheckSearchKeyword } = params;

    const lessonInfo = scenarioContext.get<CreateLessonRequestData>(aliasLessonInfo);

    const onLessonDetailChecks: FilteredFieldTitle[] = ['Course', 'Student Name', 'Grade'];

    const criteriaOnLessonDetail = options.filter((option) =>
        onLessonDetailChecks.includes(option)
    );
    const criteriaOnLessonList = options.filter(
        (option) => !criteriaOnLessonDetail.includes(option)
    );

    for (const criteria of criteriaOnLessonList) {
        await filterCheckOnLessonsList(cms, scenarioContext, criteria, lessonInfo);
    }

    for (let index = 0; index < criteriaOnLessonDetail.length; index++) {
        const isFirstIndex = index === 0;

        const checkKeyword = isFirstIndex ? shouldCheckSearchKeyword : false;
        isFirstIndex &&
            (await goToDetailOf1stLessonOnLessonList(cms, scenarioContext, checkKeyword));

        await filterCheckOnLessonDetail(cms, scenarioContext, criteriaOnLessonDetail[index]);
    }
}
export async function assertLessonDateTimeAndDayOfTheWeek(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    remainedOptionsArray: FilteredFieldTitle[]
) {
    await assertAnOptionInLessonListAndLessonInfo({
        cms,
        scenarioContext,
        options: remainedOptionsArray,
    });
}

export async function removeChipInFilterPopup(cms: CMSInterface, option: FilteredFieldTitle) {
    switch (option) {
        case 'Teacher Name':
            await removeAChipInFilterPopup(cms, teacherAutocompleteV3, chipAutocompleteIconDelete);
            break;
        case 'Center':
            await removeAChipInFilterPopup(
                cms,
                locationsLowestLevelAutocompleteV3,
                chipAutocompleteIconDelete
            );
            break;
        case 'Student Name':
            await removeAChipInFilterPopup(cms, studentsAutocompleteHF, chipAutocompleteIconDelete);
            break;
        case 'Grade':
            await removeAChipInFilterPopup(cms, gradesAutocompleteHF, chipAutocompleteIconDelete);
            break;
        case 'Course':
            await removeAChipInFilterPopup(cms, coursesAutocompleteHF, chipAutocompleteIconDelete);
            break;
        case 'Lesson day of the week':
            await removeAChipInFilterPopup(
                cms,
                filterAdvancedLessonDayOfTheWeek,
                chipAutocompleteIconDelete
            );
            break;
        default:
    }
}

export async function assertFieldValueInPage(page: Page, element: string, filteredOption: string) {
    await page.waitForSelector(element);
    const result = await page.textContent(element);
    weExpect(result).toEqual(filteredOption);
}

export async function seeLessonInfoMatchingRemainedOption(
    cms: CMSInterface,
    remainedOptionsArray: OtherFilteredOptions[],
    filteredFields: FilteredOptionWithExpectedValueAndSelector
) {
    await goToLessonInfoFirstLesson(cms);
    await cms.waitForSkeletonLoading();

    for (const remainedOption of remainedOptionsArray) {
        if (filteredFields[remainedOption]) {
            await assertFieldValueInPage(
                cms.page!,
                filteredFields[remainedOption].selector,
                filteredFields[remainedOption].expectedValue
            );
        }
    }
}

export async function selectOptionInLessonFilterAdvanced(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    option: FilteredFieldTitle
) {
    const lessonInfo = scenarioContext.get<CreateLessonRequestData>(aliasLessonInfo);
    const learners = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias);
    const { startTime, endTime } = lessonInfo;

    switch (option) {
        case 'Lesson Start Date':
            await selectStartOrEndDate(cms, `${startTime?.getDate()}`, 'start');
            break;

        case 'Lesson End Date':
            await selectStartOrEndDate(cms, `${endTime?.getDate()}`, 'end');
            break;

        case 'Teacher Name': {
            const teachers = getUsersFromContextByRegexKeys(scenarioContext, teacherProfileAlias);
            const teacherName = pick1stElement(teachers)?.name;

            if (!teacherName) throw Error('There is no teacher name');

            await selectTeacher(cms, teacherName);
            scenarioContext.set(aliasTeacherName, teacherName);
            break;
        }
        case 'Center': {
            const centerName = scenarioContext.get(aliasLocationName);
            await selectCenterByName(cms, centerName);
            break;
        }
        case 'Start Time': {
            await changeTimePicker({
                cms,
                timePickerSelector: filterAdvancedStartTime,
                hour: Number(startTime?.getHours()),
                minute: Number(startTime?.getMinutes()),
            });
            break;
        }
        case 'End Time': {
            await changeTimePicker({
                cms,
                timePickerSelector: filterAdvancedEndTime,
                hour: Number(endTime?.getHours()),
                minute: Number(endTime?.getMinutes()),
            });
            break;
        }
        case 'Student Name': {
            const studentName = pick1stElement(learners)?.name;
            if (!studentName) throw Error('There is no name of student');

            await selectStudent(cms, studentName);
            scenarioContext.set(aliasStudentName, studentName);
            break;
        }
        case 'Grade': {
            const grade = pick1stElement(learners)?.gradeValue;
            if (!grade) throw Error('There is no grade of student');

            await selectGrade(cms, grade);
            scenarioContext.set(aliasGrade, grade);
            break;
        }
        case 'Lesson day of the week': {
            if (!startTime) throw Error('There is no lesson start time');
            await selectDayOfTheWeek(cms, scenarioContext, Number(startTime.getDay()) + 1);
            break;
        }

        case 'Course':
        default: {
            const courseName = scenarioContext.get(aliasCourseName);
            await selectCourse(cms, courseName);
            break;
        }
    }
}

export async function selectAndApplyFilterLessonInFilterAdvanced(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    optionsArray: FilteredFieldTitle[]
) {
    await schoolAdminOpenFilterAdvanced(cms);

    for (const option of optionsArray) {
        await cms.instruction(`user selects ${option}`, async function () {
            await selectOptionInLessonFilterAdvanced(cms, scenarioContext, option);
        });
    }

    if (arrayHasItem(optionsArray)) {
        await Promise.all([
            cms.waitForGRPCResponse(retrieveLessonEndpoint),
            selectApplyButton(cms),
        ]);

        return;
    }

    await selectApplyButton(cms);
}

export function getFilteredOptionsList(
    scenarioContext: ScenarioContext
): FilteredOptionWithExpectedValueAndSelector {
    const teachers = getUsersFromContextByRegexKeys(scenarioContext, teacherProfileAlias);
    const learners = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias);
    const courseName = scenarioContext.get(aliasCourseName);
    const centerName = scenarioContext.get(aliasLocationName);
    const studentGrade = convertStudentGrade(learners[0].gradeValue);

    if (!studentGrade) throw Error('Invalid grade');

    return {
        'Teacher Name': {
            selector: lessonInfoTeachers,
            expectedValue: teachers[0].name,
        },
        'Student Name': {
            selector: lessonInfoStudentNameColumn,
            expectedValue: learners[0].name,
        },
        Center: {
            selector: lessonInfoLocation,
            expectedValue: centerName,
        },
        Grade: {
            selector: lessonInfoGradeColumn,
            expectedValue: studentGrade,
        },
        Course: {
            selector: lessonInfoCourseColumn,
            expectedValue: courseName,
        },
    };
}
