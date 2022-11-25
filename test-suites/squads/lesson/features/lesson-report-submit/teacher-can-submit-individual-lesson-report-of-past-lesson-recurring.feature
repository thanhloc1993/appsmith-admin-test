@cms @cms2 @learner
@lesson
@lesson-report-submit

Feature: Teacher can submit individual lesson report of a past lesson in the recurring chain
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "student" with course and enrolled status has logged Learner App
        And "teacher" has created a weekly recurring "individual" lesson with lesson date in the "past"
        And "teacher" has applied location in location settings is the same as location in the lesson
        And "teacher" has gone to detailed the newly "past" lesson info page
        And "teacher" has opened creating "individual" lesson report page

    Scenario: Teacher can submit lesson report of past lesson
        Given "teacher" has fulfilled individual lesson report info
        When "teacher" submits individual lesson report of the lesson
        Then "teacher" is redirected to detailed lesson report page
        And "teacher" sees fulfilled individual lesson report info
        And "teacher" sees "Submitted" tag of lesson report

    Scenario Outline: Teacher cannot submit lesson report of past lesson with missing field
        When "teacher" submits individual lesson report with missing "<required-field>" field
        Then "teacher" sees alert message below "<required-field>" field
        And "teacher" sees alert icon in student list
        And "teacher" is still in creating individual lesson report page
        Examples:
            | required-field    |
            | Attendance Status |
            | Content           |
            | Understanding     |
            | Homework          |

    Scenario: Teacher can cancel submitting lesson report of past lesson
        Given "teacher" has fulfilled individual lesson report info
        When "teacher" cancels submitting individual lesson report
        Then "teacher" is still in creating individual lesson report page
