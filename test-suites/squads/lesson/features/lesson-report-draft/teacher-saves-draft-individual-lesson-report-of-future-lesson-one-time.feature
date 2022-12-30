@cms @cms2 @learner
@lesson
@lesson-report-draft

Feature: Teacher can save draft individual lesson report of one time future lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "student" with course and enrolled status has logged Learner App
        And "teacher" has created a one time individual lesson in the future
        And "teacher" has applied location in location settings is the same as location in the lesson
        And "teacher" has gone to detailed lesson info page
        And "teacher" has opened creating "individual" lesson report page

    Scenario: Teacher can save draft lesson report of future lesson
        Given "teacher" has fulfilled individual lesson report info
        When "teacher" saves draft individual lesson report
        Then "teacher" is redirected to detailed lesson report page
        And "teacher" sees fulfilled individual lesson report info
        And "teacher" sees "Draft" tag of lesson report

    Scenario: Teacher can save draft lesson report of future lesson with missing field
        When "teacher" saves draft individual lesson report with missing all fields
        Then "teacher" is redirected to detailed lesson report page
        And "teacher" sees blank lesson report info
        And "teacher" sees "Draft" tag of lesson report
