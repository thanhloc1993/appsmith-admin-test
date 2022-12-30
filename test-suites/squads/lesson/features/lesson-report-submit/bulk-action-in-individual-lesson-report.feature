@cms @cms2
@lesson
@lesson-report-submit
@ignore

Feature: Teacher can use Bulk action to fill "Attendance Status" of student of future lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher" has gone to detailed lesson info page
        And "teacher" has opened creating "individual" lesson report page

    Scenario: Teacher can see default Bulk action setting of student
        When "teacher" opens bulk action
        Then "teacher" sees default value is "Attend"

    Scenario Outline: Teacher can use Bulk action to fill <option> "Attendance Status" of student
        When "teacher" applies bulk action with "<option>"
        Then "teacher" sees Attendance Status of students is "<option>"
        Examples:
            | option      |
            | Attend      |
            | Absent      |
            | Late        |
            | Leave Early |
    #missing 2 cases

    Scenario Outline: Teacher can use Bulk action to update <option1> to <option2> "Attendance Status" of student
        Given "teacher" has applied bulk action with "<option1>"
        When "teacher" applies bulk action with "<option2>"
        Then "teacher" sees Attendance Status of student is updated to "<option2>"
        Examples:
            | option1     | option2                            |
            | Attend      | 1 of [Absent, Late, Leave Early]   |
            | Absent      | 1 of [Attend, Late, Leave Early]   |
            | Late        | 1 of [Attend, Absent, Leave Early] |
            | Leave Early | 1 of [Attend, Absent, Late]        |
#missing 2 cases