import { LoadingStatus } from '@legacy-step-definitions/types/common';

import { QuizProgressItemState } from '../syllabus-stop-doing-exam-lo-steps';

export class SyllabusLearnerKeys {
    static questionFillTheBlank = `Question Fill The Blank`;

    static answerFillTheBlankNumber(position: number) {
        return `Answer Fill The Blank Length - ${position}`;
    }

    static oidc_webview_dialog = `OIDC Webview dialog`;

    static showCorrectAnswerText = (correctAnswer: string): string =>
        `Show correct answer text ${correctAnswer}`;

    static quizAnswerOption = (answer: string): string => `Quiz Answer ${answer}`;

    static showQuizProgressBarButton = `Show Quiz Progress Bar Button`;

    static showQuizProgress = (lengthOfQuizzes: number): string =>
        `Show Quiz Progress ${lengthOfQuizzes} Quizzes`;

    static homeScreen = `Home Screen`;

    static homeScreenDrawerButton = `home Screen Drawer Button`;

    static homeDrawer = `home Drawer`;

    static authMultiUsersScreen = `Auth Multi Users Screen`;

    static authSearchOrganizationScreen = `auth Search Organization Screen`;

    static attemptHistoryScreen = `Attempt History Screen`;

    static attemptHistoryRecord = (totalRecords: number): string =>
        `Attempt History Record ${totalRecords}`;

    static retryIncorrectButton = `Retry Incorrect Button`;

    static practiceAllButton = `Practice All Button`;

    static takeAgainButton = `Take Again Button`;

    static masteryLevel = (score: string): string => `Mastery Level ${score}`;

    static totalAttempts = (totalAttempts: number): string => `Total Attempts ${totalAttempts}`;

    static quizSetResult = (index: number, score: string): string =>
        `Quiz Set index ${index} gets score ${score}`;

    static quizSetRetryIcon = (index: number, isRetry: boolean): string =>
        `Quiz Set index ${index} isRetry ${isRetry}`;

    static addANewAccountButton = `add A New Account Button`;

    static loginWithMultiTenantButton = `Login With Multi tenant Button`;

    static logoutButton = `logout Button`;

    static getTotalLearningProgressFailedDialog = `Get Total Learning Progress Failed Dialog`;

    static confirmedLogoutDialog = `Confirmed Logout Dialog`;

    static confirmedLogoutDialogYesButton = `Confirmed Logout Dialog Yes Button`;

    static confirmedLogoutDialogNoButton = `Confirmed Logout Dialog No Button`;

    static manageAccountButton = `manage Account Button`;

    static authSignInScreen = `auth SignIn Screen`;

    static authSendPasswordResetEmailScreen = `auth SendPasswordResetEmail Screen`;

    static pageNotFoundScreen = `Page Not Found Screen`;

    static returnToTheWebsiteButton = ` Return to the website Button`;

    static emailTextBox = `email TextBox`;

    static passwordTextBox = `password TextBox`;

    static organizationTextBox = `Organization TextBox`;

    static forgotPasswordButton = `forgot Password`;

    static signInButton = `signIn Button`;

    static searchOrgButton = `search Org Button`;

    static welcomeBackScreen = `welcome back screen`;

    static letStartButton = `let start button`;

    static back_button = `Back Button`;

    static app_bar = `App Bar`;

    static learning_tab = `Learning Tab`;

    static todos_tab = `To-Dos Tab`;

    static lesson_tab = `Lesson Tab`;

    static messages_tab = `Messages Tab`;

    static stats_tab = `Stats Tab`;

    static learning_page = `Learning Page`;

    static todos_page = `To-Dos Page`;

    static lesson_page = `Lesson Page`;

    static messages_page = `Messages Page`;

    static stats_page = `Stats Page`;

    static active_tab = `Active Tab`;

    static overdue_tab = `Overdue Tab`;

    static completed_tab = `Completed Tab`;

    static active_page = `Active To-Dos Page`;

    static overdue_page = `Overdue To-Dos Page`;

    static completed_page = `Completed To-Dos Page`;

