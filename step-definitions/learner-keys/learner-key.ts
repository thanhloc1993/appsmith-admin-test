import { LoadingStatus } from 'step-definitions/types/common';
import { QuizProgressItemState } from 'test-suites/squads/syllabus/step-definitions/syllabus-stop-doing-exam-lo-steps';

export class LearnerKeys {
    static questionFillTheBlank: string = `Question Fill The Blank`;

    static answerFillTheBlankNumber(position: number) {
        return `Answer Fill The Blank Length - ${position}`;
    }

    static oidc_webview_dialog: string = `OIDC Webview dialog`;

    static showCorrectAnswerText = (correctAnswer: string): string =>
        `Show correct answer text ${correctAnswer}`;

    static quizAnswerOption = (answer: string): string => `Quiz Answer ${answer}`;

    static showQuizProgressBarButton: string = `Show Quiz Progress Bar Button`;

    static showQuizProgress = (lengthOfQuizzes: number): string =>
        `Show Quiz Progress ${lengthOfQuizzes} Quizzes`;

    static homeScreen: string = `Home Screen`;

    static homeScreenDrawerButton: string = `home Screen Drawer Button`;

    static homeDrawer: string = `home Drawer`;

    static authMultiUsersScreen: string = `Auth Multi Users Screen`;

    static authSearchOrganizationScreen: string = `auth Search Organization Screen`;

    static attemptHistoryScreen: string = `Attempt History Screen`;

    static attemptHistoryRecord = (totalRecords: number): string =>
        `Attempt History Record ${totalRecords}`;

    static retryIncorrectButton: string = `Retry Incorrect Button`;

    static practiceAllButton: string = `Practice All Button`;

    static takeAgainButton: string = `Take Again Button`;

    static masteryLevel = (score: string): string => `Mastery Level ${score}`;

    static totalAttempts = (totalAttempts: number): string => `Total Attempts ${totalAttempts}`;

    static quizSetResult = (index: number, score: string): string =>
        `Quiz Set index ${index} gets score ${score}`;

    static quizSetRetryIcon = (index: number, isRetry: boolean): string =>
        `Quiz Set index ${index} isRetry ${isRetry}`;

    static addANewAccountButton: string = `add A New Account Button`;

    static loginWithMultiTenantButton: string = `Login With Multi tenant Button`;

    static logoutButton: string = `logout Button`;

    static getTotalLearningProgressFailedDialog: string = `Get Total Learning Progress Failed Dialog`;

    static confirmedLogoutDialog: string = `Confirmed Logout Dialog`;

    static confirmedLogoutDialogYesButton: string = `Confirmed Logout Dialog Yes Button`;

    static confirmedLogoutDialogNoButton: string = `Confirmed Logout Dialog No Button`;

    static manageAccountButton: string = `manage Account Button`;

    static authSignInScreen: string = `auth SignIn Screen`;

    static authSendPasswordResetEmailScreen: string = `auth SendPasswordResetEmail Screen`;

    static pageNotFoundScreen: string = `Page Not Found Screen`;

    static returnToTheWebsiteButton: string = ` Return to the website Button`;

    static emailTextBox: string = `email TextBox`;

    static passwordTextBox: string = `password TextBox`;

    static organizationTextBox = `Organization TextBox`;

    static forgotPasswordButton: string = `forgot Password`;

    static signInButton: string = `signIn Button`;

    static searchOrgButton: string = `search Org Button`;

    static welcomeBackScreen: string = `welcome back screen`;

    static letStartButton: string = `let start button`;

    static back_button: string = `Back Button`;

    static app_bar: string = `App Bar`;

    static learning_tab: string = `Learning Tab`;

    static todos_tab: string = `To-Dos Tab`;

    static lesson_tab: string = `Lesson Tab`;

    static messages_tab: string = `Messages Tab`;

    static stats_tab: string = `Stats Tab`;

    static learning_page: string = `Learning Page`;

    static todos_page: string = `To-Dos Page`;

    static lesson_page: string = `Lesson Page`;

    static messages_page: string = `Messages Page`;

    static stats_page: string = `Stats Page`;

    static active_tab: string = `Active Tab`;

    static overdue_tab: string = `Overdue Tab`;

    static completed_tab: string = `Completed Tab`;

    static active_page: string = `Active To-Dos Page`;

    static overdue_page: string = `Overdue To-Dos Page`;

