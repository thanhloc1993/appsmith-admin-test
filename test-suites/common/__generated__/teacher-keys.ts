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

    static lessonMaterialScreen = `Lesson Material Screen`;

    static liveLessonScreen = `Live Lesson Screen`;

    static liveCourseScreen = `Live Course Screen`;

    static liveStreamScreen = `Live Stream Screen`;

    static noCourseResultScreen = `No Course Result Screen`;

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

    static filterIcon = `Filter Icon`;

    static retryIcon = (index: number, isRetry: boolean): string =>
        `Retry Icon index ${index} isRetry ${isRetry}`;

    static quizSetResult = (index: number, result: string): string =>
        `Quiz Set index ${index} result ${result}`;

    static raiseHandNotificationButton = ([hasRaiseHand = false]): string =>
        `Raise Hand Notification Button ${hasRaiseHand}`;

    static annotationButton = `Live Lesson Annotation Button`;

    static toolPicker = `Live Lesson White Board Tool Picker`;

    static selectorTool = `Live Lesson White Board Selector Tool`;

    static laserPointerTool = `Live Lesson White Board Laser Pointer Tool`;

    static textTool = `Live Lesson White Board Text Tool`;

    static pencilTool = `Live Lesson White Board Pencil Tool`;

    static rectangleTool = `Live Lesson White Board Rectangle Tool`;

    static ellipseTool = `Live Lesson White Board Ellipse Tool`;

    static straightTool = `Live Lesson White Board Straight Tool`;

    static handTool = `Live Lesson White Board Hand Tool`;

    static eraserTool = `Live Lesson White Board Eraser Tool`;

    static annotationBarStrokePathKey = (size: number, selected: boolean): string =>
        `Live Lesson Annotation Bar Stroke Path size ${size} selected ${selected}`;

    static annotationBarColorPickerColorIndexKey = (
        colorIndex: number,
        selected: boolean
    ): string =>
        `Live Lesson Annotation Bar Color Picker Color Index ${colorIndex} selected ${selected}`;

    static closeAnnotationButton = `Live Lesson White Board Close Annotation Button`;

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

    static statisticsTab = `Statistics Tab`;

    static studentTab = `Student Tab`;

    static materialTab = `Material Tab`;

    static studentInfoTab = `Student Information Tab`;

    static studentStudyPlanTab = `Student Study Plan Tab`;

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

    static studentInformationView = `Student Information View`;

    static videoLiveLessonView = (videoId: string): string => `Video Live Lesson View ${videoId}`;

    // Screen
    static toReviewScreen = `To Review Screen`;

    static loginScreenKey = `Login Screen String`;

    static forgotPasswordScreenKey = `Forgot Password Screen String`;

    static submittedEmailScreenKey = `Submitted Email Screen String`;

    static organizationTextField = `Organization TextField`;

    static conversationFilterTextField = `Conversation Filter TextField`;

    static studentConversationItem(studentId: string) {
        return `Student Conversation Item ${studentId}`;
    }

    static parentConversationItem(studentId: string) {
        return `Parent Conversation Item ${studentId}`;
    }

    // Button
    static loginWithPhoneNumberButton = `Login with Phone number Button`;

    static toReviewButton = `To Review Button`;

    static attachYourMaterials = `Attach your materials`;

    static saveChangesButton = `Save Changes Button`;

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

    static forgotPasswordButton = `Forgot Password Button`;

    static loginWithNormalFlowButton = `Login With Normal Flow Button`;

    static loginWithMultiTenantButton = `Login With Multi Tenant Button`;

    static forgotPasswordWithMultiTenantButton = `Forgot Password With Multi Tenant Button`;

    static submitEmailButton = `Submit Email Button`;

    static backToSignInButton = `Back To Sign In Button`;

    // Text Field
    static assignmentInstructionEmptyView = `Assignment Instruction Empty View`;

    static assignmentInstructionTextField = (instruction: string): string =>
        `Assignment Instruction ${instruction}`;

    // Drop Down

    static courseStudyPlanDropdown = `Course Study Plan Drop Down`;

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

    static studentStudyPlanScrollView = `Student Study Plan Scroll View`;

    static courseStudyPlanScreen = `Course Study Plan Screen`;

    static courseStudyPlanAssignmentScreen = `Course Study Plan Assignment Screen`;

    // Tab
    static liveLessonTab = `Live Lesson Tab`;

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

    static studentStudyPlanItemEmptyList = `Student Study Plan Item Empty List`;

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

    static selectedStudyPlanItem = `Selected Study Plan Item`;

    static studentStudyPlanItemStartDate = (studyPlanItemName: string): string =>
        `Study Plan Item ${studyPlanItemName} start date`;

    static studentStudyPlanItemEndDate = (studyPlanItemName: string): string =>
        `Study Plan Item ${studyPlanItemName} end date`;

    static emptyCourseParticipantList = `Empty Course Participant List`;

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

    static disconnectingScreenLiveLesson = `Disconnecting Screen Live Lesson`;

    static leaveGroupChatDialogButton = `Leave Group Chat Dialog Button`;

    static leaveGroupChatButton = `Leave Group Chat Button`;

    static courseAvatarKey = (avatar: string): string => `Course Avatar ${avatar}`;

    static liveLessonConversationUnreadBadge = `Live Lesson Conversation Unread Badge`;

    static conversationDetailMenuPopupButton = `Conversation Detail Menu Popup Button`;

    static studyPlanItemV2StartEndDate = (
        studyPlanName: string,
        startDate: string,
        endDate: string
    ): string => `Study Plan Item ${studyPlanName} ${startDate} - ${endDate}`;

    static studyPlanItemV2CompletedDate = (studyPlanName: string, completedDate: string): string =>
        `Study Plan Item ${studyPlanName} ${completedDate}`;

    static studyPlanItemV2SchoolDate = (studyPlanName: string, schoolDate: string): string =>
        `Study Plan Item ${studyPlanName} ${schoolDate}`;

    static liveLessonTeacherPollAddQuizOptionButtonKey = `Live Lesson Add Quiz Option Button Key`;

    static liveLessonTeacherPollRemoveQuizOptionButtonKey = `Live Lesson Remove Quiz Option Button Key`;

    static participantListButton = `Participant List Button`;

    static studentInfoAvatar = (userId: string, url: string): string =>
        `Student Info Avatar - ${userId} ${url}`;

    static studentInfoName = (userId: string, name: string): string =>
        `Student Info Name - ${userId} ${name}`;

    static filterConversationByCoursePopupButton = `Filter Conversation By Course Popup Button`;

    static filterConversationByCourseItemKey = (courseId: string): string =>
        `Filter Conversation By Course Item Key - ${courseId}`;

    static courseFilterScrollView = `Course Filter Scroll View`;

    static pinnedUserView = (userId: string): string => `Pinned User View ${userId}`;

    static unpinButton = `Unpin Button`;

    // Location filter

    static locationTreeViewScrollView = `Location Tree View Scroll View`;

    static selectLocationDialogApplyButtonKey = `Select Location Dialog Apply Button Key`;

    static selectLocationDialogConfirmAcceptApplyingButtonKey = `Select Location Dialog Confirm Accept Applying Button Key`;

    static selectLocationDialogCloseIconAcceptApplyingButtonKey = `Select Location Dialog Close Icon Accept Applying Button Key`;

    static selectLocationDialogCancelAcceptApplyingButtonKey = `Select Location Dialog Cancel Accept Applying Button Key`;

    static selectLocationDialogCancelButtonKey = `Select Location Dialog Cancel Button Key`;

    static selectLocationDialogCancelIconButtonKey = `Select Location Dialog Cancel Icon Button Key`;

    static selectLocationDialogAcceptCancellationButtonKey = `Select Location Dialog Accept Cancellation Button Key`;

    static actionBarSelectedLocationFieldsKey = (locationsName: string): string =>
        `Action Bar Selected Locations Field ${locationsName}`;

    static invalidUrlScreen = `Invalid URL Screen`;
}
