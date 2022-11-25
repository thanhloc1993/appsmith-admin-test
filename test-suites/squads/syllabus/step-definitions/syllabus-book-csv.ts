import { randomInteger } from '@legacy-step-definitions/utils';

import moment from 'moment-timezone';

interface StudyPlanTimeStructure {
    availableFrom: string;
    availableTo: string;
    startDate: string;
    endDate: string;
}

export type StudyPlanTestCase =
    | 'available'
    | 'unavailable'
    | 'random'
    | 'late'
    | 'active'
    | 'overdue'
    | 'empty start and due date'
    | 'paste and tab for integration test'
    | 'startTime less than availableTime 7 days'
    | 'startTime greater than or equal availableTime 7 days'
    | 'empty start date'
    | 'empty due date';

export const generateStudyplanTime = (testCase: StudyPlanTestCase): StudyPlanTimeStructure => {
    const currentDate = new Date();

    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    if (testCase === 'paste and tab for integration test') {
        const availableFrom = moment(
            new Date(currentDate).setMonth(currentMonth - randomInteger(1, 4))
        ).toISOString();

        const availableToDate = new Date(currentDate);
        availableToDate.setMonth(currentDate.getMonth() + randomInteger(4, 8));

        const availableTo = moment(availableToDate).toISOString();

        const startTime = moment(
            new Date(availableFrom).setDate(currentDay + randomInteger(1, 30))
        ).toISOString();

        const endTime = moment(
            new Date(availableTo).setDate(availableToDate.getDate() - randomInteger(1, 30))
        ).toISOString();

        return {
            availableFrom,
            availableTo,
            startDate: startTime,
            endDate: endTime,
        };
    }

    if (testCase === 'startTime greater than or equal availableTime 7 days') {
        const availableFrom = moment(
            new Date(currentDate).setMonth(currentMonth - randomInteger(1, 4))
        ).toISOString();

        const availableToDate = new Date(currentDate);
        availableToDate.setMonth(currentDate.getMonth() + randomInteger(4, 8));

        const availableTo = moment(availableToDate).toISOString();

        const startTime = moment(
            new Date(availableTo).setDate(availableToDate.getDate() - randomInteger(7, 30))
        ).toISOString();

        const endTime = moment(
            new Date(availableTo).setDate(availableToDate.getDate() - randomInteger(1, 30))
        ).toISOString();

        return {
            availableFrom,
            availableTo,
            startDate: startTime,
            endDate: endTime,
        };
    }

    if (testCase === 'startTime less than availableTime 7 days') {
        const availableFrom = moment(
            new Date(currentDate).setMonth(currentMonth - randomInteger(1, 4))
        ).toISOString();

        const availableToDate = new Date(currentDate);
        availableToDate.setMonth(currentDate.getMonth() + randomInteger(4, 8));

        const availableTo = moment(availableToDate).toISOString();

        const startTime = moment(
            new Date(availableToDate).setDate(currentDay - randomInteger(1, 6))
        ).toISOString();

        const endTime = moment(
            new Date(availableTo).setDate(availableToDate.getDate() - randomInteger(1, 30))
        ).toISOString();

        return {
            availableFrom,
            availableTo,
            startDate: startTime,
            endDate: endTime,
        };
    }

    if (testCase == 'active' || testCase == 'overdue') {
        // Need to set long available time in order to adjust date time from teacher web
        const currentDate = new Date();
        const startTime = moment(
            new Date(currentDate).setMonth(currentDate.getMonth() - 3)
        ).toISOString();
        const endTime = moment(
            new Date(currentDate).setMonth(currentDate.getMonth() + 2)
        ).toISOString();
        const dueTime =
            testCase == 'active'
                ? endTime
                : moment(new Date(currentDate).setDate(currentDate.getDate() - 2)).toISOString();
        const result: StudyPlanTimeStructure = {
            availableFrom: startTime,
            availableTo: endTime,
            startDate: startTime,
            endDate: dueTime,
        };
        return result;
    }

    if (testCase == 'empty start and due date') {
        const currentDate = new Date();
        const startTime = moment(
            new Date(currentDate).setMonth(currentDate.getMonth() - 3)
        ).toISOString();
        const endTime = moment(
            new Date(currentDate).setMonth(currentDate.getMonth() + 2)
        ).toISOString();
        const result: StudyPlanTimeStructure = {
            availableFrom: startTime,
            availableTo: endTime,
            startDate: '',
            endDate: '',
        };
        return result;
    }

    if (testCase == 'empty start date') {
        const currentDate = new Date();
        const currentTime = moment(currentDate).toISOString();
        const startTime = moment(
            new Date(currentDate).setMonth(currentDate.getMonth() - 3)
        ).toISOString();
        const endTime = moment(
            new Date(currentDate).setMonth(currentDate.getMonth() + 2)
        ).toISOString();
        const result: StudyPlanTimeStructure = {
            availableFrom: startTime,
            availableTo: endTime,
            startDate: '',
            endDate: currentTime,
        };
        return result;
    }

    if (testCase == 'empty due date') {
        const currentDate = new Date();
        const currentTime = moment(currentDate).toISOString();
        const startTime = moment(
            new Date(currentDate).setMonth(currentDate.getMonth() - 3)
        ).toISOString();
        const endTime = moment(
            new Date(currentDate).setMonth(currentDate.getMonth() + 2)
        ).toISOString();
        const result: StudyPlanTimeStructure = {
            availableFrom: startTime,
            availableTo: endTime,
            startDate: currentTime,
            endDate: '',
        };
        return result;
    }

    const minutes = testCase === 'unavailable' ? -90 : 90;
    const milliseconds = minutes * 60000;

    const startTime = moment(new Date(Date.now() - milliseconds)).toISOString();
    const endTime =
        testCase === 'unavailable'
            ? moment(new Date(Date.now() - minutes * 3 * 60000)).toISOString()
            : moment(new Date(Date.now() + milliseconds)).toISOString();
    const dueTime = testCase === 'late' ? startTime : endTime;

    const result: StudyPlanTimeStructure = {
        availableFrom: startTime,
        availableTo: endTime,
        startDate: startTime,
        endDate: dueTime,
    };

    return result;
};