    static completed_page: string = `Completed To-Dos Page`;

    static study_plan_item(name: string) {
        return `${name} Study Plan`;
    }

    static study_plan_item_with_position(index: number, name: string) {
        return `${index} ${name} Study Plan`;
    }

    static assignment(name: string) {
        return `${name} Assignment`;
    }

    static assignmentScrollview: string = 'Assignment Scroll View';

    static assignment_due_date(name: string, dueDate: string) {
        return `${name} Assignment ${dueDate}`;
    }

    static assignment_screen([name = ``]) {
        return `${name} Assignment Screen`;
    }

    static scheduled_lo(loName: string) {
        return `${loName} Scheduled LO`;
    }

    static scheduled_lo_due_date(loName: string, dueDate: string) {
        return `${loName} Scheduled LO ${dueDate}`;
    }

    static assignmentTopDate(dueDate: string) {
        return `Assignment top date ${dueDate}`;
    }

    static assignmentIsClosed: string = `Assignment is closed`;

    static next_button: string = `Next Button`;

    static assignment_completed_screen: string = `Assignment Completed Screen`;

    static lo_completed_screen: string = `LO Completed Screen`;

    static success_snackbar: string = `Success SnackBar`;

    static error_snackbar: string = `Error SnackBar`;

    static default_snackbar: string = `Default SnackBar`;

    static info_snackbar: string = `Info SnackBar`;

    static assignment_note_field: string = `Assignment Note Field`;

    static submit_button: string = `Submit Button`;

    static submit_button_unenabled: string = `Submit Button Unenabled`;

    static confirm_button: string = `Confirm Button`;

    static noDialogButton: string = 'No confirm button';

    static yesDialogButton: string = 'Yes confirm button';

    static cancel_button: string = `Cancel Button`;

    static submitted_assignment: string = `Submitted Assignment`;

    static assignment_video_teacher(videoName: string) {
        return `${videoName} Assignment Video Teacher`;
    }

    static assignment_instruction_field_text(instruction: string) {
        return `Assignment Instruction Field Text ${instruction}`;
    }

    static assignment_note_field_text(note: string) {
        return `Assignment Note Field Text ${note}`;
    }

    static assignmentTextFeedbacks(content: string): string {
        return `Assignment text feedbacks ${content}`;
    }

    static record_assignment_screen: string = `Record Assignment Screen`;

    static record_assignment_review_screen: string = `Record Assignment Review Screen`;

    static start_record_button: string = `Start Record Button`;

    static stop_record_button: string = `Stop Record Button`;

    static attach_answer_button: string = `Attach Answer Button`;

    static assignment_submitted_attachment(index: number) {
        return `Assignment Submitted Attachment ${index}`;
    }

    static assignment_submitted_attachment_title(index: number) {
        return `Assignment Submitted Attachment Title ${index}`;
    }

    static assignment_submitted_attachment_delete_button(index: number) {
        return `Assignment Submitted Attachment Delete Button ${index}`;
    }

    static assignment_teacher_attachment_title(index: number) {
        return `Assignment Teacher Attachment Title ${index}`;
    }

    static attachment_loading: string = `Attachment Loading`;

    static loading_dialog: string = `Loading Dialog`;

    static attach_attachment_button: string = `Attach Attachment Button`;

    static subject(name: string) {
        return `${name} Subject`;
    }

    static lo_list_screen(topicName: string) {
        return `${topicName} LO List Screen`;
    }

    static lo(loName: string) {
        return `${loName} LO`;
    }

    static phone_number_text_field: string = `Phone number Text Field`;

    static create_account_text: string = `Create account Text`;

    static login_button: string = `Login Button`;

    static login_screen: string = `Login Screen`;

    static log_in_text: string = `Log in Text`;

    static register_screen: string = `Register Screen`;

    static sign_up_with_phone_button: string = `Sign up with phone Button`;

    static quiz_finished_screen(loName: string) {
        return `${loName} Quiz Finished Screen`;
    }

    static quiz_finished_achievement_screen(loName: string) {
        return `${loName} Quiz Finished Achievement Screen`;
    }

    static learning_finished_topic_screen(topic: string) {
        return `${topic} Learning Flow Finished Topic Screen`;
    }

    static topic_list_button: string = `Topic List Button`;

    static updateNowButton: string = `Update Now Button`;

