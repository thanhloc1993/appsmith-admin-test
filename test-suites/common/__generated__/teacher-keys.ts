export class TeacherKeys {
    // Screen
    static drawer = `School ListView`;

    static emailLoginScreen = `Email Login Screen`;

    static phoneLoginScreen = `Phone Login Screen`;

    static phoneSignUpScreen = `Phone Sign Up Screen`;

    static loginOtpScreen = `Login Otp Screen`;

    static signUpOtpScreen = `Sign Up Otp Screen`;

    static signUpInfoScreen = `Sign Up Info Screen`;

    static homeScreen = `Home Screen`;

    static createFirstClassScreen = `Create First Class Screen`;

    static firstInviteLearnerCodeScreen = `First Invite Learner Code Screen`;

    static inviteLearnerCodeScreen = `Invite Learner Code Screen`;

    static inviteTeacherCodeScreen = `Invite Teacher Code Screen`;

    static createClassScreen = `Create Class Screen`;

    static settingScreen = `Setting Screen`;

    static classroomScreen = `Classroom Screen`;

    static messagingScreen = `Messaging Screen`;

    static editUserInfoScreen = `Edit User Info Screen`;

    static calendarCourseScreen = `Calendar Course Screen`;

    static lessonMaterialScreen = `Lesson Material Screen`;

    static liveLessonScreen = `Live Lesson Screen`;

    static liveCourseScreen = `Live Course Screen`;

    static liveStreamScreen = `Live Stream Screen`;

    // Input
    static nameTextField = `Name TextField`;

    static emailTextField = `Email TextField`;

    static schoolTextField = `School TextField`;

    static classTextField = `Class TextField`;

    static phoneTextField = `Phone TextField`;

    static passwordTextField = `Password TextField`;

    static otpTextField = `Otp TextField`;

    static userNameTextField = `User Name Text Field`;

    static studentCommentTextField = `Student Comment TextField`;

    static searchCourseInput = `Search Course Input`;

    // Button
    static loginButton = `Login Button`;

    static signUpButton = `Sign Up Button`;

    static loginByPhoneButton = `Login By Phone Button`;

    static loginByEmailButton = `Login By Email Button`;

    static signupByPhoneButton = `Signup By Phone Button`;

    static createAnAccountButton = `Create An Account Button`;

    static closeButton = `Close Button`;

    static sendButton = `Send Button`;

    static nextButton = `Next Button`;

    static skipButton = `Skip Button`;

    static drawerMenuButton = `Drawer Menu Button`;

    static logoutButton = `Logout Button`;

    static allowActionButton = `Allow Action Button`;

    static denyActionButton = `Deny Action Button`;

    static createClassButton = `Create Class Button`;

    static addButton = `Add Button`;

    static createClassButtonBottomDialog = `Create Class Button Bottom Dialog`;

    static shareClassCodeButton = `Share Class Code Button`;

    static backButton = `Back Button`;

    static editUserButton = `Edit User Button`;

    static saveUserInfoButton = `Save User Button`;

    static bottomSheetButton = (title: string): string => `${title} Bottom Sheet Button`;

    static scheduleButton = `Schedule Button`;

    static joinButton = (enable: boolean, isFirstTeacher: boolean): string =>
        `Join Button ${enable} - Is First Teacher ${isFirstTeacher}`;

    static userButtonInteraction = (interaction: boolean): string =>
        `User Button Interaction ${interaction ?? false}`;

    static shareMaterialButtonInteraction = (interaction: boolean): string =>
        `Share Material Button Interaction ${interaction ?? false}`;

    static stopShareMaterialButton = `Stop Share Material Button`;

    static liveLessonStopShareScreenOptionButton = `Live Lesson Stop Share Screen Option Button`;

    static endLessonButton = `End Lesson Button`;

    static leaveLessonButton = `Leave Lesson Button`;

    static endLessonForAllButton = `End Lesson For All Button`;

    static endNowButton = `End Now Button`;

    static messageLessonButton = `Message Lesson Button`;

    static closeEndLiveLessonDialogButton = `Close End Live Lesson Dialog Button`;

    static cannotOverlapShareScreenDialogOkButton = `Cannot Overlap Share Screen Dialog Ok Button`;

    static joinAllButton = `Join All Button`;

    static forgotPasswordButton = `Forgot Password Button`;

    static forgotPasswordWithMultiTenantButton = `Forgot Password With Multi Tenant Button`;

    static submitEmailButton = `Submit Email Button`;

    static backToSignInButton = `Back To Sign In Button`;

    static filterIcon = `Filter Icon`;

    static retryIcon = (index: number, isRetry: boolean): string =>
        `Retry Icon index ${index} isRetry ${isRetry}`;

    static quizSetResult = (index: number, result: string): string =>
        `Quiz Set index ${index} result ${result}`;

    static raiseHandNotificationButton = ([hasRaiseHand = false]): string =>
        `Raise Hand Notification Button ${hasRaiseHand}`;

    static annotationButton = `Live Lesson Annotation Button`;

    static closeAnnotationButton = `Live Lesson White Board Close Annotation Button`;

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

    static studentCommentPostButton = `Student Comment Post Button`;

    static studentCommentDeleteButton = `Student Comment Delete Button`;

    static studentCommentDeleteButtonWithIndex = (index: number): string =>
        `Student Comment Delete Button ${index}`;

    static studentCommentDeleteConfirmButton = `Student Comment Delete Confirm Button`;

    static studentCommentDeleteCancelButton = `Student Comment Delete Cancel Button`;

    static closeDeleteCommentDialogButton = `Close delete comment dialog button`;

    static teacherName = (teacherName: string): string => `Teacher Name ${teacherName}`;

    static commentAt = (dateTime: string): string => `Comment at ${dateTime}`;

    // Text
    static loginText = `Login Text`;

    static createAccountText = `Create Account Text`;

    static signUpText = `Sign Up Text`;

    static signInText = `Sign In Text`;

    static classCodeText = `Class Code Text`;

    static text(text: string) {
        return `${text} Text`;
    }

    static commentOnStudentText = `Comment On Student Text`;

    // Tab
    static messagingTab = `Messaging Tab`;

    static classroomTab = `Classroom Tab`;

    static settingTab = `Setting Tab`;

    static lessonTab = `Lesson Tab`;

    static studyPlanTab = `Study Plan Tab`;

    static studentTab = `Student Tab`;

    static materialTab = `Material Tab`;

    static studentInfoTab = `Student Information Tab`;

    static studentStudyPlanTab = `Student Study Plan Tab`;

    static statisticsTab = `Statistics Tab`;

    static pollingStatsTabKey = `Polling Stats Tab`;

    static pollingDetailTabKey = `Polling Detail Tab`;

    // Item
    static classItem = (name: string): string => `${name} Class Item`;

    static memberItem = (name: string): string => `${name} Member Item`;

    static liveCourseItem = (name: string): string => `${name} Live Course Item`;

    static liveLessonItem = (id: string, name: string): string => `${id} ${name} Live Lesson Item`;

    static courseItem = `Course Item`;

    static course = (name: string): string => `${name} Course`;

    static courseList = (length: number): string => `Course list ${length}`;

    static materialItem = (name: string): string => `${name} material item`;

    // List
    static classroomList = `Classroom List`;

    // Dialog
    static confirmAlertDialog = `Confirm Alert Dialog`;

    static bottomSheet2OptionDialog = `Bottom Sheet 2 Option`;

    static listMaterialDialog = `List Material Dialog`;

    static endLessonDialog = `End Lesson Dialog`;

    static endLiveLessonDialog = `End Live Lesson Dialog`;

    static cannotOverlapShareScreenDialog = `Cannot Overlap Share Screen Dialog`;

    static sendingDialog = `Sending Dialog`;

    //Menu
    static userProfileMenu = `User Profile Menu`;

    static conversationFilterMenu = `Conversation Filter Menu`;

    //View
    static actionBar = `Action Bar`;

    static studentStudyPlanView = `Student Study Plan View`;

    static studentInformationView = `Student Information View`;

    static videoLiveLessonView = (videoId: string): string => `Live Lesson Video View ${videoId}`;

    // Screen
    static email_login_screen = `Email Login Screen`;

    static phone_login_screen = `Phone Login Screen`;

    static home_screen = `Home Screen`;

    static toReviewScreen = `To Review Screen`;

    static submissionDetailsScreen = `Submission Details Screen`;

    static login_screen_key = `Login Screen String`;

    static forgot_password_screen_key = `Forgot Password Screen String`;

    static submitted_email_screen_key = `Submitted Email Screen String`;

    static email_text_field = `Email TextField`;

    static organization_text_field = `Organization TextField`;

    static phone_text_field = `Phone TextField`;

    static password_text_field = `Password TextField`;

    static conversationFilterTextField = `Conversation Filter TextField`;

    static studentConversationItem(studentId: string) {
        return `Student Conversation Item ${studentId}`;
    }

    static parentConversationItem(studentId: string) {
        return `Parent Conversation Item ${studentId}`;
    }

    static noCourseResultScreen = `No Course Result Screen`;

    // Button
    static login_button = `Login Button`;

    static login_with_phone_number_button = `Login with Phone number Button`;

    static login_with_email_address_button = `Login with Email address`;

    static toReviewButton = `To Review Button`;

    static attachYourMaterials = `Attach your materials`;

    static saveChangesButton = `Save Changes Button`;

    static saveAndReturnButton = `Save And Return Button`;

    static userProfileButton = `User Profile Button`;

    static signOutDialogButton = `Sign out Button`;

    static deleteAttachment = `Delete Attachment Button`;

    static startLessonButton = `Start Lesson Button`;

    static hideListStudentButton = `Hide List Student Button`;

    static messageButton = `Message Button`;

    static applyButton = `Apply Button`;

    static resetAllButton = `Reset All Button`;

    static joinAllDialogButton = `Join All Dialog Button`;

    static joinAllSuccessMessage = `Join All Successfully`;

    static muteAllAudioButton = `Mute All Audio Button`;

    static muteAllCameraButton = `Mute All Camera Button`;

    static handOffButton = `Hand Off Button`;

    // Text Field
    static gradeTextField = `Grade Text Field`;

    static maxGradeTextField = (maxGrade: string): string => `Max Grade ${maxGrade}`;

    static assignmentNameTextField = (name: string): string => `Assignment Name ${name}`;

    static assignmentTextFeedbacksTextField = `Assignment text feedbacks`;

    static assignmentInstructionEmptyView = `Assignment Instruction Empty View`;

    static assignmentInstructionTextField = (instruction: string): string =>
        `Assignment Instruction ${instruction}`;

    static assignmentStudentNoteTextField = (note: string): string =>
        `Assignment Student Note ${note}`;

    // Drop Down
    static statusDropDown = `Status Drop Down`;

    static notMarkedDropDown = `Not Marked Drop Down Button`;

    static inProgressDropDown = `In Progress Drop Down Button`;

    static markedDropDown = `Marked Drop Down Button`;

    static returnedDropDown = `Returned Drop Down Button`;

    static courseStudyPlanDropdown = `Course Study Plan Drop Down`;

    // File Test
    static imageTestFile = `image_test_file.jpeg`;

    static pdfTestFile = `pdf_test_file.pdf`;

    static videoTestFile = `video_test_file.mp4`;

    static submission = (index: number): string => `Submission${index}`;

    static companyLogo = `Company Logo`;

    static student = (studentId: string): string => `Student ${studentId}`;

    static studentAvatarWidget = (avatarUrl: string): string => `Student Avatar Url ${avatarUrl}`;

    static studentName = `Student Name`;

    static notLoggedInTagWithUserName = (username: string): string => `Not Logged In ${username}`;

    static studentSearchTextField = `Student Search Text Field`;

    static studentSearchButton = `Student Search Button`;

    static courseDetailsScreen = `Course Details Screen`;

    static courseParticipantScreen = `Course Participant Screen`;

    static studentStudyPlanScreen = `Student Study Plan Screen`;

    //Please waitFor studentStudyPlanItemList key if you need table loaded data
    static studentStudyPlanScrollView = `Student Study Plan Scroll View`;

    static courseStudyPlanScreen = `Course Study Plan Screen`;

    static courseStudyPlanAssignmentScreen = `Course Study Plan Assignment Screen`;

    static scoreCourseStudyPlanAssignmentScreen = `Score Course Study Plan Assignment Screen`;

    static submissionStudentName = `Submission Student Name`;

    // Tab
    static liveLessonTab = `Live Lesson Tab`;

    // Remove file
    static removeFile = (fileName: string): string => `remove ${fileName}`;

    // Remove file
    static removeTestFile = `Remove Test File`;

    static returnButton = `Return button`;

    static selectCourseDropDown = `Select course drop down`;

    static selectClassDropDown = `Select class drop down`;

    static menuSelectCourse = `Menu select course`;

    static menuSelectClass = `Menu select class`;

    static menuSelectStatus = `Menu select status`;

    static hideMenuSelectClassDropDown = `hide menu select class drop down`;

    static hideMenuSelectStatusDropDown = `hide menu select status drop down`;

    static selectStatusDropDown = `Select status drop down`;

    static selectDate = `Select date`;

    static submissionFilterEmpty = `Submission filter empty`;

    static submissionsAreEmpty = `Submissions are empty`;

    static allClassMenuItem = `all class`;

    static allStatusMenu = `all status`;

    static studentList = `Student List`;

    static materialList = (length: number): string => `Material List ${length}`;

    static waitingRoomBanner = `Waiting Room Banner`;

    static allCourseMenuItem = `All Course Menu Item`;

    static hideMenuSelectCourseDropDown = `Hide Menu Select Course Dropdown`;

    static annotationBar = `Live Lesson Annotation Bar`;

    static courseStudyPlanItem = `Course Study Plan Item`;

    static studyPlanTopicListEmpty = `Study Plan Topic List Empty`;

    static studyPlanTopicProgress = (topicName: string, completed: number, total: number): string =>
        `Study Plan Topic ${topicName} Progress ${completed}/${total}`;

    static studentStudyPlanTopicRow = (topicName: string): string =>
        `Student Study Plan Topic Row ${topicName}`.replace("'", '');

    static pageControl = `Page Control`;

    static firstTopic = `First Topic`;

    static secondTopic = `Second Topic`;

    static studyPlanTopicList = `Study Plan Topic List`;

    static secondStudyPlanTopicList = `Second Study Plan Topic List`;

    static topicStudyPlanItem = `Topic Study Plan Item`;

    static classDropdown = `Class drop down`;

    static classDropdownItem = `Class drop down item`;

    static classMemberScrollView = `Class Member Scroll View`;

    static classWorkProgressTable = `Class work progress table`;

    static nextClassMemberButton = `Next Class Member Button`;

    static previousClassMemberButton = `Previous Class Member Button`;

    static classMemberPaging = `Class Member Paging`;

    static classMemberActionMore = (studentName: string): string =>
        `${studentName} Class Member Action More`;

    static classMemberActionPopup = `Class Member Action Pop up`;

    static classMemberActionGrade = `Class Member Action Grade`;

    static classMemberActionChangeDueDate = `Class Member Action Change Due Date`;

    static classMemberActionRemoveSubmission = `Class Member Action Remove Submission`;

    static removeSubmissionConfirmDialog = `Remove Submission Confirm Dialog`;

    static cancelRemoveSubmissionConfirmDialog = `Cancel Remove Submission Confirm Dialog`;

    static assignmentStudentSubmissionRow = (studentName: string): string =>
        `${studentName} Assignment Student Submission Row`;

    static languagesIcon = `Languages Icon`;

    static languagesPopupMenu = `Languages Popup Menu`;

    static languageItem = (languageCode: string): string => `${languageCode} language item`;

    static yourCourse = `Your Course`;

    static courseScrollView = `Course Scroll View`;

    static languageCodeFlag = (languageCode: string): string => `${languageCode} Flag`;

    static liveLessonListCameraView = `Live Lesson List Camera View`;

    static liveLessonWhiteBoardView = `Live Lesson White Board View`;

    static liveLessonSharedScreenView = `Live Lesson Shared Screen View`;

    static liveLessonActionBarView = `Live Lesson Action Bar View`;

    static liveLessonScreenShareBar = `Live Lesson Screen Bar View`;

    static studentStudyPlanDropDown = `Student Study Plan Dropdown`;

    static studentStudyPlanDropDownDisable = `Student Study Plan Dropdown Disable`;

    static studentStudyPlanItemList = `Student Study Plan Item List`;

    static studentStudyPlanItemListInATopic = (topicName: string): string =>
        `Student Study Plan Item List In A Topic ${topicName}`;

    static studentStudyPlanTopicWithPosition = (topicName: string, position: number): string =>
        `Student Study Plan Topic ${topicName} at ${position}`;

    static studentStudyPlanItemEmptyList = `Student Study Plan Item Empty List`;

    static studentStudyPlanName = (studyPlanName: string): string =>
        `Student Study Plan ${studyPlanName}`.replace("'", '');

    static studentStudyPlanItemRow = (studyPlanItemName: string): string =>
        `Student Study Plan Item Row ${studyPlanItemName}`;

    static studentStudyPlanItemRowVsPosition = (index: number, itemName: string): string =>
        `Student Study Plan Item Row ${itemName} ${index}`;

    static loContentPopupScreen = `LO Content Popup Screen`;

    static loContentPopupTitleText = (name: string): string => `LO Content Popup Title ${name}`;

    static loContentPopupTitle = `LO Content Popup Title`;

    static loContentPopupStudyGuide = (studyGuide: string): string =>
        `LO Content Popup Study Guide ${studyGuide}`;

    static loContentPopupVideo = (video: string): string => `LO Content Popup Video ${video}`;

    static studentStudyPlanLOHistoryButton = (loId: string): string =>
        `Student Study Plan LO History ${loId}`;

    static studentStudyPlanItemGradeText = (studyPlanItem: string, studentName = ''): string =>
        `Student Study Plan Item Grade ${studyPlanItem} ${studentName}`;

    static studentStudyPlanItemGradeDropdownButton = (studyPlanItem: string): string =>
        `Student Study Plan Item Grade Dropdown Button ${studyPlanItem}`;

    static studentStudyPlanItemStatusDefault = (studyPlanItem: string): string =>
        `Student Study Plan Item Status Default ${studyPlanItem}`;

    static studentStudyPlanItemStatusCompleted = (studyPlanItem: string): string =>
        `Student Study Plan Item Status Completed ${studyPlanItem}`;

    static studentStudyPlanItemStatusIncomplete = (studyPlanItem: string): string =>
        `Student Study Plan Item Status Incomplete ${studyPlanItem}`;

    static studentStudyPlanItemStatusArchived = (studyPlanItem: string): string =>
        `Student Study Plan Item Status Archived ${studyPlanItem}`;

    static studentStudyPlanItemStatusReturned = (studyPlanItem: string): string =>
        `Student Study Plan Item Status Returned ${studyPlanItem}`;

    static studentStudyPlanItemStatusMarked = (studyPlanItem: string): string =>
        `Student Study Plan Item Status Marked ${studyPlanItem}`;

    static studentStudyPlanItemStatusNotMarked = (studyPlanItem: string): string =>
        `Student Study Plan Item Status Not Marked ${studyPlanItem}`;

    static studentStudyPlanItemStatusInProgress = (studyPlanItem: string): string =>
        `Student Study Plan Item Status In Progress ${studyPlanItem}`;

    static studentStudyPlanLOSubmissionHistoryPopup = `Student Study Plan LO Submission History Popup`;

    static studentStudyPlanLOSubmissionHistoryPopupRow = `Student Study Plan LO Submission History Popup Row`;

    static hideHistoryPopupMenu = `Hide history popup menu`;

    static selectedStudyPlanItem = `Selected Study Plan Item`;

    static studentStudyPlanItemCheckBox = (studyPlanItemId: string): string =>
        `Student Study Plan Item Check Box ${studyPlanItemId}`;

    static studentAllStudyPlanItemsCheckBox = (topicId: string): string =>
        `Student All Study Plan Items Check Box ${topicId}`;

    static editStudyPlanItemTimeButton = `Edit Study Plan Item Time Button`;

    static cancelEditStudyPlanItemTimeButton = `Cancel Edit Study Plan Item Time Button`;

    static okEditStudyPlanItemTimeButton = `OK Edit Study Plan Item Time Button`;

    static okEditStudyPlanItemTimeButtonDisabled = `OK Edit Study Plan Item Time Button Disabled`;

    static studentStudyPlanItemStartDate = (studyPlanItemName: string): string =>
        `Study Plan Item ${studyPlanItemName} start date`;

    static studentStudyPlanItemEndDate = (studyPlanItemName: string): string =>
        `Study Plan Item ${studyPlanItemName} end date`;

    static studyPlanItemCompletedDate = (name: string, completedDate: string): string =>
        `Study Plan Item ${name} ${completedDate}`;

    static editStudyPlanItemErrorMessage = `Edit Study Plan Item Error Message`;

    static emptyCourseParticipantList = `Empty Course Participant List`;

    static questionTypeTitle = (questionType: string, questionTitle: string): string =>
        `${questionType} ${questionTitle}`;

    static answerTypeTitle = (questionType: string, answerTitle: string): string =>
        `Answer ${questionType} ${answerTitle}`;

    static quizQuestionImg = (img: string): string => `Quiz question img ${img}`;

    static mcqQuestionTypePrefix = `multiple choice`;

    static fibQuestionTypePrefix = `fill in the blank`;

    static miqQuestionTypePrefix = `manual input`;

    static maqQuestionTypePrefix = `multiple answer`;

    static tadQuestionTypePrefix = `term and definition`;

    static powQuestionTypePrefix = `pair of words`;

    static popupReviewQuestionNextButton = `Popup review question next button`;

    static popupReviewQuestionBackButton = `Popup review question back button`;

    static popupReviewQuestionLearningTab = `Popup review question learning tab`;

    static popupReviewQuestionQuizTab = `Popup review question quiz tab`;

    static popupReviewFlashCardTab = `Popup review flash card tab`;

    //Tabs
    static joinedTab = `Joined Tab`;

    static unjoinedTab = `Unjoined Tab`;

    static lessonActiveTab = `Lesson Active Tab`;

    static lessonCompletedTab = `Lesson Completed Tab`;

    static liveLessonRightDrawer = (visible: boolean): string =>
        `Live Lesson Right Drawer ${visible}`;

    static liveLessonChatTab = `Live Lesson Chat Tab`;

    static liveLessonUserTab = `Live Lesson User Tab`;

    static appBarName(name: string) {
        return `App Bar Name ${name}`;
    }

    static snackBar = `Snack Bar`;

    static listActiveLesson = (names: string): string => `List Active Lessons ${names}`;

    static listCompletedLesson = (names: string): string => `List Completed Lesson ${names}`;

    static liveLabelLiveLessonItem = (lessonId: string, lessonName: string): string =>
        `Live Label Live Lesson Item ${lessonId} ${lessonName}`;

    static joinConversationButton = `Join Conversation Button`;

    static systemMessageItem = (index: number): string => `System Message Item ${index}`;

    static joinConversationMessageItem = (index: number): string =>
        `Join Conversation Message Item ${index}`;

    static microButtonLiveLessonInteraction = (enable: boolean): string =>
        `Micro Button Live Lesson Interaction ${enable}`;

    static cameraButtonLiveLessonInteraction = (enable: boolean): string =>
        `Camera Button Live Lesson Interaction ${enable}`;

    static microButtonLiveLessonActive = (active: boolean): string =>
        `Micro Button Live Lesson Active ${active}`;

    static cameraButtonLiveLessonActive = (active: boolean): string =>
        `Camera Button Live Lesson Active ${active}`;

    static shareScreenButtonInteraction = (interaction: boolean): string =>
        `Share Screen Button Interaction ${interaction ?? false}`;

    static shareScreenButtonActive = (active: boolean): string =>
        `Share Screen Button Active ${active ?? false}`;

    static shareMaterialButtonActive = (active: boolean): string =>
        `Share Material Button Active ${active ?? false}`;

    static joinAllLoadingDialog = `Join All Loading Dialog`;

    static mediaItem = (mediaName: string): string => `Media Item ${mediaName}`;

    static viewMaterialScreen = `View Material Screen`;

    static videoView = `Video View`;

    static searchConversationIcon = `Search Conversation Icon`;

    static messageTypeFilterAll = `Message Type Filter - All`;

    static messageTypeFilterNotReply = `Message Type Filter - Not Reply`;

    static contactFilterAll = `Contact Filter - All`;

    static contactFilterStudent = `Contact Filter - Student`;

    static contactFilterParent = `Contact Filter - Parent`;

    static startTimeLiveLesson = `Start Time Live Lesson `;

    static startTimeToEndTimeLiveLesson = `Start Time To End Time Live Lesson `;

    static annotationOnPrevWhiteBoard = `Annotation On Prev White Board`;

    static annotationOnNextWhiteBoard = `Annotation On Next White Board`;

    static annotationPageWhiteBoard = (page: number): string =>
        `Annotation Page White Board ${page}`;

    static liveLessonOnPrevActionBar = `Live Lesson On Prev Action Bar`;

    static liveLessonOnNextActionBar = `Live Lesson On Next Action Bar`;

    static liveLessonPageActionBar = (page: number): string =>
        `Live Lesson Page Action Bar ${page}`;

    static totalLearningProgress = `Total Learning Progress`;

    static quizHistoryDropdown = `Quiz History Dropdown`;

    static quizHistory = `Quiz History`;

    static quizProgressItem = (index: number): string => `Quiz Progress Item index ${index}`;

    static quizCorrectness = (index: number, isCorrect: boolean): string =>
        `Quiz index ${index} is correct : ${isCorrect}`;

    static disconnectingScreenLiveLesson = `Disconnecting Screen Live Lesson`;

    static leaveGroupChatDialogButton = `Leave Group Chat Dialog Button`;

    static leaveGroupChatButton = `Leave Group Chat Button`;

    static courseAvatarKey = (avatar: string): string => `Course Avatar ${avatar}`;

    static flashCardTotalCard = (totalCard: number): string => `Flashcard Total Card ${totalCard}`;

    static flashCardListCardQuestion = (index: number, question: string): string =>
        `Flashcard List Card ${index} ${question}`;

    static flashCardListCardAnswer = (index: number, answer: string): string =>
        `Flashcard List Card ${index} ${answer}`;

    static flashCardListCardImage = (index: number, img: string): string =>
        `Flashcard List Card ${index} ${img}`;

    static liveLessonConversationUnreadBadge = `Live Lesson Conversation Unread Badge`;

    static conversationDetailMenuPopupButton = `Conversation Detail Menu Popup Button`;

    static studyPlanDetailMoreButton = `Study Plan Detail More Button`;

    static editStudyPlanItemSchoolDateMenuPopupButton = `Edit Study Plan Item School Date Menu Popup Button`;

    static archiveStudyPlanItemMenuPopupButton = `Archive Study Plan Item Menu Popup Button`;

    static reactivateStudyPlanItemMenuPopupButton = `Reactivate Study Plan Item Menu Popup Button`;

    static courseStatisticsArchiveStudyPlanItemsMenuPopupButton = `Course Statistics Archive Study Plan Items Menu Popup button`;

    static courseStatisticsUnarchiveStudyPlanItemsMenuPopupButton = `Course Statistics Unarchive Study Plan Items Menu Popup button`;

    static studyPlanItemV2StartEndDate = (
        studyPlanName: string,
        startDate: string,
        endDate: string
    ): string => `Study Plan Item ${studyPlanName} ${startDate} - ${endDate}`;

    static studyPlanItemV2CompletedDate = (studyPlanName: string, completedDate: string): string =>
        `Study Plan Item ${studyPlanName} ${completedDate}`;

    static studyPlanItemV2SchoolDate = (studyPlanName: string, schoolDate: string): string =>
        `Study Plan Item ${studyPlanName} ${schoolDate}`;

    static studyPlanItemStartDatePicker = `Study Plan Item start date picker`;

    static studyPlanItemStartDateClearIconButton = `Study Plan Item start date clear icon button`;

    static studyPlanItemEndDatePicker = `Study Plan Item end date picker`;

    static studyPlanItemEndDateClearIconButton = `Study Plan Item end date clear icon button`;

    static studyPlanItemSchoolDatePicker = `Study Plan Item school date picker`;

    static setUpPollingView = `Set Up Polling View`;

    static setUpPollingOptionKey = (optionName: string, isCorrect: boolean): string =>
        `SetUp Polling Option Key ${optionName} ${isCorrect}`;

    static teachingPollButtonWithActiveStatus = (isActive: boolean): string =>
        `Polling Button With Active Status ${isActive}`;

    static startPollingButton = `Start Polling Button`;

    static hidePollingButton = `Hide Polling Button`;

    static pollingStatsPageKey = `Polling Stats Page`;

    static pollingDetailPageKey = `Polling Detail Page`;

    static teachingPollStopPollingButtonWithStatus = (pollingStatus: string): string =>
        `Stop Polling Button With Status ${pollingStatus}`;

    static liveLessonTeacherPollAddQuizOptionButtonKey = `Live Lesson Add Quiz Option Button Key`;

    static liveLessonTeacherPollRemoveQuizOptionButtonKey = `Live Lesson Remove Quiz Option Button Key`;

    static liveLessonEndedPollingTeacherOkButton = `Live Lesson Ended Polling Teacher Ok Button`;

    static participantListButton = `Participant List Button`;

    static studentInfoAvatar = (userId: string, url: string): string =>
        `Student Info Avatar - ${userId} ${url}`;

    static studentInfoName = (userId: string, name: string): string =>
        `Student Info Name - ${userId} ${name}`;

    static liveLessonPollingStatsPageSubmissionTextKey = (submission: string): string =>
        `Live Lesson Polling Stats Page Submission Text Key ${submission}`;

    static liveLessonPollingStatsPageAccuracyTextKey = (accuracy: string): string =>
        `Live Lesson Polling Stats Page Accuracy Text Key ${accuracy}`;

    static liveLessonPollingListAnswerKey = `Live Lesson Polling List Answer Key`;

    static liveLessonPollingDetailsLearnerAnswerKey = (
        userId: string,
        answer: string,
        isLearnerAnswerCorrectAtLestOneOption: boolean
    ): string =>
        `Live Lesson Polling Details Learner Answer Key userId ${userId} answer ${answer} isLearnerAnswerCorrectAtLestOneOption ${isLearnerAnswerCorrectAtLestOneOption}`;

    static filterConversationByCoursePopupButton = `Filter Conversation By Course Popup Button`;

    static filterConversationByCourseItemKey = (courseId: string): string =>
        `Filter Conversation By Course Item Key - ${courseId}`;

    static courseFilterScrollView = `Course Filter Scroll View`;

    static studentStudyPlanTopicAvatar = (url: string): string =>
        `Student Study Plan Topic Avatar ${url}`;

    static studentStudyPlanTopicGrade = (topicName: string): string =>
        `Student Study Plan Topic Grade ${topicName}`;

    static studentStudyPlanHistoryPopupLearningRecord = (index: number): string =>
        `Student StudyPlan History Popup Grade ${index}`;

    static studentStudyPlanHistoryPopupLO = `Student StudyPlan History Popup LO`;

    static pinnedUserView = (userId: string, active: boolean): string =>
        `Pinned User View ${userId} ${active}`;

    static unpinButton = `Unpin Button`;

    // Location filter

    static locationSettingProfilePopupButton = `Location Setting Profile Popup Button`;

    static locationTreeViewScrollView = `Location Tree View Scroll View`;

    static locationCheckStatus = (locationId: string, status: string): string =>
        `location check status: ${locationId} - ${status}`;

    static selectLocationDialogApplyButtonKey = `Select Location Dialog Apply Button Key`;

    static selectLocationDialogCancelButtonKey = `Select Location Dialog Cancel Button Key`;

    static selectLocationDialogCancelIconButtonKey = `Select Location Dialog Cancel Icon Button Key`;

    static selectLocationDialogAcceptCancellationButtonKey = `Select Location Dialog Accept Cancellation Button Key`;

    static actionBarSelectedLocationFieldsKey = (locationsName: string): string =>
        `Action Bar Selected Locations Field ${locationsName}`;

    static selectLocationDialogConfirmAcceptApplyingButtonKey = `Select Location Dialog Confirm Accept Applying Button Key`;

    static selectLocationDialogCloseIconAcceptApplyingButtonKey = `Select Location Dialog Close Icon Accept Applying Button Key`;

    static selectLocationDialogCancelAcceptApplyingButtonKey = `Select Location Dialog Cancel Accept Applying Button Key`;

    static liveLessonScreenVisible = (index: number): string =>
        `Live Lesson Screen Visible ${index}`;

    static invalidURLScreen = `Invalid URL Screen`;

    static taskAssignmentCompleteDateTextFormField = `Task Assignment Complete Date Text Form Field`;

    static taskAssignmentDurationTextFormField = `Task Assignment Duration Text Form Field`;

    static taskAssignmentCorrectTextFormField = `Task Assignment Correct Text Form Field`;

    static taskAssignmentTotalTextFormField = `Task Assignment Total Text Form Field`;

    static taskAssignmentTextNoteTextFormField = `Task Assignment Text Note Text Form Field`;

    static taskAssignmentAttachmentButton = `Task Assignment Attachment Button`;

    static taskAssignmentRemoveButton = `Task Assignment Remove Button`;

    static taskAssignmentRemovePopupItem = `Task Assignment Remove Popup Item`;

    static taskAssignmentRemoveOption = `Task Assignment Remove Option`;

    static taskAssignmentUnderstandingLevel = (selectedUnderstandingLevel: string): string =>
        `Task Assignment Understanding Level selected UnderstandingLevel ${selectedUnderstandingLevel}`;

    static taskAssignmentStatus = (isComplete: boolean): string =>
        `Task Assignment ${isComplete ? `complete` : `incomplete`} status`;

    static taskAssignmentSaveButtonWithCondition = (isEnabled: boolean): string =>
        `Task Assignment Save Button is enabled : ${isEnabled}`;

    static taskAssignmentAttachmentFiles = (index: number): string =>
        `Task Assignment Attachment Files ${index}`;

    static taskAssignmentScrollBodyView = `Task Assignment Scroll Body View`;

    static attachmentLoading = `Attachment Loading`;

    static taskAssignmentAttachmentLoading = (index: number): string =>
        `Task Assignment Attachment Loading ${index}`;

    static deleteAttachmentButtonByFileName = (fileName: string): string =>
        `Delete Attachment Button By File Name ${fileName}`;

    static cameraDisplay = (userId: string, active: boolean): string =>
        `Camera Display ${userId} ${active}`;

    static liveLessonNoneCameraView = (userId: string): string =>
        `Live Lesson None Camera View ${userId}`;

    static liveLessonSpeakerStatus = (userId: string, active: boolean): string =>
        `Live Lesson Speaker Status ${userId} ${active}`;

    static flashCardStatus = (isCompleted: boolean): string =>
        `Flashcard Status ${isCompleted ? `Completed` : `Incompleted`}`;

    static cameraDisplayOptionButton = (userId: string): string =>
        `Camera Display Option Button ${userId}`;

    static cameraDisplayOptionsMenu = (options: string[]): string =>
        `Camera Display Option Menu ${options.join(`-`)}`;

    static cameraDisplayOptionItem = (text: string, enable: boolean): string =>
        `Camera Display Option Item ${text} ${enable}`;

    static courseStatisticsTopicName = (topicName: string): string =>
        `Course Statistics Topic ${topicName}`;

    static courseStatisticsTopicAverageGrade = (averageGrade: string, topicName: string): string =>
        `Course Statistics Topic Average Grade ${topicName} ${averageGrade}`;

    static courseStatisticsTopicCompletedStudent = (
        completedStudent: string,
        topicName: string
    ): string => `Course Statistics Topic Completed Student ${topicName} ${completedStudent}`;

    static courseStatisticsStudyPlanDropdownKey = `Course Statistics Study Plan Dropdown Key`;

    static courseStatisticsClassDropdownKey = `Course Statistics Class Dropdown Key`;

    static courseStatisticsStudyPlanItemName = (studyPlanItemName: string): string =>
        `Course Statistics Study Plan Item ${studyPlanItemName}`;

    static courseStatisticsStudyPlanItemAverageGrade = (
        averageGrade: string,
        studyPlanItemName: string
    ): string =>
        `Course Statistics Study Plan Item Average Grade ${studyPlanItemName} ${averageGrade}`;

    static cameraDisplayContainerKey = (userId: string, isSpotlighting: boolean) =>
        `Camera Display Container Key ${userId} ${isSpotlighting}`;

    static spotlightIconKey = (userId: string) => `Spotlight Icon Key ${userId}`;

    static courseStatisticsStudyPlanItemCompletedStudent = (
        completedStudent: string,
        studyPlanItemName: string
    ): string =>
        `Course Statistics Study Plan Item Completed Student ${studyPlanItemName} ${completedStudent}`;

    static previewButtonKey = (active: boolean): string => `Preview Button Key ${active}`;

    static previewThumbnailList = `Preview Thumbnail List`;

    static itemPreviewThumbnail = (index: number, selected: boolean) =>
        `Item Preview Thumbnail ${index} ${selected}`;

    static courseStatisticsClassName = (className: string): string =>
        `Course Statistics Class Name ${className}`;

    static courseStatisticsStudyPlanName = (studyPlanName: string): string =>
        `Course Statistics Study Plan Name ${studyPlanName}`;
}