    static study_plan_item(name: string) {
        return `${name} Study Plan`;
    }

    static study_plan_item_with_position(index: number, name: string) {
        return `${index} ${name} Study Plan`;
    }

    static assignment(name: string) {
        return `${name} Assignment`;
    }

    static assignmentScrollview = 'Assignment Scroll View';

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

    static assignmentIsClosed = `Assignment is closed`;

    static next_button = `Next Button`;

    static assignment_completed_screen = `Assignment Completed Screen`;

    static lo_completed_screen = `LO Completed Screen`;

    static success_snackbar = `Success SnackBar`;

    static error_snackbar = `Error SnackBar`;

    static default_snackbar = `Default SnackBar`;

    static info_snackbar = `Info SnackBar`;

    static assignment_note_field = `Assignment Note Field`;

    static submit_button = `Submit Button`;

    static submit_button_unenabled = `Submit Button Unenabled`;

    static confirm_button = `Confirm Button`;

    static noDialogButton = 'No confirm button';

    static yesDialogButton = 'Yes confirm button';

    static cancel_button = `Cancel Button`;

    static submitted_assignment = `Submitted Assignment`;

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

    static record_assignment_screen = `Record Assignment Screen`;

    static record_assignment_review_screen = `Record Assignment Review Screen`;

    static start_record_button = `Start Record Button`;

    static stop_record_button = `Stop Record Button`;

    static attach_answer_button = `Attach Answer Button`;

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

    static attachment_loading = `Attachment Loading`;

    static loading_dialog = `Loading Dialog`;

    static attach_attachment_button = `Attach Attachment Button`;

    static subject(name: string) {
        return `${name} Subject`;
    }

    static lo_list_screen(topicName: string) {
        return `${topicName} LO List Screen`;
    }

    static lo(loName: string) {
        return `${loName} LO`;
    }

    static phone_number_text_field = `Phone number Text Field`;

    static create_account_text = `Create account Text`;

    static login_button = `Login Button`;

    static login_screen = `Login Screen`;

    static log_in_text = `Log in Text`;

    static register_screen = `Register Screen`;

    static sign_up_with_phone_button = `Sign up with phone Button`;

    static quiz_finished_screen(loName: string) {
        return `${loName} Quiz Finished Screen`;
    }

    static quiz_finished_achievement_screen(loName: string) {
        return `${loName} Quiz Finished Achievement Screen`;
    }

    static learning_finished_topic_screen(topic: string) {
        return `${topic} Learning Flow Finished Topic Screen`;
    }

    static topic_list_button = `Topic List Button`;

    static updateNowButton = `Update Now Button`;

    static forceUpdateScreen = `Force Update Screen`;

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

    static quiz = `Quiz`;

    static currentQuizNumber = (currentIndex: number): string =>
        `Current Quiz Number ${currentIndex}`;

    static answer_correct = `Answer Correct`;

    static retry_button = `Retry Button`;

    static next_quiz_button = `Next Quiz Button`;

    static course(course: string) {
        return `${course} Course`;
    }

    static courseAvatar(courseAvatar: string) {
        return `Course Avatar ${courseAvatar}`;
    }

    static book_detail_screen = `Book Detail Screen`;

    static select_book_button = `Select Book Button`;

    static select_book_screen = `Select Book Screen`;

    static list_book = `List Book`;

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

    static close_button = `Close Button`;

    static close_snackbar_button = `Close Snack Bar Button`;

    static back_to_list_text = `Back to list Text`;

    static flash_card_preview_screen = (loName: string): string =>
        `${loName} Flash Card Preview Screen`;

    static flash_card_practice_screen = (loName: string): string =>
        `${loName} Flash Card Practice Screen`;

    static switchAccountButton = `switch Account Button`;

    static switchAccountScreen = `Switch Account Screen`;

    static manageAccountScreen = `Manage Account Screen`;

    static profileDetailsScreen = `Profile Details Screen`;

    static editAccountScreen = `Edit Account Screen`;

    static editProfileButton = `Edit profile button`;

    static nameTextInput = `Name text input`;

    static editAccountDrawerItem = `Edit Account drawer item`;