    static forceUpdateScreen: string = `Force Update Screen`;

    static topic_icon_url(url: string) {
        return `topic icon ${url}`;
    }

    static video_and_pdf_screen(loName: string) {
        return `${loName} Video And Pdf Screen`;
    }

    static quiz_screen(loName: string) {
        return `${loName} Quiz Screen`;
    }

    static exam_lo_quiz_screen(loName: string) {
        return `${loName} Exam LO Quiz Screen`;
    }

    static option(index: number) {
        return `Option ${index}`;
    }

    static quiz: string = `Quiz`;

    static currentQuizNumber = (currentIndex: number): string =>
        `Current Quiz Number ${currentIndex}`;

    static answer_correct: string = `Answer Correct`;

    static retry_button: string = `Retry Button`;

    static next_quiz_button: string = `Next Quiz Button`;

    static course(course: string) {
        return `${course} Course`;
    }

    static courseAvatar(courseAvatar: string) {
        return `Course Avatar ${courseAvatar}`;
    }

    static book_detail_screen: string = `Book Detail Screen`;

    static select_book_button: string = `Select Book Button`;

    static select_book_screen: string = `Select Book Screen`;

    static list_book: string = `List Book`;

    static selectedBook(book: string) {
        return `${book} Book Selected`;
    }

    static book(book: string) {
        return `${book} Book`;
    }

    static topic(topicName: string) {
        return `${topicName} Topic`;
    }

    static topicWithPosition(index: number, topicName: string) {
        return `${index} ${topicName} Topic`;
    }

    static chapter(chapterName: string) {
        return `${chapterName} Chapter`;
    }

    static chapterWithPosition(index: number, chapterName: string) {
        return `${index} ${chapterName} Chapter`;
    }

    static close_button: string = `Close Button`;

    static close_snackbar_button: string = `Close Snack Bar Button`;

    static back_to_list_text: string = `Back to list Text`;

    static flash_card_preview_screen = (loName: string): string =>
        `${loName} Flash Card Preview Screen`;

    static flash_card_practice_screen = (loName: string): string =>
        `${loName} Flash Card Practice Screen`;

    static switchAccountButton: string = `switch Account Button`;

    static switchAccountScreen: string = `Switch Account Screen`;

    static manageAccountScreen: string = `Manage Account Screen`;

    static profileDetailsScreen: string = `Profile Details Screen`;

    static editAccountScreen: string = `Edit Account Screen`;

    static editProfileButton: string = `Edit profile button`;

    static nameTextInput: string = `Name text input`;

    static editAccountDrawerItem: string = `Edit Account drawer item`;

    static entryExitRecordsDrawerItem: string = `Entry Exit Records Drawer Item`;

    static recordTimeText = (id: number, type: string, text: string): string =>
        `Entry Exit Record ${id} ${type} ${text} Text`;

    static recordsFilterButton: string = 'Records Filter Button';

    static recordsFilterChildItem = (recordFilter: string): string =>
        `${recordFilter} Records Filter Child Item`;

    static emptyExitRecords: string = `Empty Exit Records`;

    static myQrCodeDrawerItem: string = `My Qr Code Drawer Item`;

    static qrCode: string = `QR Code`;

    static learnerQrCodeScreen: string = `Learner QR Code Screen`;

    static saveButton: string = `Save button`;

    static drawerHeader: string = `Drawer header`;

    static myProfileDrawerItem: string = `My Profile drawer item`;

    static user = (identity: string): string => `User ${identity}`;

    static userLoggedOut = (userId: string): string => `User Logged out ${userId}`;

    static cachedUserOptionButton = (identity: string): string => `User ${identity} Option Button`;

    static cachedUserDeleteOptionButton = (identity: string): string =>
        `User Delete ${identity} Option Button`;

    static joinLiveLessonButton = (
        lessonId: string,
        lessonName: string,
        canJoin: boolean
    ): string => `Join live lesson - ${lessonId} ${lessonName} button ${canJoin}`;

    static liveLessonsEmpty: string = `Live lesson empty`;

    static liveLessonsList: string = `Live lesson list`;

    static dialogJoinLiveLessonLoading: string = `Live lesson loading`;

    static waitingRoomTeacher: string = `Waiting Room Banner`;

    static leaveForNowButton: string = `Leave room button`;

