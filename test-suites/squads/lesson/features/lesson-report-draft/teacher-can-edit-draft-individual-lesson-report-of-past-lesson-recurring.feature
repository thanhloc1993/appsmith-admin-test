@cms @cms2 @learner
@lesson
@lesson-report-draft

Feature: Teacher can edit draft individual lesson report of a past lesson in the recurring chain
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "student" with course and enrolled status has logged Learner App
        And "teacher" has created a weekly recurring "individual" lesson with lesson date in the "past"
        And "teacher" has applied location in location settings is the same as location in the lesson
        And "teacher" has gone to detailed the newly "past" lesson info page
        And "teacher" has opened creating "individual" lesson report page
        And "teacher" has saved draft the individual lesson report

    Scenario: Teacher can edit draft lesson report of past recurring lesson
        Given "teacher" has opened editing "individual" lesson report page
        And "teacher" has fulfilled individual lesson report info
        When "teacher" saves draft individual lesson report
        Then "teacher" is redirected to detailed lesson report page
        And "teacher" sees fulfilled individual lesson report info
        And "teacher" sees "Draft" tag of lesson report

    Scenario: Teacher can edit draft lesson report to submitted lesson report
        Given "teacher" has opened editing "individual" lesson report page
        And "teacher" has fulfilled individual lesson report info
        When "teacher" submits individual lesson report of the lesson
        Then "teacher" is redirected to detailed lesson report page
        And "teacher" sees fulfilled individual lesson report info
        And "teacher" sees "Submitted" tag of lesson report

    Scenario Outline: Teacher cannot edit draft lesson report to submitted lesson report with missing required field
        Given "teacher" has opened editing "individual" lesson report page
        When "teacher" submits individual lesson report with missing "<required-field>" field
        Then "teacher" sees alert message below "<required-field>" field of individual lesson
        And "teacher" sees alert icon in student list
        And "teacher" is still in editing individual lesson report page
        Examples:
            | required-field    |
            | Attendance Status |
            | Content           |
            | Understanding     |
            | Homework          |

    Scenario: Teacher can cancel editing submitted lesson report
        Given "teacher" has opened editing "individual" lesson report page
        And "teacher" has fulfilled individual lesson report info
        When "teacher" cancels submitting individual lesson report
        Then "teacher" is still in editing individual lesson report page