    static entryExitRecordsDrawerItem = `Entry Exit Records Drawer Item`;

    static recordTimeText = (id: number, type: string, text: string): string =>
        `Entry Exit Record ${id} ${type} ${text} Text`;

    static recordsFilterButton = 'Records Filter Button';

    static recordsFilterChildItem = (recordFilter: string): string =>
        `${recordFilter} Records Filter Child Item`;

    static emptyExitRecords = `Empty Exit Records`;

    static myQrCodeDrawerItem = `My Qr Code Drawer Item`;

    static qrCode = `QR Code`;

    static learnerQrCodeScreen = `Learner QR Code Screen`;

    static saveButton = `Save button`;

    static drawerHeader = `Drawer header`;

    static myProfileDrawerItem = `My Profile drawer item`;

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

    static liveLessonsEmpty = `Live lesson empty`;

    static liveLessonsList = `Live lesson list`;

    static dialogJoinLiveLessonLoading = `Live lesson loading`;

    static waitingRoomTeacher = `Waiting Room Banner`;

    static leaveForNowButton = `Leave room button`;

    static lessonsCalendarIcon = `Lessons calendar icon`;

    static schedulePage = `Schedule page`;

    static scheduleTitlePage = `Schedule title page`;

    static previousMonth = `Previous month`;

    static nextMonth = `Next month`;

    static dateSelectedDot = `Date selected dot`;

    static courseFilterButton = `Course filter button`;

    static courseFilterTitle = `Course filter title`;

    static selectCourseScreen = `Select Course Screen`;

    static gradeList = `Grade List`;

    static grade = (gradeName: string): string => `${gradeName} Grade`;

    static courseList = `Course List`;

    static playButton = `Play Button`;

    static pauseButton = `Pause Button`;

    static sliderAudio = `Slider Audio`;

    static viewAttachmentScreen = `View Attachment Screen`;

    static currentTimeAudio = `Current Time Audio`;

    static durationTimeAudio = `Duration Time Audio`;

    static attachment = (attachmentName: string): string => `${attachmentName} Attachment`;

    static currentAndDurationTimeAudio = `Current And Duration Time Audio`;

    static notificationIcon = `Notification Icon`;

    static notificationsScreen = `Notifications Screen`;

    static listNotificationKey = `List Notification Key`;

    static leaveButtonKey = `Leave Button Key`;

    /// Manual Input question keys
    static correctManualInputOptionKey = `Correct Manual Input Option`;

    static manualInputOptionList = `Manual Input Option List`;

    static manualInputQuestionTitle = `Manual Input Question Title`;

    static multipleAnswersQuestionTitle = `Multiple Answers Question Title`;

    static completeAndShowExplanationButton = `Complete And Show Explanation Button`;

    static fillInTheBlankQuestionTitle = `Fill in the blank Question Title`;

    static multipleChoiceQuestionTitle = `Multiple Choice Question Title`;

    static incorrectManualInputOptionKey = `Incorrect Manual Input Option`;

    static brightCoveVideoKey = `Brightcove video key`;

    static brightCoveVideoIdKey = (videoId: string): string => `Brightcove video id key ${videoId}`;

    static studyGuideKey = `Study Guide PDF key`;

    static studyGuideURLKey = (url: string): string => `Study Guide URL key ${url}`;

    static flashCardItem = (index: number, isActiveTerm: boolean): string =>
        `Flash card item ${index} ${isActiveTerm}`;

    static flashCardItemWithContent = (index: number, isTerm: boolean, content: string): string =>
        `Flash card item content ${index} ${isTerm ? `Term` : `Definition`} ${content}`;

    static flashCardItemTerm = (index: number): string => `Flash card item term ${index}`;

    static flashCardItemDefinition = (index: number): string =>
        `Flash card item definition ${index}`;

    static app_bar_profile = `App Bar profile`;

    static answerCorrect = (index: number): string => `Answer Correct ${index}`;

    static answerIncorrect = (index: number): string => `Answer Wrong${index}`;

    static switchChildrenButton = `Switch Child Button`;

    static currentChildText = `Current Child Text`;

