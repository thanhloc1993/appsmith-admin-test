export class TeacherKeys {
    // Screen
    static drawer: string = `School ListView`;

    static emailLoginScreen: string = `Email Login Screen`;

    static phoneLoginScreen: string = `Phone Login Screen`;

    static phoneSignUpScreen: string = `Phone Sign Up Screen`;

    static loginOtpScreen: string = `Login Otp Screen`;

    static signUpOtpScreen: string = `Sign Up Otp Screen`;

    static signUpInfoScreen: string = `Sign Up Info Screen`;

    static homeScreen: string = `Home Screen`;

    static createFirstClassScreen: string = `Create First Class Screen`;

    static firstInviteLearnerCodeScreen: string = `First Invite Learner Code Screen`;

    static inviteLearnerCodeScreen: string = `Invite Learner Code Screen`;

    static inviteTeacherCodeScreen: string = `Invite Teacher Code Screen`;

    static createClassScreen: string = `Create Class Screen`;

    static settingScreen: string = `Setting Screen`;

    static classroomScreen: string = `Classroom Screen`;

    static messagingScreen: string = `Messaging Screen`;

    static editUserInfoScreen: string = `Edit User Info Screen`;

    static calendarCourseScreen: string = `Calendar Course Screen`;

    static lessonMaterialScreen: string = `Lesson Material Screen`;

    static liveLessonScreen: string = `Live Lesson Screen`;

    static liveCourseScreen: string = `Live Course Screen`;

    static liveStreamScreen: string = `Live Stream Screen`;

    // Input
    static nameTextField: string = `Name TextField`;

    static emailTextField: string = `Email TextField`;

    static schoolTextField: string = `School TextField`;

    static classTextField: string = `Class TextField`;

    static phoneTextField: string = `Phone TextField`;

    static passwordTextField: string = `Password TextField`;

    static otpTextField: string = `Otp TextField`;

    static userNameTextField: string = `User Name Text Field`;

    static studentCommentTextField: string = `Student Comment TextField`;

    static searchCourseInput: string = `Search Course Input`;

    // Button
    static loginButton: string = `Login Button`;

    static signUpButton: string = `Sign Up Button`;

    static loginByPhoneButton: string = `Login By Phone Button`;

    static loginByEmailButton: string = `Login By Email Button`;

    static signupByPhoneButton: string = `Signup By Phone Button`;

    static createAnAccountButton: string = `Create An Account Button`;

    static closeButton: string = `Close Button`;

    static sendButton: string = `Send Button`;

    static nextButton: string = `Next Button`;

    static skipButton: string = `Skip Button`;

    static drawerMenuButton: string = `Drawer Menu Button`;

    static logoutButton: string = `Logout Button`;

    static allowActionButton: string = `Allow Action Button`;

    static denyActionButton: string = `Deny Action Button`;

    static createClassButton: string = `Create Class Button`;

    static addButton: string = `Add Button`;

    static createClassButtonBottomDialog: string = `Create Class Button Bottom Dialog`;

    static shareClassCodeButton: string = `Share Class Code Button`;

    static backButton: string = `Back Button`;

    static editUserButton: string = `Edit User Button`;

    static saveUserInfoButton: string = `Save User Button`;

    static bottomSheetButton = (title: string): string => `${title} Bottom Sheet Button`;

    static scheduleButton: string = `Schedule Button`;

    static joinButton = (enable: boolean, isFirstTeacher: boolean): string =>
        `Join Button ${enable} - Is First Teacher ${isFirstTeacher}`;

    static userButtonInteraction = (interaction: boolean): string =>
        `User Button Interaction ${interaction ?? false}`;

    static shareMaterialButtonInteraction = (interaction: boolean): string =>
        `Share Material Button Interaction ${interaction ?? false}`;

    static stopShareMaterialButton: string = `Stop Share Material Button`;

    static liveLessonStopShareScreenOptionButton: string = `Live Lesson Stop Share Screen Option Button`;

    static endLessonButton: string = `End Lesson Button`;

    static leaveLessonButton: string = `Leave Lesson Button`;

    static endLessonForAllButton: string = `End Lesson For All Button`;

    static endNowButton: string = `End Now Button`;

    static messageLessonButton: string = `Message Lesson Button`;

    static closeEndLiveLessonDialogButton: string = `Close End Live Lesson Dialog Button`;

    static cannotOverlapShareScreenDialogOkButton: string = `Cannot Overlap Share Screen Dialog Ok Button`;

    static joinAllButton: string = `Join All Button`;

    static forgotPasswordButton: string = `Forgot Password Button`;

    static forgotPasswordWithMultiTenantButton: string = `Forgot Password With Multi Tenant Button`;

    static submitEmailButton: string = `Submit Email Button`;

    static backToSignInButton: string = `Back To Sign In Button`;

    static filterIcon: string = `Filter Icon`;

    static retryIcon = (index: number, isRetry: boolean): string =>
        `Retry Icon index ${index} isRetry ${isRetry}`;

    static quizSetResult = (index: number, result: string): string =>
        `Quiz Set index ${index} result ${result}`;

    static raiseHandNotificationButton = ([hasRaiseHand = false]): string =>
        `Raise Hand Notification Button ${hasRaiseHand}`;

    static annotationButton: string = `Live Lesson Annotation Button`;

    static closeAnnotationButton: string = `Live Lesson White Board Close Annotation Button`;

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

    static studentCommentPostButton: string = `Student Comment Post Button`;

    static studentCommentDeleteButton: string = `Student Comment Delete Button`;

    static studentCommentDeleteButtonWithIndex = (index: number): string =>
        `Student Comment Delete Button ${index}`;

    static studentCommentDeleteConfirmButton: string = `Student Comment Delete Confirm Button`;

    static studentCommentDeleteCancelButton: string = `Student Comment Delete Cancel Button`;

    static closeDeleteCommentDialogButton: string = `Close delete comment dialog button`;

    static teacherName = (teacherName: string): string => `Teacher Name ${teacherName}`;

    static commentAt = (dateTime: string): string => `Comment at ${dateTime}`;

    // Text
    static loginText: string = `Login Text`;

    static createAccountText: string = `Create Account Text`;

    static signUpText: string = `Sign Up Text`;

    static signInText: string = `Sign In Text`;

    static classCodeText: string = `Class Code Text`;

    static text(text: string) {
        return `${text} Text`;
    }

    static commentOnStudentText: string = `Comment On Student Text`;

    // Tab
    static messagingTab: string = `Messaging Tab`;

    static classroomTab: string = `Classroom Tab`;

    static settingTab: string = `Setting Tab`;

    static lessonTab: string = `Lesson Tab`;

    static studyPlanTab: string = `Study Plan Tab`;

    static studentTab: string = `Student Tab`;

    static materialTab: string = `Material Tab`;

    static studentInfoTab: string = `Student Information Tab`;

    static studentStudyPlanTab: string = `Student Study Plan Tab`;

    static statisticsTab: string = `Statistics Tab`;

    static pollingStatsTabKey: string = `Polling Stats Tab`;

    static pollingDetailTabKey: string = `Polling Detail Tab`;

    // Item
    static classItem = (name: string): string => `${name} Class Item`;

    static memberItem = (name: string): string => `${name} Member Item`;

    static liveCourseItem = (name: string): string => `${name} Live Course Item`;

    static liveLessonItem = (id: string, name: string): string => `${id} ${name} Live Lesson Item`;

    static courseItem: string = `Course Item`;

    static course = (name: string): string => `${name} Course`;

    static courseList = (length: number): string => `Course list ${length}`;

    static materialItem = (name: string): string => `${name} material item`;

    // List
    static classroomList: string = `Classroom List`;

    // Dialog
    static confirmAlertDialog: string = `Confirm Alert Dialog`;

    static bottomSheet2OptionDialog: string = `Bottom Sheet 2 Option`;

    static listMaterialDialog: string = `List Material Dialog`;

    static endLessonDialog: string = `End Lesson Dialog`;

    static endLiveLessonDialog: string = `End Live Lesson Dialog`;

    static cannotOverlapShareScreenDialog: string = `Cannot Overlap Share Screen Dialog`;

    static sendingDialog: string = `Sending Dialog`;

    //Menu
    static userProfileMenu: string = `User Profile Menu`;

    static conversationFilterMenu: string = `Conversation Filter Menu`;

    //View
    static actionBar: string = `Action Bar`;

    static studentStudyPlanView: string = `Student Study Plan View`;

    static studentInformationView: string = `Student Information View`;

    static videoLiveLessonView = (videoId: string): string => `Live Lesson Video View ${videoId}`;

    // Screen
    static email_login_screen: string = `Email Login Screen`;

    static phone_login_screen: string = `Phone Login Screen`;

    static home_screen: string = `Home Screen`;

    static toReviewScreen: string = `To Review Screen`;

    static submissionDetailsScreen: string = `Submission Details Screen`;

    static login_screen_key: string = `Login Screen String`;

    static forgot_password_screen_key: string = `Forgot Password Screen String`;

    static submitted_email_screen_key: string = `Submitted Email Screen String`;

    static email_text_field: string = `Email TextField`;

    static organization_text_field: string = `Organization TextField`;

    static phone_text_field: string = `Phone TextField`;

    static password_text_field: string = `Password TextField`;

    static conversationFilterTextField: string = `Conversation Filter TextField`;

    static studentConversationItem(studentId: string) {
        return `Student Conversation Item ${studentId}`;
    }

    static parentConversationItem(studentId: string) {
        return `Parent Conversation Item ${studentId}`;
    }

    static noCourseResultScreen: string = `No Course Result Screen`;

    // Button
    static login_button: string = `Login Button`;

    static login_with_phone_number_button: string = `Login with Phone number Button`;

    static login_with_email_address_button: string = `Login with Email address`;

    static toReviewButton: string = `To Review Button`;

    static attachYourMaterials: string = `Attach your materials`;

    static saveChangesButton: string = `Save Changes Button`;

    static saveAndReturnButton: string = `Save And Return Button`;

    static userProfileButton: string = `User Profile Button`;

    static signOutDialogButton: string = `Sign out Button`;

    static deleteAttachment: string = `Delete Attachment Button`;

    static startLessonButton: string = `Start Lesson Button`;

    static hideListStudentButton: string = `Hide List Student Button`;

    static messageButton: string = `Message Button`;

    static applyButton: string = `Apply Button`;

    static resetAllButton: string = `Reset All Button`;

    static joinAllDialogButton: string = `Join All Dialog Button`;

    static joinAllSuccessMessage: string = `Join All Successfully`;

    static muteAllAudioButton: string = `Mute All Audio Button`;

    static muteAllCameraButton: string = `Mute All Camera Button`;

    static handOffButton: string = `Hand Off Button`;

    // Text Field
    static gradeTextField: string = `Grade Text Field`;

    static maxGradeTextField = (maxGrade: string): string => `Max Grade ${maxGrade}`;

    static assignmentNameTextField = (name: string): string => `Assignment Name ${name}`;

    static assignmentTextFeedbacksTextField: string = `Assignment text feedbacks`;

    static assignmentInstructionEmptyView: string = `Assignment Instruction Empty View`;

    static assignmentInstructionTextField = (instruction: string): string =>
        `Assignment Instruction ${instruction}`;

    static assignmentStudentNoteTextField = (note: string): string =>
        `Assignment Student Note ${note}`;

    // Drop Down
    static statusDropDown: string = `Status Drop Down`;

    static notMarkedDropDown: string = `Not Marked Drop Down Button`;

    static inProgressDropDown: string = `In Progress Drop Down Button`;

    static markedDropDown: string = `Marked Drop Down Button`;

    static returnedDropDown: string = `Returned Drop Down Button`;

    static courseStudyPlanDropdown: string = `Course Study Plan Drop Down`;

    // File Test
    static imageTestFile: string = `image_test_file.jpeg`;

    static pdfTestFile: string = `pdf_test_file.pdf`;

    static videoTestFile: string = `video_test_file.mp4`;

    static submission = (index: number): string => `Submission${index}`;

    static companyLogo: string = `Company Logo`;

    static student = (studentId: string): string => `Student ${studentId}`;

    static studentAvatarWidget = (avatarUrl: string): string => `Student Avatar Url ${avatarUrl}`;

    static studentName: string = `Student Name`;

    static notLoggedInTagWithUserName = (username: string): string => `Not Logged In ${username}`;

    static studentSearchTextField: string = `Student Search Text Field`;

    static studentSearchButton: string = `Student Search Button`;

    static courseDetailsScreen: string = `Course Details Screen`;

    static courseParticipantScreen: string = `Course Participant Screen`;

    static studentStudyPlanScreen: string = `Student Study Plan Screen`;

    static studentStudyPlanScrollView: string = `Student Study Plan Scroll View`;

    static courseStudyPlanScreen: string = `Course Study Plan Screen`;

    static courseStudyPlanAssignmentScreen: string = `Course Study Plan Assignment Screen`;

    static scoreCourseStudyPlanAssignmentScreen: string = `Score Course Study Plan Assignment Screen`;

    static submissionStudentName: string = `Submission Student Name`;

    // Tab
    static liveLessonTab: string = `Live Lesson Tab`;

    // Remove file
    static removeFile = (fileName: string): string => `remove ${fileName}`;

    // Remove file
    static removeTestFile: string = `Remove Test File`;

    static returnButton: string = `Return button`;

    static selectCourseDropDown: string = `Select course drop down`;

    static selectClassDropDown: string = `Select class drop down`;

    static menuSelectCourse: string = `Menu select course`;

    static menuSelectClass: string = `Menu select class`;

    static menuSelectStatus: string = `Menu select status`;

    static hideMenuSelectClassDropDown: string = `hide menu select class drop down`;

    static hideMenuSelectStatusDropDown: string = `hide menu select status drop down`;

    static selectStatusDropDown: string = `Select status drop down`;

    static selectDate: string = `Select date`;

    static submissionFilterEmpty: string = `Submission filter empty`;

    static submissionsAreEmpty: string = `Submissions are empty`;

    static allClassMenuItem: string = `all class`;

    static allStatusMenu: string = `all status`;

    static studentList: string = `Student List`;

    static materialList = (length: number): string => `Material List ${length}`;

    static waitingRoomBanner: string = `Waiting Room Banner`;

    static allCourseMenuItem: string = `All Course Menu Item`;

    static hideMenuSelectCourseDropDown: string = `Hide Menu Select Course Dropdown`;

    static annotationBar: string = `Live Lesson Annotation Bar`;

    static courseStudyPlanItem: string = `Course Study Plan Item`;

    static studyPlanTopicListEmpty: string = `Study Plan Topic List Empty`;

    static studyPlanTopicProgress = (topicName: string, completed: number, total: number): string =>
        `Study Plan Topic ${topicName} Progress ${completed}/${total}`;

    static studentStudyPlanTopicRow = (topicName: string): string =>
        `Student Study Plan Topic Row ${topicName}`.replace("'", '');

    static pageControl: string = `Page Control`;

    static firstTopic: string = `First Topic`;

    static secondTopic: string = `Second Topic`;

    static studyPlanTopicList: string = `Study Plan Topic List`;

    static secondStudyPlanTopicList: string = `Second Study Plan Topic List`;

    static topicStudyPlanItem: string = `Topic Study Plan Item`;

    static classDropdown: string = `Class drop down`;

    static classDropdownItem: string = `Class drop down item`;

    static classMemberScrollView: string = `Class Member Scroll View`;

    static classWorkProgressTable: string = `Class work progress table`;

    static nextClassMemberButton: string = `Next Class Member Button`;

    static previousClassMemberButton: string = `Previous Class Member Button`;

    static classMemberPaging: string = `Class Member Paging`;

    static classMemberActionMore = (studentName: string): string =>
        `${studentName} Class Member Action More`;

    static classMemberActionPopup: string = `Class Member Action Pop up`;

    static classMemberActionGrade: string = `Class Member Action Grade`;

    static classMemberActionChangeDueDate: string = `Class Member Action Change Due Date`;

    static classMemberActionRemoveSubmission: string = `Class Member Action Remove Submission`;

    static removeSubmissionConfirmDialog: string = `Remove Submission Confirm Dialog`;

    static cancelRemoveSubmissionConfirmDialog: string = `Cancel Remove Submission Confirm Dialog`;

    static assignmentStudentSubmissionRow = (studentName: string): string =>
        `${studentName} Assignment Student Submission Row`;

    static languagesIcon: string = `Languages Icon`;

    static languagesPopupMenu: string = `Languages Popup Menu`;

    static languageItem = (languageCode: string): string => `${languageCode} language item`;

    static yourCourse: string = `Your Course`;

    static courseScrollView: string = `Course Scroll View`;

    static languageCodeFlag = (languageCode: string): string => `${languageCode} Flag`;

    static liveLessonListCameraView: string = `Live Lesson List Camera View`;

    static liveLessonWhiteBoardView: string = `Live Lesson White Board View`;

    static liveLessonSharedScreenView: string = `Live Lesson Shared Screen View`;

    static liveLessonActionBarView: string = `Live Lesson Action Bar View`;

    static liveLessonScreenShareBar: string = `Live Lesson Screen Bar View`;

    static studentStudyPlanDropDown: string = `Student Study Plan Dropdown`;

    static studentStudyPlanDropDownDisable: string = `Student Study Plan Dropdown Disable`;

    static studentStudyPlanItemList: string = `Student Study Plan Item List`;

    static studentStudyPlanItemListInATopic = (topicName: string): string =>
        `Student Study Plan Item List In A Topic ${topicName}`;

    static studentStudyPlanTopicWithPosition = (topicName: string, position: number): string =>
        `Student Study Plan Topic ${topicName} at ${position}`;

    static studentStudyPlanItemEmptyList: string = `Student Study Plan Item Empty List`;

    static studentStudyPlanName = (studyPlanName: string): string =>
        `Student Study Plan ${studyPlanName}`.replace("'", '');

    static studentStudyPlanItemRow = (studyPlanItemName: string): string =>
        `Student Study Plan Item Row ${studyPlanItemName}`;

    static studentStudyPlanItemRowVsPosition = (index: number, itemName: string): string =>
        `Student Study Plan Item Row ${itemName} ${index}`;

    static loContentPopupScreen: string = `LO Content Popup Screen`;

    static loContentPopupTitleText = (name: string): string => `LO Content Popup Title ${name}`;

    static loContentPopupTitle: string = `LO Content Popup Title`;

    static loContentPopupStudyGuide = (studyGuide: string): string =>
        `LO Content Popup Study Guide ${studyGuide}`;

    static loContentPopupVideo = (video: string): string => `LO Content Popup Video ${video}`;

    static studentStudyPlanLOHistoryButton = (loId: string): string =>
        `Student Study Plan LO History ${loId}`;

    static studentStudyPlanItemGradeText = (
        studyPlanItem: string,
        studentName: string = ''
    ): string => `Student Study Plan Item Grade ${studyPlanItem} ${studentName}`;

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

    static studentStudyPlanLOSubmissionHistoryPopup: string = `Student Study Plan LO Submission History Popup`;

    static studentStudyPlanLOSubmissionHistoryPopupRow: string = `Student Study Plan LO Submission History Popup Row`;

    static hideHistoryPopupMenu: string = `Hide history popup menu`;

    static selectedStudyPlanItem: string = `Selected Study Plan Item`;

    static studentStudyPlanItemCheckBox = (studyPlanItemId: string): string =>
        `Student Study Plan Item Check Box ${studyPlanItemId}`;

    static studentAllStudyPlanItemsCheckBox = (topicId: string): string =>
        `Student All Study Plan Items Check Box ${topicId}`;

    static editStudyPlanItemTimeButton: string = `Edit Study Plan Item Time Button`;

    static cancelEditStudyPlanItemTimeButton: string = `Cancel Edit Study Plan Item Time Button`;

    static okEditStudyPlanItemTimeButton: string = `OK Edit Study Plan Item Time Button`;

    static okEditStudyPlanItemTimeButtonDisabled: string = `OK Edit Study Plan Item Time Button Disabled`;

    static studentStudyPlanItemStartDate = (studyPlanItemName: string): string =>
        `Study Plan Item ${studyPlanItemName} start date`;

    static studentStudyPlanItemEndDate = (studyPlanItemName: string): string =>
        `Study Plan Item ${studyPlanItemName} end date`;

    static studyPlanItemCompletedDate = (name: string, completedDate: string): string =>
        `Study Plan Item ${name} ${completedDate}`;

    static editStudyPlanItemErrorMessage: string = `Edit Study Plan Item Error Message`;

    static emptyCourseParticipantList: string = `Empty Course Participant List`;

    static questionTypeTitle = (questionType: string, questionTitle: string): string =>
        `${questionType} ${questionTitle}`;

    static answerTypeTitle = (questionType: string, answerTitle: string): string =>
        `Answer ${questionType} ${answerTitle}`;

    static quizQuestionImg = (img: string): string => `Quiz question img ${img}`;

    static mcqQuestionTypePrefix: string = `multiple choice`;

    static fibQuestionTypePrefix: string = `fill in the blank`;

    static miqQuestionTypePrefix: string = `manual input`;

    static maqQuestionTypePrefix: string = `multiple answer`;

    static tadQuestionTypePrefix: string = `term and definition`;

    static powQuestionTypePrefix: string = `pair of words`;

    static popupReviewQuestionNextButton: string = `Popup review question next button`;

    static popupReviewQuestionBackButton: string = `Popup review question back button`;

    static popupReviewQuestionLearningTab: string = `Popup review question learning tab`;

    static popupReviewQuestionQuizTab: string = `Popup review question quiz tab`;

    static popupReviewFlashCardTab: string = `Popup review flash card tab`;

    //Tabs
    static joinedTab: string = `Joined Tab`;

    static unjoinedTab: string = `Unjoined Tab`;

    static lessonActiveTab: string = `Lesson Active Tab`;

    static lessonCompletedTab: string = `Lesson Completed Tab`;

    static liveLessonRightDrawer = (visible: boolean): string =>
        `Live Lesson Right Drawer ${visible}`;

    static liveLessonChatTab: string = `Live Lesson Chat Tab`;

    static liveLessonUserTab: string = `Live Lesson User Tab`;

    static appBarName(name: string) {
        return `App Bar Name ${name}`;
    }

    static snackBar: string = `Snack Bar`;

    static listActiveLesson = (names: string): string => `List Active Lessons ${names}`;

    static listCompletedLesson = (names: string): string => `List Completed Lesson ${names}`;

    static liveLabelLiveLessonItem = (lessonId: string, lessonName: string): string =>
        `Live Label Live Lesson Item ${lessonId} ${lessonName}`;

    static joinConversationButton: string = `Join Conversation Button`;

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

    static joinAllLoadingDialog: string = `Join All Loading Dialog`;

    static mediaItem = (mediaName: string): string => `Media Item ${mediaName}`;

    static viewMaterialScreen: string = `View Material Screen`;

    static videoView: string = `Video View`;

    static searchConversationIcon: string = `Search Conversation Icon`;

    static messageTypeFilterAll: string = `Message Type Filter - All`;

    static messageTypeFilterNotReply: string = `Message Type Filter - Not Reply`;

    static contactFilterAll: string = `Contact Filter - All`;

    static contactFilterStudent: string = `Contact Filter - Student`;

    static contactFilterParent: string = `Contact Filter - Parent`;

    static startTimeLiveLesson: string = `Start Time Live Lesson `;

    static startTimeToEndTimeLiveLesson: string = `Start Time To End Time Live Lesson `;

    static annotationOnPrevWhiteBoard: string = `Annotation On Prev White Board`;

    static annotationOnNextWhiteBoard: string = `Annotation On Next White Board`;

    static annotationPageWhiteBoard = (page: number): string =>
        `Annotation Page White Board ${page}`;

    static liveLessonOnPrevActionBar: string = `Live Lesson On Prev Action Bar`;

    static liveLessonOnNextActionBar: string = `Live Lesson On Next Action Bar`;

    static liveLessonPageActionBar = (page: number): string =>
        `Live Lesson Page Action Bar ${page}`;

    static totalLearningProgress: string = `Total Learning Progress`;

    static quizHistoryDropdown: string = `Quiz History Dropdown`;

    static quizHistory: string = `Quiz History`;

    static quizProgressItem = (index: number): string => `Quiz Progress Item index ${index}`;

    static quizCorrectness = (index: number, isCorrect: boolean): string =>
        `Quiz index ${index} is correct : ${isCorrect}`;

    static disconnectingScreenLiveLesson: string = `Disconnecting Screen Live Lesson`;

    static leaveGroupChatDialogButton: string = `Leave Group Chat Dialog Button`;

    static leaveGroupChatButton: string = `Leave Group Chat Button`;

    static courseAvatarKey = (avatar: string): string => `Course Avatar ${avatar}`;

    static flashCardTotalCard = (totalCard: number): string => `Flashcard Total Card ${totalCard}`;

    static flashCardListCardQuestion = (index: number, question: string): string =>
        `Flashcard List Card ${index} ${question}`;

    static flashCardListCardAnswer = (index: number, answer: string): string =>
        `Flashcard List Card ${index} ${answer}`;

    static flashCardListCardImage = (index: number, img: string): string =>
        `Flashcard List Card ${index} ${img}`;

    static liveLessonConversationUnreadBadge: string = `Live Lesson Conversation Unread Badge`;

    static conversationDetailMenuPopupButton: string = `Conversation Detail Menu Popup Button`;

    static studyPlanDetailMoreButton: string = `Study Plan Detail More Button`;

    static editStudyPlanItemSchoolDateMenuPopupButton: string = `Edit Study Plan Item School Date Menu Popup Button`;

    static archiveStudyPlanItemMenuPopupButton: string = `Archive Study Plan Item Menu Popup Button`;

    static reactivateStudyPlanItemMenuPopupButton: string = `Reactivate Study Plan Item Menu Popup Button`;

    static studyPlanItemV2StartEndDate = (
        studyPlanName: string,
        startDate: string,
        endDate: string
    ): string => `Study Plan Item ${studyPlanName} ${startDate} - ${endDate}`;

    static studyPlanItemV2CompletedDate = (studyPlanName: string, completedDate: string): string =>
        `Study Plan Item ${studyPlanName} ${completedDate}`;

    static studyPlanItemV2SchoolDate = (studyPlanName: string, schoolDate: string): string =>
        `Study Plan Item ${studyPlanName} ${schoolDate}`;

    static studyPlanItemStartDatePicker: string = `Study Plan Item start date picker`;

    static studyPlanItemStartDateClearIconButton: string = `Study Plan Item start date clear icon button`;

    static studyPlanItemEndDatePicker: string = `Study Plan Item end date picker`;

    static studyPlanItemEndDateClearIconButton: string = `Study Plan Item end date clear icon button`;

    static studyPlanItemSchoolDatePicker: string = `Study Plan Item school date picker`;

    static setUpPollingView: string = `Set Up Polling View`;

    static setUpPollingOptionKey = (optionName: string, isCorrect: boolean): string =>
        `SetUp Polling Option Key ${optionName} ${isCorrect}`;

    static teachingPollButtonWithActiveStatus = (isActive: boolean): string =>
        `Polling Button With Active Status ${isActive}`;

    static startPollingButton: string = `Start Polling Button`;

    static hidePollingButton: string = `Hide Polling Button`;

    static pollingStatsPageKey: string = `Polling Stats Page`;

    static pollingDetailPageKey: string = `Polling Detail Page`;

    static teachingPollStopPollingButtonWithStatus = (pollingStatus: string): string =>
        `Stop Polling Button With Status ${pollingStatus}`;

    static liveLessonTeacherPollAddQuizOptionButtonKey: string = `Live Lesson Add Quiz Option Button Key`;

    static liveLessonTeacherPollRemoveQuizOptionButtonKey: string = `Live Lesson Remove Quiz Option Button Key`;

    static liveLessonEndedPollingTeacherOkButton: string = `Live Lesson Ended Polling Teacher Ok Button`;

    static participantListButton: string = `Participant List Button`;

    static studentInfoAvatar = (userId: string, url: string): string =>
        `Student Info Avatar - ${userId} ${url}`;

    static studentInfoName = (userId: string, name: string): string =>
        `Student Info Name - ${userId} ${name}`;

    static liveLessonPollingStatsPageSubmissionTextKey = (submission: string): string =>
        `Live Lesson Polling Stats Page Submission Text Key ${submission}`;

    static liveLessonPollingStatsPageAccuracyTextKey = (accuracy: string): string =>
        `Live Lesson Polling Stats Page Accuracy Text Key ${accuracy}`;

    static liveLessonPollingListAnswerKey: string = `Live Lesson Polling List Answer Key`;

    static liveLessonPollingDetailsLearnerAnswerKey = (
        userId: string,
        answer: string,
        isLearnerAnswerCorrectAtLestOneOption: boolean
    ): string =>
        `Live Lesson Polling Details Learner Answer Key userId ${userId} answer ${answer} isLearnerAnswerCorrectAtLestOneOption ${isLearnerAnswerCorrectAtLestOneOption}`;

    static filterConversationByCoursePopupButton: string = `Filter Conversation By Course Popup Button`;

    static filterConversationByCourseItemKey = (courseId: string): string =>
        `Filter Conversation By Course Item Key - ${courseId}`;

    static courseFilterScrollView: string = `Course Filter Scroll View`;

    static studentStudyPlanTopicAvatar = (url: string): string =>
        `Student Study Plan Topic Avatar ${url}`;

    static studentStudyPlanTopicGrade = (topicName: string): string =>
        `Student Study Plan Topic Grade ${topicName}`;

    static studentStudyPlanHistoryPopupLearningRecord = (index: number): string =>
        `Student StudyPlan History Popup Grade ${index}`;

    static studentStudyPlanHistoryPopupLO: string = `Student StudyPlan History Popup LO`;

    static pinnedUserView = (userId: string, active: boolean): string =>
        `Pinned User View ${userId} ${active}`;

    static unpinButton: string = `Unpin Button`;

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

    static taskAssignmentCompleteDateTextFormField: string = `Task Assignment Complete Date Text Form Field`;

    static taskAssignmentDurationTextFormField: string = `Task Assignment Duration Text Form Field`;

    static taskAssignmentCorrectTextFormField: string = `Task Assignment Correct Text Form Field`;

    static taskAssignmentTotalTextFormField: string = `Task Assignment Total Text Form Field`;

    static taskAssignmentTextNoteTextFormField: string = `Task Assignment Text Note Text Form Field`;

    static taskAssignmentAttachmentButton: string = `Task Assignment Attachment Button`;

    static taskAssignmentRemoveButton: string = `Task Assignment Remove Button`;

    static taskAssignmentRemovePopupItem: string = `Task Assignment Remove Popup Item`;

    static taskAssignmentRemoveOption: string = `Task Assignment Remove Option`;

    static taskAssignmentUnderstandingLevel = (selectedUnderstandingLevel: string): string =>
        `Task Assignment Understanding Level selected UnderstandingLevel ${selectedUnderstandingLevel}`;

    static taskAssignmentStatus = (isComplete: boolean): string =>
        `Task Assignment ${isComplete ? `complete` : `incomplete`} status`;

    static taskAssignmentSaveButtonWithCondition = (isEnabled: boolean): string =>
        `Task Assignment Save Button is enabled : ${isEnabled}`;

    static taskAssignmentAttachmentFiles = (index: number): string =>
        `Task Assignment Attachment Files ${index}`;

    static taskAssignmentScrollBodyView: string = `Task Assignment Scroll Body View`;

    static attachmentLoading: string = `Attachment Loading`;

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

    static previewThumbnailList: string = `Preview Thumbnail List`;

    static itemPreviewThumbnail = (index: number, selected: boolean) =>
        `Item Preview Thumbnail ${index} ${selected}`;

    static courseStatisticsClassName = (className: string): string =>
        `Course Statistics Class Name ${className}`;

    static courseStatisticsStudyPlanName = (studyPlanName: string): string =>
        `Course Statistics Study Plan Name ${studyPlanName}`;
}
