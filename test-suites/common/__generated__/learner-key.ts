export class LearnerKeys {
    static homeScreen = `Home Screen`;

    static homeScreenDrawerButton = `home Screen Drawer Button`;

    static homeDrawer = `home Drawer`;

    static authMultiUsersScreen = `Auth Multi Users Screen`;

    static addANewAccountButton = `add A New Account Button`;

    static loginWithMultiTenantButton = `Login With Multi tenant Button`;

    static logoutButton = `logout Button`;

    static confirmedLogoutDialog = `Confirmed Logout Dialog`;

    static confirmedLogoutDialogYesButton = `Confirmed Logout Dialog Yes Button`;

    static confirmedLogoutDialogNoButton = `Confirmed Logout Dialog No Button`;

    static manageAccountButton = `manage Account Button`;

    static authSignInScreen = `auth SignIn Screen`;

    static authSearchOrganizationScreen = `auth Search Organization Screen`;

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

    static backButton = `Back Button`;

    static appBar = `App Bar`;

    static learningTab = `Learning Tab`;

    static todosTab = `To-Dos Tab`;

    static lessonTab = `Lesson Tab`;

    static messagesTab = `Messages Tab`;

    static statsTab = `Stats Tab`;

    static lessonPage = `Lesson Page`;

    static messagesPage = `Messages Page`;

    static studyPlanItemWithPosition(index: number, name: string) {
        return `${index} ${name} Study Plan`;
    }

    static nextButton = `Next Button`;

    static nextButtonUnenabled = `Next Button Unenabled`;

    static successSnackbar = `Success SnackBar`;

    static errorSnackbar = `Error SnackBar`;

    static defaultSnackbar = `Default SnackBar`;

    static submitButton = `Submit Button`;

    static confirmButton = `Confirm Button`;

    static cancelButton = `Cancel Button`;

    static loadingDialog = `Loading Dialog`;

    static subject(name: string) {
        return `${name} Subject`;
    }

    static lo(loName: string) {
        return `${loName} LO`;
    }

    static phoneNumberTextField = `Phone number Text Field`;

    static createAccountText = `Create account Text`;

    static loginButton = `Login Button`;

    static loginScreen = `Login Screen`;

    static loginText = `Log in Text`;

    static registerScreen = `Register Screen`;

    static signUpWithPhoneButton = `Sign up with phone Button`;

    static entryExitRecordsScreen = `Entry Exit Records Screen`;

    static entryExitRecordsDrawerItem = `Entry Exit Records Drawer Item`;

    static myQrCodeDrawerItem = `My Qr Code Drawer Item`;

    static updateNowButton = `Update Now Button`;

    static forceUpdateScreen = `Force Update Screen`;

    static option(index: number) {
        return `Option ${index}`;
    }

    static answerCorrectKey = `Answer Correct`;

    static retryButton = `Retry Button`;

    static nextQuizButton = `Next Quiz Button`;

    static closeButton = `Close Button`;

    static closeSnackBarButton = `Close Snack Bar Button`;

    static switchAccountButton = `switch Account Button`;

    static switchStudentsButton = `Switch Students Button`;

    static switchAccountScreen = `Switch Account Screen`;

    static manageAccountScreen = `Manage Account Screen`;

    static profileDetailsScreen = `Profile Details Screen`;

    static editAccountScreen = `Edit Account Screen`;

    static editProfileButton = `Edit profile button`;

    static nameTextInput = `Name text input`;

    static editAccountDrawerItem = `Edit Account drawer item`;

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
    ): string => `Join live lesson - ${lessonId ?? ``} ${lessonName ?? ``} button ${canJoin}`;

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

    static sliderAudio = `Slider Audio`;

    static currentTimeAudio = `Current Time Audio`;

    static durationTimeAudio = `Duration Time Audio`;

    static attachment = (attachmentName: string): string => `${attachmentName} Attachment`;

    static notificationIcon = `Notification Icon`;

    static notificationsScreen = `Notifications Screen`;

    static listNotificationKey = `List Notification Key`;

    /// Manual Input question keys

    static studyGuideKey = `Study Guide PDF key`;

    static flashCardItem = (index: number, isActiveTerm: boolean): string =>
        `Flash card item ${index} ${isActiveTerm}`;

    static flashCardItemWithContent = (index: number, isTerm: boolean, content: string): string =>
        `Flash card item content ${index} ${isTerm ? `Term` : `Definition`} ${content}`;

    static appBarProfile = `App Bar profile`;

    static answerCorrect = (index: number): string => `Answer Correct ${index}`;

    static answerIncorrect = (index: number): string => `Answer Wrong${index}`;

    static switchChildrenButton = `Switch Child Button`;

    static currentChildText = `Current Child Text`;

    static uploadAvatarButton = `Upload Avatar Button`;

    static uploadingAvatar = `Uploading Avatar`;

    static uploadAvatarSuccess = `Upload Avatar Success`;

    static avatar = `Avatar`;

    static defaultAvatar = `default Avatar`;

    static avatarWidget = (url: string): string => `Avatar Widget ${url}`;

    static avatarLocalFileWidget = `Avatar Local File Widget`;

    static avatarWidgetInHomeDrawer = (url: string): string =>
        `Avatar Widget In Home Drawer ${url}`;

    static kidAvatarWidget = (url: string): string => `Kid Avatar Widget ${url}`;

    static uploadedAvatar = `Uploaded Avatar`;

    static loAndAssignmentList = `LO and assignment list`;

    static errorSnackBar = `Error Snack Bar`;

    static drawer = `Drawer`;

    static termsTab = `Terms Tab`;

    static privacyPolicyTab = `Privacy Policy Tab`;

    static messageLessonButton = `Message Lesson Button`;

    static endLessonButton = `End Lesson Button`;

    static endLessonDialog = `End Lesson Dialog`;

    static requestMicroDialog = `Request Micro Dialog`;

    static requestVideoDialog = `Request Video Dialog`;

    static enableWhiteboardAnnotationDialog = (enable: boolean): string =>
        `Enable Whiteboard Annotation Dialog ${enable}`;

    static whiteboardAnnotationDialogButton = (enable: boolean): string =>
        `Whiteboard Annotation Dialog Button ${enable}`;

    static acceptRequestButton = `Accept Request Button`;

    static declineRequestButton = `Decline Request Button`;

    static endNowButton = `End Now Button`;

    static lessonItem = (id: string, name: string): string => `Lesson Item ${id} ${name}`;

    static listCameraView = `Live Lesson List Camera View`;

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

    static closeAnnotationButton = `Live Lesson White Board Close Annotation Button`;

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

    static noColorCrown = `No Color Crown`;

    static bronzeCrown = `Bronze Crown`;

    static goldCrown = `Gold Crown`;

    static silverCrown = `Silver Crown`;

    static liveLessonVideoView = ([videoId = ``]): string => `Live Lesson Video View ${videoId}`;

    static disconnectingScreenLiveLesson = `Disconnecting Screen Live Lesson`;

    static liveLessonCameraViewStatus = `Live Lesson Camera View`;

    static liveLessonSpeakerStatus = `Live Lesson Speaker Status`;

    static liveLessonNoneCameraView = `Live Lesson None Camera View`;

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

    static flashcardRestartLearningButton = `Flashcard Restart Learning Button`;

    static flashCardTotalSkippedCards = (count: number): string =>
        `Flash card total skipped cards ${count}`;

    static flashCardTotalRememberedCards = (count: number): string =>
        `Flash card total remembered cards ${count}`;

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

    static confirmConversationNoLongerAvailableButton = `Confirm Conversation No Longer Available Button`;
}