    static learningProgressPageView = `Learning Progress Page View`;

    static upload_avatar_button = `Upload Avatar Button`;

    static uploading_avatar = `Uploading Avatar`;

    static upload_avatar_success = `Upload Avatar Success`;

    static avatar = `Avatar`;

    static defaultAvatar = `default Avatar`;

    static avatarWidget = (url: string): string => `Avatar Widget ${url}`;

    static avatarLocalFileWidget = `Avatar Local File Widget`;

    static avatarWidgetInHomeDrawer = (url: string): string =>
        `Avatar Widget In Home Drawer ${url}`;

    static kidAvatarWidget = (url: string): string => `Kid Avatar Widget ${url}`;

    static uploaded_avatar = `Uploaded Avatar`;

    static chapter_with_topic_list = `Chapter with topic list`;

    static empty_chapter_list = `Empty chapter list`;

    static lo_and_assignment_list = `LO and assignment list`;

    static empty_course = `Empty Course`;

    static error_snack_bar = `Error Snack Bar`;

    static otp_screen = `Otp Screen`;

    static otp_text_field = `Otp Text Field`;

    static welcom_back_screen = `Welcom back Screen`;

    static start_manabie_button = `Start Manabie Button`;

    static home_screen = `Home Screen`;

    static stats_pages = `Stats Page`;

    static account_avatar = `Account Avatar`;

    static drawer = `Drawer`;

    static see_your_profile_tab = `See your profile Tab`;

    static ask_teacher = `Ask Teacher Tab`;

    static my_packages_tab = `My Packages Tab`;

    static notification_tab = `Notification Tab`;

    static join_a_class_tab = `Join A Class Tab`;

    static contact_us_tab = `Contact Us Tab`;

    static manabie_plans_screen = `Manabie Plans Screen`;

    static join_a_class_screen = `Join A Class Screen`;

    static total_progress_button = `Total Progress Button`;

    static total_progress_screen = `Total Progress Screen`;

    static quizes_page = `Quizes Page`;

    static quiz_progress_number = `Quiz Progress Number`;

    static quiz_title_text = `Quiz Title Text`;

    static terms_tab = `Terms Tab`;

    static privacy_policy_tab = `Privacy Policy Tab`;

    static submission_tab = `Submission Tab`;

    static instruction_tab = `Instruction Tab`;

    static topic_list_screen(subjectName: string) {
        return `${subjectName} Topic List Screen`;
    }

    static quiz_finished_topic_screen(topic: string) {
        return `${topic} Quiz Finished Topic Screen`;
    }

    static messageLessonButton = `Message Lesson Button`;

    static endLessonButton = `End Lesson Button`;

    static endLessonDialog = `End Lesson Dialog`;

    static requestMicroDialog = `Request Micro Dialog`;

    static requestVideoDialog = `Request Video Dialog`;

    static acceptRequestButton = `Accept Request Button`;

    static declineRequestButton = `Decline Request Button`;

    static endNowButton = `End Now Button`;

    static lessonItem = (id: string, name: string): string => `${id} ${name} Live Lesson Item`;

    static listCameraView = `Live Lesson List Camera View`;

    static assignment_scrollview = `Assignment Scroll View`;

    static liveStreamScreen = `Live Stream Screen`;

    static raiseHandButton = ([raiseHand = false]): string => `Raise Hand Button ${raiseHand}`;

    static appBarName(name: string) {
        return `App Bar Name ${name}`;
    }

    static snackBar = `Snack Bar`;

    static waitingTeacherJoin = `Waiting Teacher Join`;

    static listLessonsName = (names: string): string => `List Lesson Name ${names}`;

    static profileDetailsScreenUserName = (name: string): string =>
        `Profile Details Screen User Name ${name}`;

    static notificationDetail = `Notification Detail`;

    static notificationDetailTitle = `Notification Detail Title`;

    static notificationDetailContent = `Notification Detail Content`;

    static viewAssignmentButton = `View Assignment Button`;

    static microButtonLiveLesson = (active: boolean): string =>
        `Micro Button Live Lesson Active ${active}`;