    static lessonsCalendarIcon: string = `Lessons calendar icon`;

    static schedulePage: string = `Schedule page`;

    static scheduleTitlePage: string = `Schedule title page`;

    static previousMonth: string = `Previous month`;

    static nextMonth: string = `Next month`;

    static dateSelectedDot: string = `Date selected dot`;

    static courseFilterButton: string = `Course filter button`;

    static courseFilterTitle: string = `Course filter title`;

    static selectCourseScreen: string = `Select Course Screen`;

    static gradeList: string = `Grade List`;

    static grade = (gradeName: string): string => `${gradeName} Grade`;

    static courseList: string = `Course List`;

    static playButton: string = `Play Button`;

    static pauseButton: string = `Pause Button`;

    static sliderAudio: string = `Slider Audio`;

    static viewAttachmentScreen: string = `View Attachment Screen`;

    static currentTimeAudio: string = `Current Time Audio`;

    static durationTimeAudio: string = `Duration Time Audio`;

    static attachment = (attachmentName: string): string => `${attachmentName} Attachment`;

    static currentAndDurationTimeAudio: string = `Current And Duration Time Audio`;

    static notificationIcon: string = `Notification Icon`;

    static notificationsScreen: string = `Notifications Screen`;

    static listNotificationKey: string = `List Notification Key`;

    static leaveButtonKey: string = `Leave Button Key`;

    /// Manual Input question keys
    static correctManualInputOptionKey: string = `Correct Manual Input Option`;

    static manualInputOptionList: string = `Manual Input Option List`;

    static manualInputQuestionTitle: string = `Manual Input Question Title`;

    static multipleAnswersQuestionTitle: string = `Multiple Answers Question Title`;

    static completeAndShowExplanationButton: string = `Complete And Show Explanation Button`;

    static fillInTheBlankQuestionTitle: string = `Fill in the blank Question Title`;

    static multipleChoiceQuestionTitle: string = `Multiple Choice Question Title`;

    static incorrectManualInputOptionKey: string = `Incorrect Manual Input Option`;

    static brightCoveVideoKey: string = `Brightcove video key`;

    static brightCoveVideoIdKey = (videoId: string): string => `Brightcove video id key ${videoId}`;

    static studyGuideKey: string = `Study Guide PDF key`;

    static studyGuideURLKey = (url: string): string => `Study Guide URL key ${url}`;

    static flashCardItem = (index: number, isActiveTerm: boolean): string =>
        `Flash card item ${index} ${isActiveTerm}`;

    static flashCardItemWithContent = (index: number, isTerm: boolean, content: string): string =>
        `Flash card item content ${index} ${isTerm ? `Term` : `Definition`} ${content}`;

    static flashCardItemTerm = (index: number): string => `Flash card item term ${index}`;

    static flashCardItemDefinition = (index: number): string =>
        `Flash card item definition ${index}`;

    static app_bar_profile: string = `App Bar profile`;

    static answerCorrect = (index: number): string => `Answer Correct ${index}`;

    static answerIncorrect = (index: number): string => `Answer Wrong${index}`;

    static switchChildrenButton: string = `Switch Child Button`;

    static currentChildText: string = `Current Child Text`;

    static learningProgressPageView: string = `Learning Progress Page View`;

    static upload_avatar_button: string = `Upload Avatar Button`;

    static uploading_avatar: string = `Uploading Avatar`;

    static upload_avatar_success: string = `Upload Avatar Success`;

    static avatar: string = `Avatar`;

    static defaultAvatar: string = `default Avatar`;

    static avatarWidget = (url: string): string => `Avatar Widget ${url}`;

    static avatarLocalFileWidget: string = `Avatar Local File Widget`;

    static avatarWidgetInHomeDrawer = (url: string): string =>
        `Avatar Widget In Home Drawer ${url}`;

    static kidAvatarWidget = (url: string): string => `Kid Avatar Widget ${url}`;

    static uploaded_avatar: string = `Uploaded Avatar`;

    static chapter_with_topic_list: string = `Chapter with topic list`;

    static empty_chapter_list: string = `Empty chapter list`;

    static lo_and_assignment_list: string = `LO and assignment list`;

    static empty_course: string = `Empty Course`;

    static error_snack_bar: string = `Error Snack Bar`;

    static otp_screen: string = `Otp Screen`;

    static otp_text_field: string = `Otp Text Field`;

