@cms
@lesson
@lesson-report-draft
@ignore

Feature: School Admin can edit draft lesson report of past lesson
    Background:
        Given "school admin" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "school admin" has gone to detailed lesson info page
        And "school admin" has saved draft individual lesson report with missing all fields
        And "school admin" has opened editing individual lesson report

    Scenario: School Admin can edit draft lesson report of past lesson
        Given "school admin" has changed fields info
        When "school admin" saves draft for editing lesson report
        Then "school admin" is redirected to detailed lesson report page
        And "school admin" sees updated lesson report
        And "school admin" sees "Draft" tag of lesson report

    Scenario: School Admin can edit draft lesson report to submitted lesson report
        Given "school admin" has fulfilled lesson report info
        When "school admin" submits individual lesson report
        Then "school admin" is redirected to detailed lesson report page
        And "school admin" sees updated lesson report
        And "school admin" sees "Submitted" tag of lesson report

    Scenario: School Admin cannot edit draft lesson report to submitted lesson report with missing "Attendance Status" field
        When "school admin" clicks submit all individual lesson report
        Then "school admin" sees alert message below Attendance Status field
        And "school admin" sees alert icon in student list
        And "school admin" is still in editing individual lesson report page

    Scenario: School Admin can cancel editing draft lesson report to submitted lesson report
        Given "school admin" has changed fields info
        When "school admin" cancels submitting lesson report
        Then "school admin" is still in editing individual lesson report page
