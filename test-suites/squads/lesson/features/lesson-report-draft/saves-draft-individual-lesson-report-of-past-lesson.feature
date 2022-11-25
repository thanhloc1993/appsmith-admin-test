@cms
@lesson
@lesson-report-draft
@ignore

Feature: School admin can save draft individual lesson report of past lesson
    Background:
        Given "school admin" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened creating "individual" lesson report page

    Scenario: school admin can save draft lesson report of past lesson
        Given "school admin" has fulfilled lesson report info
        When "school admin" saves draft individual lesson report
        Then "school admin" is redirected to detailed lesson report page
        And "school admin" sees fulfilled lesson report info
        And "school admin" sees "Draft" tag of lesson report

    Scenario: school admin can save draft lesson report of past lesson with missing field
        When "school admin" saves draft individual lesson report with missing all fields
        Then "school admin" is redirected to detailed lesson report page
        And "school admin" sees blank lesson report info
        And "school admin" sees "Draft" tag of lesson report