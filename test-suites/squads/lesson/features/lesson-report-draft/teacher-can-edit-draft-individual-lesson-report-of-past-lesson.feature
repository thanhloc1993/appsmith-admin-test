@cms @cms2
@lesson
@lesson-report-draft
@ignore

Feature: Teacher can edit draft individual lesson report of past lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "teacher" has gone to detailed lesson info page
        And "teacher" has saved draft individual lesson report with missing all fields
        And "teacher" has opened editing individual lesson report

    Scenario: Teacher can edit draft lesson report of past lesson
        Given "teacher" has changed fields info
        When "teacher" saves draft for editing lesson report
        Then "teacher" is redirected to detailed lesson report page
        And "teacher" sees updated lesson report
        And "teacher" sees "Draft" tag of lesson report

    Scenario: Teacher can edit draft lesson report to submitted lesson report
        Given "teacher" has fulfilled lesson report info
        When "teacher" submits individual lesson report
        Then "teacher" is redirected to detailed lesson report page
        And "teacher" sees updated lesson report
        And "teacher" sees "Submitted" tag of lesson report

    Scenario: Teacher cannot edit draft lesson report to submitted lesson report with missing "Attendance Status" field
        When "teacher" clicks submit all individual lesson report
        Then "teacher" sees alert message below Attendance Status field
        And "teacher" sees alert icon in student list
        And "teacher" is still in editing individual lesson report page

    Scenario: Teacher can cancel editing draft lesson report to submitted lesson report
        Given "teacher" has changed fields info
        When "teacher" cancels submitting lesson report
        Then "teacher" is still in editing individual lesson report page
