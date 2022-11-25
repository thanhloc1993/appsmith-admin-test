@cms @cms2
@lesson
@lesson-report-previous-report
@ignore

Feature: Teacher cannot view the previous lesson report of past lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "teacher" has gone to detailed lesson info page

    Scenario: Teacher cannot view the previous lesson report of student in creating lesson report page
        When "teacher" opens creating individual lesson report page
        Then "teacher" sees the previous lesson report button is "disabled" on creating lesson report page
        And "teacher" sees an message that student does not have the previous lesson report on creating lesson report page

    Scenario: Teacher cannot view the previous lesson report of student in detailed submitted lesson report info page
        When "teacher" creates an individual lesson report
        Then "teacher" sees the previous lesson report button is "disabled" on detail lesson report page
        And "teacher" sees an message that student does not have the previous lesson report on detail lesson report page

    Scenario: Teacher cannot view the previous lesson report of student in editing submitted lesson report page
        Given "teacher" has created an individual lesson report
        When "teacher" opens editing individual lesson report
        Then "teacher" sees the previous lesson report button is "disabled" on editing lesson report page
        And "teacher" sees an message that student does not have the previous lesson report on editing lesson report page

    Scenario: Teacher cannot view the previous lesson report of student in detailed draft lesson report info page
        When "teacher" opens creating individual lesson report page
        And "teacher" saves draft individual lesson report
        Then "teacher" sees the previous lesson report button is "disabled" on detail lesson report page
        And "teacher" sees an message that student does not have the previous lesson report on detail lesson report page

    Scenario: Teacher cannot view the previous lesson report of student in editing draft lesson report page
        Given "teacher" has saved draft individual lesson report
        When "teacher" opens editing individual lesson report
        Then "teacher" sees the previous lesson report button is "disabled" on editing lesson report page
        And "teacher" sees an message that student does not have the previous lesson report on editing lesson report page
