import { genId } from '@legacy-step-definitions/utils';

import {
    KeyNotificationEvent,
    KeyNotificationStatus,
    KeyNotificationType,
} from '@supports/services/notificationmgmt-notification/const';
import { UpsertNotificationProps } from '@supports/services/notificationmgmt-notification/request-types';

import { QuestionnaireDataTableRow } from './communication-notification-questionnaire-definitions';
import { createQuestionsFromQuestionnaireData } from './communication-utils';
import { ContentState, EditorState } from 'draft-js';
import { Questionnaire } from 'manabuf/common/v1/notifications_pb';
import { Timestamp } from 'manabuf/google/protobuf/timestamp_pb';

export interface UpsertNotificationDataProps
    extends Pick<
        UpsertNotificationProps,
        | 'receiverIdsList'
        | 'courseIds'
        | 'mediaIds'
        | 'gradeIds'
        | 'targetGroup'
        | 'isAllCourses'
        | 'isAllGrades'
        | 'scheduledAt'
    > {
    title?: UpsertNotificationProps['title'];
    status?: UpsertNotificationProps['status'];
}

export function createANotificationGrpc(
    props: UpsertNotificationDataProps
): UpsertNotificationProps {
    const generatedNotificationId = genId();

    const title = `Notification E2E gRPC test ${generatedNotificationId}`;
    const content = `Notification E2E gRPC Content ${generatedNotificationId}`;

    const editorStateFromHtml = EditorState.createWithContent(ContentState.createFromText(content));

    const createdNotificationData = {
        notificationId: '',
        title,
        content: {
            raw: editorStateFromHtml,
            contentHTML: content,
        },
        event: KeyNotificationEvent.NOTIFICATION_EVENT_NONE,
        status: KeyNotificationStatus.NOTIFICATION_STATUS_DRAFT,
        type: KeyNotificationType.NOTIFICATION_TYPE_COMPOSED,
        isImportant: false,
        excludedGenericReceiverIdsList: [],
        createdUserId: '',
    };

    return { ...createdNotificationData, ...props };
}

export function createQuestionnaireGrpc(
    resubmitAllowed: boolean,
    questionnaireData: QuestionnaireDataTableRow[],
    expiredAt?: Date
): Questionnaire.AsObject {
    const questionnaire = new Questionnaire();
    const questionnaireQuestions = createQuestionsFromQuestionnaireData(questionnaireData);

    questionnaire.setResubmitAllowed(resubmitAllowed);
    questionnaire.setQuestionsList(questionnaireQuestions);
    const timestamp = new Timestamp();
    if (expiredAt == null) {
        timestamp.setSeconds(2000000000);
    } else {
        timestamp.setSeconds(Math.round(expiredAt.getTime() / 1000));
    }
    timestamp.setNanos(0);
    questionnaire.setExpirationDate(timestamp);
    return questionnaire.toObject();
}
