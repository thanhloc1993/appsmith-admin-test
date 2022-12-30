@cms @cms2 @learner
@lesson
@lesson-report-submit

Feature: Teacher can edit submitted individual lesson report of future one time lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "student" with course and enrolled status has logged Learner App
        And "teacher" has created a one time individual lesson in the "future"
        And "teacher" has applied location in location settings is the same as location in the lesson
        And "teacher" has gone to detailed the newly "future" lesson info page
        And "teacher" has opened creating "individual" lesson report page
        And "teacher" has fulfilled individual lesson report info
        And "teacher" has submitted individual lesson report of the lesson

    Scenario: Teacher can edit submitted lesson report of future one time lesson
        Given "teacher" has opened editing "individual" lesson report page
        And "teacher" has changed individual lesson report fields info
        When "teacher" submits individual lesson report of the lesson
        Then "teacher" is redirected to detailed lesson report page
        And "teacher" sees updated individual lesson report
        And "teacher" sees "Submitted" tag of lesson report

    Scenario Outline: Teacher cannot edit submitted lesson report of future one time lesson
        Given "teacher" has opened editing "individual" lesson report page
        And "teacher" has cleared "<required-field>" value in individual lesson report
        When "teacher" submits individual lesson report with missing "<required-field>" field
        Then "teacher" sees alert message below "<required-field>" field of completed individual lesson
        And "teacher" sees alert icon in student list
        And "teacher" is still in editing individual lesson report page
        Examples:
            | required-field    |
            | Attendance Status |
            | Content           |
            | Understanding     |
            | Homework          |

    Scenario: Teacher cannot edit submitted lesson report to draft lesson report with missing all fields
        Given "teacher" has opened editing "individual" lesson report page
        And "teacher" has cleared all fields of individual lesson report
        When "teacher" saves draft individual lesson report
        Then "teacher" sees alert message below "Attendance Status" field of completed individual lesson

    Scenario: Teacher can cancel editing submitted lesson report
        Given "teacher" has opened editing "individual" lesson report page
        And "teacher" has changed individual lesson report fields info
        When "teacher" cancels submitting individual lesson report
        Then "teacher" is still in editing individual lesson report page