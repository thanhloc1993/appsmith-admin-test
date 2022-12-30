@cms @cms2
@lesson
@lesson-report-submit
@ignore

Feature: Teacher can cancel using Bulk action to fill "Attendance Status" of student of past lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "teacher" has gone to detailed lesson info page
        And "teacher" has opened creating "individual" lesson report page

    Scenario Outline: Teacher can cancel using Bulk action setting of student
        Given "teacher" has opened bulk action
        And "teacher" has filled in bulk action with "<option>"
        When "teacher" cancels bulk action
        Then "teacher" sees Attendance Status of students is blank
        Examples:
            | option            |
            | Attend            |
            | Absent            |
            | Absent (informed) |
            | Late              |
            | Late (informed)   |
            | Leave Early       |