    static welcom_back_screen: string = `Welcom back Screen`;

    static start_manabie_button: string = `Start Manabie Button`;

    static home_screen: string = `Home Screen`;

    static stats_pages: string = `Stats Page`;

    static account_avatar: string = `Account Avatar`;

    static drawer: string = `Drawer`;

    static see_your_profile_tab: string = `See your profile Tab`;

    static ask_teacher: string = `Ask Teacher Tab`;

    static my_packages_tab: string = `My Packages Tab`;

    static notification_tab: string = `Notification Tab`;

    static join_a_class_tab: string = `Join A Class Tab`;

    static contact_us_tab: string = `Contact Us Tab`;

    static manabie_plans_screen: string = `Manabie Plans Screen`;

    static join_a_class_screen: string = `Join A Class Screen`;

    static total_progress_button: string = `Total Progress Button`;

    static total_progress_screen: string = `Total Progress Screen`;

    static quizes_page: string = `Quizes Page`;

    static quiz_progress_number: string = `Quiz Progress Number`;

    static quiz_title_text: string = `Quiz Title Text`;

    static terms_tab: string = `Terms Tab`;

    static privacy_policy_tab: string = `Privacy Policy Tab`;

    static submission_tab: string = `Submission Tab`;

    static instruction_tab: string = `Instruction Tab`;

    static topic_list_screen(subjectName: string) {
        return `${subjectName} Topic List Screen`;
    }

    static quiz_finished_topic_screen(topic: string) {
        return `${topic} Quiz Finished Topic Screen`;
    }

    static messageLessonButton: string = `Message Lesson Button`;

    static endLessonButton: string = `End Lesson Button`;

    static endLessonDialog: string = `End Lesson Dialog`;

    static requestMicroDialog: string = `Request Micro Dialog`;

    static requestVideoDialog: string = `Request Video Dialog`;

    static acceptRequestButton: string = `Accept Request Button`;

    static declineRequestButton: string = `Decline Request Button`;

    static endNowButton: string = `End Now Button`;

    static lessonItem = (id: string, name: string): string => `${id} ${name} Live Lesson Item`;

    static listCameraView: string = `Live Lesson List Camera View`;

    static assignment_scrollview: string = `Assignment Scroll View`;

    static liveStreamScreen: string = `Live Stream Screen`;

    static raiseHandButton = ([raiseHand = false]): string => `Raise Hand Button ${raiseHand}`;

    static appBarName(name: string) {
        return `App Bar Name ${name}`;
    }

    static snackBar: string = `Snack Bar`;

    static waitingTeacherJoin: string = `Waiting Teacher Join`;

    static listLessonsName = (names: string): string => `List Lesson Name ${names}`;

    static profileDetailsScreenUserName = (name: string): string =>
        `Profile Details Screen User Name ${name}`;

    static notificationDetail: string = `Notification Detail`;

    static notificationDetailTitle: string = `Notification Detail Title`;

    static notificationDetailContent: string = `Notification Detail Content`;

    static viewAssignmentButton: string = `View Assignment Button`;

    static microButtonLiveLesson = (active: boolean): string =>
        `Micro Button Live Lesson Active ${active}`;

    static cameraButtonLiveLesson = (active: boolean): string =>
        `Camera Button Live Lesson Active ${active}`;

    static microButtonLiveLessonInteraction = (interaction: boolean): string =>
        `Micro Button Live Lesson Interaction ${interaction}`;

    static cameraButtonLiveLessonInteraction = (interaction: boolean): string =>
        `Camera Button Live Lesson Interaction ${interaction}`;

    static annotationBar: string = `Live Lesson Annotation Bar`;

    static annotationButton: string = `Live Lesson Annotation Button`;

    static closeAnnotationBarButton: string = `Live Lesson White Board Close Annotation Button`;

    static toolPicker: string = `Live Lesson White Board Close Annotation Button`;

    static selectorTool: string = `Live Lesson White Board Selector Tool`;

    static laserPointerTool: string = `Live Lesson White Board Laser Pointer Tool`;

    static textTool: string = `Live Lesson White Board Text Tool`;

    static pencilTool: string = `Live Lesson White Board Pencil Tool`;

    static rectangleTool: string = `Live Lesson White Board Rectangle Tool`;

    static ellipseTool: string = `Live Lesson White Board Ellipse Tool`;

