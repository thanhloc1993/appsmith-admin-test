export enum Menu {
    STUDENTS = 'Students',
    STAFF = 'Staff Management',
    COURSES = 'Course',
    BOOKS = 'Book',
    SCHEDULE = 'Schedule',
    NOTIFICATION = 'Notification',
    LESSON_MANAGEMENT = 'Lesson Management',
    USER_GROUP = 'User Group',
    MASTER_MANAGEMENT = 'Master Management',
    TIMESHEET_MANAGEMENT = 'Timesheet Management',
    ASSIGNED_STUDENT_LIST = 'Assigned Student List',
    TIMESHEET_CONFIRMATION = 'Timesheet Confirmation',
    ORDER_MANAGEMENT = 'Order Management',
    QR_CODE_SCANNER = 'QR Code Scanner',
    INVOICE_MANAGEMENT = 'Invoice Management',
    PAYMENT_REQUEST = 'Payment Request',
}

export type MenuUnion = `${Menu}` | 'Live Lessons';

export enum PollingStatus {
    POLLING_STARTED = 'PollingStatus.POLLING_STARTED',
    POLLING_STOPPED = 'PollingStatus.POLLING_STOPPED',
    POLLING_ENDED = 'PollingStatus.POLLING_ENDED',
}

export enum EndpointKeyCloakAndJPREP {
    URL_AUTH = 'https://d2020-ji-sso.jprep.jp/auth/',
    URL_TOKEN = 'https://d2020-ji-sso.jprep.jp/auth/realms/master/protocol/openid-connect/token',
    URL_USER = 'https://d2020-ji-sso.jprep.jp/auth/admin/realms/manabie-test/users/',
    URL_BASH_JPREP = 'https://web-api.staging-green.manabie.io:31400/jprep/',
}

export enum PathnameSyncJPREP {
    USER_REGISTRATION = 'user-registration',
    MASTER_REGISTRATION = 'master-registration',
    USER_COURSE = 'user-course',
}

export enum MasterCategory {
    AccountingCategory = 'accountingCategory',
    Discount = 'discount',
    BillingSchedule = 'billingSchedule',
    BillingSchedulePeriod = 'billingSchedulePeriod',
    Tax = 'tax',
    Package = 'package',
    Material = 'material',
    Fee = 'fee',
    ProductGrade = 'productGrade',
    ProductCourse = 'productCourse',
    ProductAccountingCategory = 'productAccountingCategory',
    ProductLocation = 'productLocation',
    ProductPrice = 'productPrice',
    BillingRatio = 'billingRatio',
    BillingRatioType = 'billingRatioType',
    LeavingReason = 'leavingReason',
    Location = 'location',
    LocationType = 'locationType',
    Grade = 'grade',
    Class = 'class',
}

export enum LocationItemCheckBoxStatus {
    checked = 'CheckBoxStatus.checked',
    hasChild = 'CheckBoxStatus.hasChild',
    unCheck = 'CheckBoxStatus.unCheck',
    disabled = 'CheckBoxStatus.disabled',
}

export enum QuestionnaireMode {
    viewMode = 'viewMode',
    editMode = 'editMode',
}

export enum NotificationFilterEnum {
    all = 'all',
    importantOnly = 'importantOnly',
}
