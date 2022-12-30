@cms
@lesson
@lesson-report-submit
@ignore

Feature: School Admin can edit submitted lesson report of past lesson
    Background:
        Given "school admin" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "school admin" has gone to detailed lesson info page
        And "school admin" has created an individual lesson report
        And "school admin" has opened editing individual lesson report

    Scenario: School Admin can edit submitted lesson report of past lesson
        Given "school admin" has changed fields info
        When "school admin" submits for editing lesson report
        Then "school admin" is redirected to detailed lesson report page
        And "school admin" sees updated lesson report
        And "school admin" sees "Submitted" tag of lesson report

    Scenario: School Admin cannot edit submitted lesson report of past lesson
        Given "school admin" has cleared Attendance status value
        When "school admin" clicks submit all individual lesson report
        Then "school admin" sees alert message below Attendance Status field
        And "school admin" sees alert icon in student list
        And "school admin" is still in editing individual lesson report page

    Scenario: School Admin can edit submitted lesson report to draft lesson report with missing Attendance status field
        Given "school admin" has cleared Attendance status value
        When "school admin" saves draft for editing lesson report
        Then "school admin" is redirected to detailed lesson report page
        And "school admin" sees updated lesson report
        And "school admin" sees "Draft" tag of lesson report

    Scenario: School Admin can cancel editing submitted lesson report
        Given "school admin" has changed fields info
        When "school admin" cancels submitting lesson report
        Then "school admin" is still in editing individual lesson report page