    static straightTool: string = `Live Lesson White Board Straight Tool`;

    static handTool: string = `Live Lesson White Board Hand Tool`;

    static eraserTool: string = `Live Lesson White Board Eraser Tool`;

    static annotationBarStrokePathKey = (size: number, selected: boolean) =>
        `Live Lesson Annotation Bar Stroke Path size ${size} selected ${selected}`;

    static annotationBarColorPickerColorIndexKey = (colorIndex: number, selected: boolean) =>
        `Live Lesson Annotation Bar Color Picker Color Index ${colorIndex} selected ${selected}`;

    static notificationAttachmentItem = (name: string, index: number): string =>
        `Notification Attachment ${name} at ${index}`;

    static liveLessonScheduleCalendar: string = `Live Lesson Schedule Calendar`;

    static liveLessonScheduleCalendarPreviousButton: string = `Live Lesson Schedule Calendar Previous Button`;

    static liveLessonScheduleCalendarNextButton: string = `Live Lesson Schedule Calendar Next Button`;

    static normalDate = (day: number, month: number): string => `Normal Date ${day} ${month}`;

    static startDayLiveLesson: string = `Start Day Live Lesson `;

    static startTimeLiveLesson: string = `Start Time Live Lesson `;

    static liveLessonWhiteBoardView: string = `Live Lesson White Board View`;

    static liveLessonSharedScreenView: string = `Live Lesson Shared Screen View`;

    static liveLessonWhiteBoardIndex = (index: number): string =>
        `Live Lesson White Board Index ${index}`;

    static quizCircularProgressFractionResult: string = `Quiz Circular Progress Fraction Result`;

    static quizFinishedTopicProgressTitle: string = `Quiz Finish Topic Progress Title`;

    static quizFinishedAchievementTitle: string = `Quiz Finish Achievement Title`;

    static quizFinishedAchievementDescription: string = `Quiz Finish Achievement Description`;

    static noColorCrown: string = `No Color Crown`;

    static bronzeCrown: string = `Bronze Crown`;

    static goldCrown: string = `Gold Crown`;

    static silverCrown: string = `Silver Crown`;

    static liveLessonVideoView = (videoId = ''): string => `Live Lesson Video View ${videoId}`;

    static disconnectingScreenLiveLesson: string = `Disconnecting Screen Live Lesson`;

    static liveLessonCameraViewStatus: string = `Live Lesson Camera View`;

    static liveLessonSpeakerStatus = (userId: string, active: boolean): string =>
        `Live Lesson Speaker Status ${userId} ${active}`;

    static liveLessonNoneCameraView = (userId: string): string =>
        `Live Lesson None Camera View ${userId}`;

    static liveLessonDisconnectCameraView: string = `Live Lesson Disconnect Camera View`;

    static liveLessonRightDrawer = (visible: boolean): string =>
        `Live Lesson Right Drawer ${visible}`;

    static liveLessonChatTab: string = `Live Lesson Chat Tab`;

    static flashCardSwipeList = (studySetId: string): string =>
        `Flashcard swipe list ${studySetId}`;

    static flashCardTotalCard = (totalCard: number): string => `Flashcard Total Card ${totalCard}`;

    static flashCardToggleCardList = (isTerm: boolean): string =>
        `Flashcard Toggle Card List ${isTerm ? `Term` : `Definition`}`;

    static flashCardList: string = `Flashcard list`;

    static flashCardListWithTotalCard = (totalCard: number): string =>
        `Flashcard list ${totalCard}`;

    static flashcardLearnButton: string = `Flashcard Learn Button`;

    static liveLessonConversationUnreadBadge: string = `Live Lesson Conversation Unread Badge`;

    static flashcardStudyAgainAttention: string = `Flashcard Study Again Attention`;

    static flashcardGotItAttention: string = `Flashcard Got It Attention`;

    static flashcardFinishedAllLearned: string = `Flashcard Finished All Learned`;

    static flashcardUnfinishedAllLearned: string = `Flashcard Unfinished All Learned`;

    static flashcardTestMemoryButton: string = `Flashcard Test Memory Button`;

    static flashcardContinueLearningButton: string = `Flashcard Continue Learning Button`;

    static flashcardRestartLearningButton: string = `Flashcard Restart Learning Button`;

    static flashCardTotalSkippedCards = (count: number): string =>
        `Flash card total skipped cards ${count}`;