    static cameraButtonLiveLesson = (active: boolean): string =>
        `Camera Button Live Lesson Active ${active}`;

    static microButtonLiveLessonInteraction = (interaction: boolean): string =>
        `Micro Button Live Lesson Interaction ${interaction}`;

    static cameraButtonLiveLessonInteraction = (interaction: boolean): string =>
        `Camera Button Live Lesson Interaction ${interaction}`;

    static annotationBar = `Live Lesson Annotation Bar`;

    static annotationButton = `Live Lesson Annotation Button`;

    static closeAnnotationBarButton = `Live Lesson White Board Close Annotation Button`;

    static toolPicker = `Live Lesson White Board Close Annotation Button`;

    static selectorTool = `Live Lesson White Board Selector Tool`;

    static laserPointerTool = `Live Lesson White Board Laser Pointer Tool`;

    static textTool = `Live Lesson White Board Text Tool`;

    static pencilTool = `Live Lesson White Board Pencil Tool`;

    static rectangleTool = `Live Lesson White Board Rectangle Tool`;

    static ellipseTool = `Live Lesson White Board Ellipse Tool`;

    static straightTool = `Live Lesson White Board Straight Tool`;

    static handTool = `Live Lesson White Board Hand Tool`;

    static eraserTool = `Live Lesson White Board Eraser Tool`;

    static annotationBarStrokePathKey = (size: number, selected: boolean) =>
        `Live Lesson Annotation Bar Stroke Path size ${size} selected ${selected}`;

    static annotationBarColorPickerColorIndexKey = (colorIndex: number, selected: boolean) =>
        `Live Lesson Annotation Bar Color Picker Color Index ${colorIndex} selected ${selected}`;

    static notificationAttachmentItem = (name: string, index: number): string =>
        `Notification Attachment ${name} at ${index}`;

    static liveLessonScheduleCalendar = `Live Lesson Schedule Calendar`;

    static liveLessonScheduleCalendarPreviousButton = `Live Lesson Schedule Calendar Previous Button`;

    static liveLessonScheduleCalendarNextButton = `Live Lesson Schedule Calendar Next Button`;

    static normalDate = (day: number, month: number): string => `Normal Date ${day} ${month}`;

    static startDayLiveLesson = `Start Day Live Lesson `;

    static startTimeLiveLesson = `Start Time Live Lesson `;

    static liveLessonWhiteBoardView = `Live Lesson White Board View`;

    static liveLessonSharedScreenView = `Live Lesson Shared Screen View`;

    static liveLessonWhiteBoardIndex = (index: number): string =>
        `Live Lesson White Board Index ${index}`;

    static quizCircularProgressFractionResult = `Quiz Circular Progress Fraction Result`;

    static quizFinishedTopicProgressTitle = `Quiz Finish Topic Progress Title`;

    static quizFinishedAchievementTitle = `Quiz Finish Achievement Title`;

    static quizFinishedAchievementDescription = `Quiz Finish Achievement Description`;

    static noColorCrown = `No Color Crown`;

    static bronzeCrown = `Bronze Crown`;

    static goldCrown = `Gold Crown`;

    static silverCrown = `Silver Crown`;

    static liveLessonVideoView = (videoId = ''): string => `Live Lesson Video View ${videoId}`;

    static disconnectingScreenLiveLesson = `Disconnecting Screen Live Lesson`;

    static liveLessonCameraViewStatus = `Live Lesson Camera View`;

    static liveLessonSpeakerStatus = (userId: string, active: boolean): string =>
        `Live Lesson Speaker Status ${userId} ${active}`;

    static liveLessonNoneCameraView = (userId: string): string =>
        `Live Lesson None Camera View ${userId}`;

    static liveLessonDisconnectCameraView = `Live Lesson Disconnect Camera View`;

    static liveLessonRightDrawer = (visible: boolean): string =>
        `Live Lesson Right Drawer ${visible}`;

    static liveLessonChatTab = `Live Lesson Chat Tab`;

    static flashCardSwipeList = (studySetId: string): string =>
        `Flashcard swipe list ${studySetId}`;

