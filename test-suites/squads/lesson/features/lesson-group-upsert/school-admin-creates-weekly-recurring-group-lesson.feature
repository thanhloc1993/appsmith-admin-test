@cms @teacher @learner
@lesson
@lesson-group-upsert
@ignore

Feature: School Admin can create weekly recurring group lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and class and enrolled status has logged Learner App
        And "school admin" has gone to lesson management page
        And "school admin" has applied "all child locations of parent" location
        And "school admin" has opened creating lesson page

    Scenario Outline: School admin can create a <status> future group lesson with online teaching method
        Given "school admin" has filled date & time is within 10 minutes from now
        And "school admin" has selected "Group" teaching method
        And "school admin" has filled online teaching medium
        And "school admin" has selected weekly recurring
        And "school admin" has filled end date is lesson date of next month
        And "school admin" has filled remain fields and missing "none" field
        And "teacher" have applied center location in location settings on Teacher App
        When "school admin" clicks "<status>" the lesson of lesson management
        Then "school admin" is redirected to "future" lessons list page
        And "school admin" sees created "<status>" recurring lesson within the repeat duration on "future" lessons list on CMS
        And "teacher" "<action>" created "future" recurring lesson within the repeat duration on Teacher App
        And "student" "<action>" created "future" recurring lesson within the repeat duration on Learner App
        Examples:
            | status    | action      |
            | Draft     | can not see |
            | Published | can see     |

    Scenario Outline: School admin can create a <status> past group lesson with online teaching method
        Given "school admin" has filled start & end time have been completed in the last 24 hours
        And "school admin" has selected "Group" teaching method
        And "school admin" has filled online teaching medium
        And "school admin" has selected weekly recurring
        And "school admin" has filled end date is lesson date of next month
        And "school admin" has filled remain fields and missing "none" field
        And "teacher" have applied center location in location settings on Teacher App
        When "school admin" clicks "<status>" the lesson of lesson management
        Then "school admin" is redirected to "past" lessons list page
        And "school admin" sees created "<status>" recurring lesson within the repeat duration on the "past" lessons list on CMS
        And "school admin" sees created "<status>" recurring lesson within the repeat duration on the "future" lessons list on CMS
        And "teacher" "<action>" created "<status>" "past" recurring lesson within the repeat duration on Teacher App
        And "teacher" "<action>" created "<status>" "future" recurring lesson within the repeat duration on Teacher App
        Examples:
            | status    | action      |
            | Draft     | can not see |
            | Published | can see     |

    Scenario Outline: School admin can create a <status> future group lesson with offline teaching method
        Given "school admin" has filled date & time is within 10 minutes from now
        And "school admin" has selected "Group" teaching method
        And "school admin" has selected weekly recurring
        And "school admin" has filled end date is lesson date of next month
        And "school admin" has filled remain fields and missing "none" field
        And "teacher" have applied center location in location settings on Teacher App
        And "school admin" has filled offline teaching medium
        When "school admin" clicks "<status>" the lesson of lesson management
        Then "school admin" is redirected to "future" lessons list page
        And "school admin" sees created "<status>" recurring lesson within the repeat duration on the "future" lessons list on CMS
        And "teacher" does not see created "<status>" "future" recurring lesson within the repeat duration on Teacher App
        And "student" does not see created "<status>" "future" recurring lesson within the repeat duration on Learner App
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: School admin can create a <status> past group lesson with offline teaching method
        Given "school admin" has filled start & end time have been completed in the last 24 hours
        And "school admin" has selected "Group" teaching method
        And "school admin" has selected weekly recurring
        And "school admin" has filled end date is lesson date of next month
        And "school admin" has filled remain fields and missing "none" field
        And "teacher" have applied center location in location settings on Teacher App
        And "school admin" has filled offline teaching medium
        When "school admin" clicks "<status>" the lesson of lesson management
        Then "school admin" is redirected to "past" lessons list page
        And "school admin" sees created "<status>" recurring lesson within the repeat duration on the "past" lessons list on CMS
        And "school admin" sees created "<status>" recurring lesson within the repeat duration on the "future" lessons list on CMS
        And "teacher" does not see created "<status>" "past" recurring lesson within the repeat duration on Teacher App
        And "teacher" does not see created "<status>" "future" recurring lesson within the repeat duration on Teacher App
        And "student" does not see created "<status>" "future" recurring lesson within the repeat duration on Learner App
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: School admin cannot create weekly recurring group lesson with "<condition>"
        Given "school admin" has filled date & time is within 10 minutes from now
        And "school admin" has selected "Group" teaching method
        And "school admin" has filled online teaching medium
        And "school admin" has selected weekly recurring
        And "school admin" has filled end date with "<condition>"
        And "school admin" has filled remain fields and missing "<field>" field
        When "school admin" clicks save button of lesson management
        Then "school admin" sees inline errors message under both Lesson Date and End Date
        And "school admin" is still in creating lesson page
        Examples:
            | condition              | field  |
            | end date < lesson date | course |
            | end date = lesson date | class  |

    Scenario: School admin cannot create weekly recurring group lesson with missing End date field
        Given "school admin" has selected "Group" teaching method
        When "school admin" creates weekly recurring group lesson with missing End date field
        And "school admin" clicks save button of lesson management
        Then "school admin" sees alert message under required "end date"
        And "school admin" is still in creating lesson page
