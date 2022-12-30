import { QuestionnaireMode } from '@supports/enum';

export const messagesTabKey = 'Messages Tab';

export const supportGroupItemKey = (name: string) => `${name} Group Conversation Item`;

export const notificationItem = (index: number): string => `notification key - ${index}`;

export const notificationItemTitleKey = (index: number): string =>
    `Notification Item Title - ${index}`;

export const notificationItemContentKey = (index: number): string =>
    `Notification Item Content - ${index}`;

export const readNotificationStatus = (active: boolean, index: number) =>
    active ? `Unread ${index}` : `Read ${index}`;

export const attachmentPdfKey = (name: string): string => `Attachment PDF with ${name}`;

export const attachmentImageKey = (name: string): string => `Attachment Image with ${name}`;

export const notificationBadge = (totalNewNotification: number): string =>
    `Notification Badge - ${totalNewNotification}`;

export const conversationUserInfoAvatar = (url: string, userId: string) =>
    `Conversation User Info - Avatar ${url} ${userId}`;

export const conversationUserInfoName = (name: string, userId: string) =>
    `Conversation User Info - Name ${name} ${userId}`;

export const moreOptionButton = (userId: string) =>
    `Conversation User More Option Button - ${userId}`;

export const viewInfoButton = 'View Profile Button';

export const closeParticipantListButton = 'Close Participant List Button';

export const participantListTitle = (name: string) => `Participant List Title - ${name}`;

export const participantListAvatar = (url: string) => `Participant List Avatar - ${url}`;

export const notificationDetailScrollView = 'Notification Detail Scroll View';

export const questionnaireViewMode = 'Questionnaire View Mode Key';

export const questionnaireEditMode = 'Questionnaire Edit Mode Key';

export const questionnaireQuestionItem = (
    mode: QuestionnaireMode,
    questionIndex: number,
    questionType: number
): string => `${mode}-Question ${questionIndex}-Type ${questionType}`;

export const questionChoiceItem = (questionIndex: number, choiceIndex: number): string =>
    `Choice ${choiceIndex}-Question ${questionIndex}`;

export const questionAnswerItem = (questionIndex: number, answerIndex: number): string =>
    `Answer ${answerIndex}-Question ${questionIndex}`;

export const questionnaireSubmitButton = (isEnable = true): string => {
    return `Questionnaire Submit Button ${isEnable ? 'Enabled' : 'Disabled'}`;
};
export const questionnaireResubmitButton = 'Questionnaire Resubmit Button';
export const questionnaireSubmissionSuccessSnackbar = 'Questionnaire Submission - Success Snackbar';
export const questionnaireSubmissionErrorSnackbar = 'Questionnaire Submission - Error Snackbar';

export const questionnaireValidationErrorKey = (questionIndex: number): string =>
    `Questionnaire Validation Error - Question ${questionIndex}`;

export const submitQuestionnaireAcceptButton = 'Questionnaire Submission - Accept Button';

export const submitQuestionnaireCancelButton = 'Questionnaire Submission - Cancel Button';

export const questionnaireExpiredStatus = 'Questionnaire Expired Status';

export const notificationDetailBackButton = 'Close Button';

export const questionnaireDiscardChangesAcceptButton =
    'Questionnaire Discard Changes - Accept Button';

export const questionnaireDiscardChangesCancelButton =
    'Questionnaire Discard Changes - Cancel Button';

export const targetNameKey = (targetName: string): string => `Target name-${targetName}`;

export const notificationsTabBarAll = 'Notifications Tab Bar - All';

export const notificationsTabBarImportantOnly = 'Notifications Tab Bar - Important Only';

export const notificationItemIcon = (isImportant: boolean, isQuestionnaire: boolean): string =>
    `Notification Icon - important:${isImportant} - questionnaire${isQuestionnaire}`;

export const interactiveMoreOptionButtonKey = (index: number): string =>
    `Interactive more options button key - ${index}`;

export const unsendMessageConfirmButton = 'Unsend Message Confirm Button';

export const unsendMessageCancelButton = 'Unsend Message Cancel Button';

export const unsendMessagePopupItemKey = 'Unsend Message Popup Item Key';

export const deletedMessageItemKey = (index: number): string =>
    `Deleted message item key - ${index}`;