    static flashCardTotalCard = (totalCard: number): string => `Flashcard Total Card ${totalCard}`;

    static flashCardToggleCardList = (isTerm: boolean): string =>
        `Flashcard Toggle Card List ${isTerm ? `Term` : `Definition`}`;

    static flashCardList = `Flashcard list`;

    static flashCardListWithTotalCard = (totalCard: number): string =>
        `Flashcard list ${totalCard}`;

    static flashcardLearnButton = `Flashcard Learn Button`;

    static liveLessonConversationUnreadBadge = `Live Lesson Conversation Unread Badge`;

    static flashcardStudyAgainAttention = `Flashcard Study Again Attention`;

    static flashcardGotItAttention = `Flashcard Got It Attention`;

    static flashcardFinishedAllLearned = `Flashcard Finished All Learned`;

    static flashcardUnfinishedAllLearned = `Flashcard Unfinished All Learned`;

    static flashcardTestMemoryButton = `Flashcard Test Memory Button`;

    static flashcardContinueLearningButton = `Flashcard Continue Learning Button`;

    static flashcardRestartLearningButton = `Flashcard Restart Learning Button`;

    static flashCardTotalSkippedCards = (count: number): string =>
        `Flash card total skipped cards ${count}`;

    static flashCardTotalRememberedCards = (count: number): string =>
        `Flash card total remembered cards ${count}`;

    static flashCardItemImage = (index: number, imageLink: string): string =>
        `Flash card item image ${index} ${imageLink}`;

    static flashCardItemAudio = (index: number, isTerm: boolean): string =>
        `Flash card item audio ${index} ${isTerm ? `Term` : `Definition`}`;

    static flashcardOptionsBottomButton = `Flashcard Options Bottom Button`;

    static flashcardOptionsBottomModal = `Flashcard Options Bottom Modal`;

    static notificationDescriptionHtmlWidget = (hyperlinks: string): string =>
        `Notification Description Html Widget ${hyperlinks}`;

    static flashcardHeaderProgress = (currentIndex: number, total: number): string =>
        `Flashcard Header Progress ${currentIndex}/${total}`;

    static flashcardUndoLearnButton = (enabled: boolean): string =>
        `Flashcard Undo Learn Button ${enabled ? `Enabled` : `Disabled`}`;

    static notificationBadge = (totalNewNotification: number): string =>
        `Notification Badge - ${totalNewNotification}`;

    static pollingLearnerOptionsQuizBar = `Polling Options Quiz Bar`;

    static pollingLearnerQuizBarOptionKey = (
        name: string,
        isCorrect: boolean,
        isSelected: boolean
    ): string => `Polling Quiz Bar Option Button ${name} ${isCorrect} ${isSelected}`;

    static liveLessonLearnerPollHidePollingButtonKey = `Live Lesson Hide Polling QuizBar Button Key`;

    static liveLessonLearnerPollButtonWithActiveStatus = (isActive: boolean): string =>
        `Polling Button With Active Status ${isActive}`;

    static liveLessonLearnerPollQuizBarSubmitButtonKey = (isDisable: boolean): string =>
        `Live Lesson Submit Polling Button Key ${isDisable}`;

    static liveLessonEndedPollingLearnerOkButton = `Live Lesson Ended Polling Notification Ok Button`;

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

    static confirmConversationNoLongerAvailableButton = `Confirm Conversation No Longer Available Button`;

    static viewAnswerKeyButton = `View Answers Keys Button`;

    static quizProgressIndex = (index: number): string => `Quiz Progress ${index}`;

    static quizProgressIndexWithState = (index: number, state: QuizProgressItemState): string =>
        `Quiz Progress ${index} ${state}`;

    static submitAnswerConfirmDialog = `Submit Answer Confirm Dialog`;

    static leavingExamLOConfirmDialog = `Leaving Exam LO Confirm Dialog`;

    static nextButtonUnenabled = `Next Button Unenabled`;

    static notificationRawHtmlKey = `Notification Description Raw HTML`;

    static taskAssignmentDurationTextFormField = `Task Assignment Duration Text Form Field`;