    static flashCardTotalRememberedCards = (count: number): string =>
        `Flash card total remembered cards ${count}`;

    static flashCardItemImage = (index: number, imageLink: string): string =>
        `Flash card item image ${index} ${imageLink}`;

    static flashCardItemAudio = (index: number, isTerm: boolean): string =>
        `Flash card item audio ${index} ${isTerm ? `Term` : `Definition`}`;

    static flashcardOptionsBottomButton: string = `Flashcard Options Bottom Button`;

    static flashcardOptionsBottomModal: string = `Flashcard Options Bottom Modal`;

    static notificationDescriptionHtmlWidget = (hyperlinks: string): string =>
        `Notification Description Html Widget ${hyperlinks}`;

    static flashcardHeaderProgress = (currentIndex: number, total: number): string =>
        `Flashcard Header Progress ${currentIndex}/${total}`;

    static flashcardUndoLearnButton = (enabled: boolean): string =>
        `Flashcard Undo Learn Button ${enabled ? `Enabled` : `Disabled`}`;

    static notificationBadge = (totalNewNotification: number): string =>
        `Notification Badge - ${totalNewNotification}`;

    static pollingLearnerOptionsQuizBar: string = `Polling Options Quiz Bar`;

    static pollingLearnerQuizBarOptionKey = (
        name: string,
        isCorrect: boolean,
        isSelected: boolean
    ): string => `Polling Quiz Bar Option Button ${name} ${isCorrect} ${isSelected}`;

    static liveLessonLearnerPollHidePollingButtonKey: string = `Live Lesson Hide Polling QuizBar Button Key`;

    static liveLessonLearnerPollButtonWithActiveStatus = (isActive: boolean): string =>
        `Polling Button With Active Status ${isActive}`;

    static liveLessonLearnerPollQuizBarSubmitButtonKey = (isDisable: boolean): string =>
        `Live Lesson Submit Polling Button Key ${isDisable}`;

    static liveLessonEndedPollingLearnerOkButton: string = `Live Lesson Ended Polling Notification Ok Button`;

    static liveLessonPollingLearnerQuizBarOptionTextKey = (
        name: string,
        isSelected: boolean
    ): string => `Live Lesson Polling Quiz Bar Option Text ${name} isSelected ${isSelected}`;

    static liveLessonPollingLearnerQuizResultBannerKey = (isAnswerCorrect: boolean): string =>
        `Live Lesson Polling Quiz Result Banner isAnswerCorrect ${isAnswerCorrect} Key`;

    static liveLessonPollingLearnerQuizBarOptionContainerKey = (
        name: string,
        isCorrect: boolean
    ): string => `Live Lesson Polling Quiz Bar Option Container ${name} isSelected ${isCorrect}`;

    static confirmConversationNoLongerAvailableButton: string = `Confirm Conversation No Longer Available Button`;

    static viewAnswerKeyButton: string = `View Answers Keys Button`;

    static quizProgressIndex = (index: number): string => `Quiz Progress ${index}`;

    static quizProgressIndexWithState = (index: number, state: QuizProgressItemState): string =>
        `Quiz Progress ${index} ${state}`;

    static submitAnswerConfirmDialog: string = `Submit Answer Confirm Dialog`;

    static leavingExamLOConfirmDialog: string = `Leaving Exam LO Confirm Dialog`;

    static nextButtonUnenabled: string = `Next Button Unenabled`;

    static notificationRawHtmlKey: string = `Notification Description Raw HTML`;

    static taskAssignmentDurationTextFormField: string = `Task Assignment Duration Text Form Field`;

    static taskAssignmentCorrectTextFormField: string = `Task Assignment Correct Text Form Field`;

    static taskAssignmentTotalTextFormField: string = `Task Assignment Total Text Form Field`;

    static taskAssignmentCompleteDateTextFormField: string = `Task Assignment Complete Date Text Form Field`;

    static taskAssignmentStopWatch: string = `Task Assignment Stop Watch`;

    static addTaskButton: string = 'Add Task Button';

    static taskAssignmentTaskName: string = 'Task Assignment Task Name';

    static taskAssignmentCourse: string = 'Task Assignment Course';

    static taskAssignmentStartDate: string = 'Task Assignment Start Date';

    static taskAssignmentDueDate: string = 'Task Assignment Due Date';

