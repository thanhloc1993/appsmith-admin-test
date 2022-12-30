@cms
@lesson
@lesson-report-submit
@ignore

Feature: School admin can submit individual lesson report of past lesson
    Background:
        Given "school admin" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened creating "individual" lesson report page

    Scenario: School admin can submit lesson report of past lesson
        Given "school admin" has fulfilled lesson report info
        When "school admin" submits individual lesson report
        Then "school admin" is redirected to detailed lesson report page
        And "school admin" sees fulfilled lesson report info
        And "school admin" sees "Submitted" tag of lesson report

    Scenario: School admin cannot submit lesson report of past lesson with missing field
        When "school admin" submits lesson report with missing Attendance Status field
        Then "school admin" sees alert message below Attendance Status field
        And "school admin" sees alert icon in student list
        And "school admin" is still in creating individual lesson report page

    Scenario: School admin can cancel submitting lesson report of past lesson
        Given "school admin" has fulfilled lesson report info
        When "school admin" cancels submitting lesson report
        Then "school admin" is still in creating individual lesson report page