    static taskAssignmentCorrectTextFormField = `Task Assignment Correct Text Form Field`;

    static taskAssignmentTotalTextFormField = `Task Assignment Total Text Form Field`;

    static taskAssignmentCompleteDateTextFormField = `Task Assignment Complete Date Text Form Field`;

    static taskAssignmentStopWatch = `Task Assignment Stop Watch`;

    static addTaskButton = 'Add Task Button';

    static taskAssignmentTaskName = 'Task Assignment Task Name';

    static taskAssignmentCourse = 'Task Assignment Course';

    static taskAssignmentStartDate = 'Task Assignment Start Date';

    static taskAssignmentDueDate = 'Task Assignment Due Date';

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

    static taskAssignmentNote = 'Task Assignment Note';

    static taskAssignmentAttachmentButton = 'Task Assignment Attachment Button';

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

    static enableWhiteboardPermissionDialog = `Enable Whiteboard Permission Dialog`;

    static enableWhiteboardPermissionDialogCloseButton = `Enable Whiteboard Permission Dialog Close Button`;

    static spotlightUserView = (userId: string, active: boolean) =>
        `Spotlight User View ${userId} ${active}`;

    static cameraDisplayContainerKey = (userId: string, isSpotlighting: boolean) =>
        `Camera Display Container Key ${userId} ${isSpotlighting}`;

    static pinnedUserView = (userId: string, active: boolean): string =>
        `Pinned User View ${userId} ${active}`;

    static changeToKeyboardButton = 'Change To Keyboard Button';

    static changeToHandWritingButton = 'Change To HandWriting Button';

    static eraseWhiteboardButton = 'Erase Whiteboard Button';

    static whiteboard = 'Whiteboard';

    static closeWhiteboardButton = 'Close Whiteboard Button';

    static scanWhiteboardButton = 'Scan Whiteboard Button';

    static answerFillTheBlankWithOriginalIndex(position: number) {
        return `Answer Fill The Blank with Original Index - ${position}`;
    }

    static whiteboardEmpty = 'Whiteboard Empty';

    static whiteboardNotEmpty = 'Whiteboard Not Empty';

    static errorDialog = 'Error Dialog';

    static errorDialogCloseButton = 'Error Dialog Close Button';

    static switchStudentsButton = 'Switch Students Button';

    static switchStudentsScreen = 'Switch Students Screen';

    static switchStudentKidTile(studentId: string, index: number) {
        return `Switch Student Kid Tile ${studentId} Index ${index}`;
    }

    static studentCurrentChildAvatar(studentId: string) {
        return `Student Current Child Avatar ${studentId}`;
    }

    static kidDefaultAvatar(studentId: string, firstNameInitial: string) {
        return `Kid Default Avatar ${studentId} ${firstNameInitial}`;
    }

    static noStudentsAssociated = 'No Students Associated';

    static examLOInstructionScreen = 'Exam LO Instruction Screen';

    static startExamLOButton = 'Start Exam LO Button';

    static totalQuestions(total: number) {
        return `Total Questions ${total}`;
    }

    static examLOTimeLimit = 'Exam LO Time Limit';

    static examLOTimeLimitWithValue(timeLimit: number) {
        return `Exam LO Time Limit ${timeLimit}`;
    }

    static examLOInstruction(instruction: string) {
        return `Exam LO Instruction ${instruction}`;
    }

    static examLOSubmitBottomSheet = 'Exam LO Submit Bottom Sheet';

    static examLOTimerQuestionsContent = 'Exam LO Timer Questions Content';

    static examLOTimerTimeLeftContent = 'Exam LO Timer Time Left Content';

    static submitButtonAtBottomSheet = 'Submit Button At Bottom Sheet';

    static forceSubmitExamQuizScreen = 'Force Submit Exam Quiz Screen';

    static questionGroupTitle(questionIndex: number, title: string) {
        return `Question Group Title - ${questionIndex} - ${title}`;
    }

    static questionGroupProgressItem(questionIndexes: string) {
        return `Question Group Progress Item - ${questionIndexes}`;
    }
}