    static taskAssignmentRequireNoteCheckBox = (isChecked: boolean): string =>
        `Task Assignment Require Note Check Box ${isChecked}`;

    static taskAssignmentRequireDurationCheckBox = (isChecked: boolean): string =>
        `Task Assignment Require Duration Check Box ${isChecked}`;

    static taskAssignmentRequireCorrectnessCheckBox = (isChecked: boolean): string =>
        `Task Assignment Require Correctness Check Box ${isChecked}`;

    static taskAssignmentRequireUnderstandingLevelCheckBox = (isChecked: boolean): string =>
        `Task Assignment Require Understanding Level Check Box ${isChecked}`;

    static taskAssignmentRequireAttachmentCheckBox = (isChecked: boolean): string =>
        `Task Assignment Require Attachment Check Box ${isChecked}`;

    static taskAssignmentNote: string = 'Task Assignment Note';

    static taskAssignmentAttachmentButton: string = 'Task Assignment Attachment Button';

    static taskAssignmentSaveButton = (enabled: boolean): string =>
        `Task Assignment Save Button ${enabled ? 'Enabled' : 'Disabled'}`;

    static attachmentKey = (name: string, status: LoadingStatus) =>
        `Attachment with ${name} ${status}`;

    static attachmentDeleteButtonKey = (name: string) =>
        `Attachment with ${name} Delete Button Key`;

    static attachmentCancelButtonKey = (name: string) =>
        `Attachment with ${name} Cancel Button Key`;

    static taskAssignmentUnderstandingLevel = (emoji: string): string =>
        `Task Assignment Understanding Level selected emoji ${emoji}`;

    static learningStatsOnDateWithLearningTime = (
        date: string,
        learningTimeInMinute: string
    ): string => `Learning Stats on ${date} with learning time in minute ${learningTimeInMinute}`;

    static cameraDisplay = (userId: string, active: boolean) =>
        `Camera Display ${userId} ${active}`;

    static enableWhiteboardPermissionDialog: string = `Enable Whiteboard Permission Dialog`;

    static enableWhiteboardPermissionDialogCloseButton: string = `Enable Whiteboard Permission Dialog Close Button`;

    static spotlightUserView = (userId: string, active: boolean) =>
        `Spotlight User View ${userId} ${active}`;

    static cameraDisplayContainerKey = (userId: string, isSpotlighting: boolean) =>
        `Camera Display Container Key ${userId} ${isSpotlighting}`;

    static pinnedUserView = (userId: string, active: boolean): string =>
        `Pinned User View ${userId} ${active}`;

    static changeToKeyboardButton: string = 'Change To Keyboard Button';

    static changeToHandWritingButton: string = 'Change To HandWriting Button';

    static eraseWhiteboardButton: string = 'Erase Whiteboard Button';

    static whiteboard: string = 'Whiteboard';

    static closeWhiteboardButton: string = 'Close Whiteboard Button';

    static scanWhiteboardButton: string = 'Scan Whiteboard Button';

    static answerFillTheBlankWithOriginalIndex(position: number) {
        return `Answer Fill The Blank with Original Index - ${position}`;
    }

    static whiteboardEmpty: string = 'Whiteboard Empty';

    static whiteboardNotEmpty: string = 'Whiteboard Not Empty';

    static errorDialog: string = 'Error Dialog';

    static errorDialogCloseButton: string = 'Error Dialog Close Button';

    static switchStudentsButton: string = 'Switch Students Button';

    static switchStudentsScreen: string = 'Switch Students Screen';

    static switchStudentKidTile(studentId: string, index: number) {
        return `Switch Student Kid Tile ${studentId} Index ${index}`;
    }

    static studentCurrentChildAvatar(studentId: string) {
        return `Student Current Child Avatar ${studentId}`;
    }

    static kidDefaultAvatar(studentId: string, firstNameInitial: string) {
        return `Kid Default Avatar ${studentId} ${firstNameInitial}`;
    }

    static noStudentsAssociated: string = 'No Students Associated';

    static examLOInstructionScreen: string = 'Exam LO Instruction Screen';

    static startExamLOButton: string = 'Start Exam LO Button';

    static totalQuestions(total: number) {
        return `Total Questions ${total}`;
    }

    static examLOInstruction(instruction: string) {
        return `Exam LO Instruction ${instruction}`;
    }
}
