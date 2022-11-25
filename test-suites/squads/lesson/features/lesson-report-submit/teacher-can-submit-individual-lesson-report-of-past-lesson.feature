@cms @cms2
@lesson
@lesson-report-submit
@ignore

Feature: Teacher can submit individual lesson report of past lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "teacher" has gone to detailed lesson info page
        And "teacher" has opened creating "individual" lesson report page

    Scenario: Scenario: Teacher can submit lesson report of past lesson
        Given "teacher" has fulfilled lesson report info
        When "teacher" submits individual lesson report
        Then "teacher" is redirected to detailed lesson report page
        And "teacher" sees fulfilled lesson report info
        And "teacher" sees "Submitted" tag of lesson report

    Scenario: Teacher cannot submit lesson report of past lesson with missing field
        When "teacher" submits lesson report with missing Attendance Status field
        Then "teacher" sees alert message below Attendance Status field
        And "teacher" sees alert icon in student list
        And "teacher" is still in creating individual lesson report page

    Scenario: Teacher can cancel submitting lesson report of past lesson
        Given "teacher" has fulfilled lesson report info
        When "teacher" cancels submitting lesson report
        Then "teacher" is still in creating individual lesson report page
