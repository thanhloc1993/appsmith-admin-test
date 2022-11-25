@cms @cms2
@lesson
@lesson-report-submit
@ignore

Feature: Teacher can edit submitted lesson report of past lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "teacher" has gone to detailed lesson info page
        And "teacher" has created an individual lesson report
        And "teacher" has opened editing individual lesson report

    Scenario: Teacher can edit submitted lesson report of past lesson
        Given "teacher" has changed fields info
        When "teacher" submits for editing lesson report
        Then "teacher" is redirected to detailed lesson report page
        And "teacher" sees updated lesson report
        And "teacher" sees "Submitted" tag of lesson report

    Scenario: Teacher cannot edit submitted lesson report of past lesson
        Given "teacher" has cleared Attendance status value
        When "teacher" clicks submit all individual lesson report
        Then "teacher" sees alert message below Attendance Status field
        And "teacher" sees alert icon in student list
        And "teacher" is still in editing individual lesson report page

    Scenario: Teacher can edit submitted lesson report to draft lesson report with missing Attendance status field
        Given "teacher" has cleared Attendance status value
        When "teacher" saves draft for editing lesson report
        Then "teacher" is redirected to detailed lesson report page
        And "teacher" sees updated lesson report
        And "teacher" sees "Draft" tag of lesson report

    Scenario: Teacher can cancel editing submitted lesson report
        Given "teacher" has changed fields info
        When "teacher" cancels submitting lesson report
        Then "teacher" is still in editing individual lesson report page
