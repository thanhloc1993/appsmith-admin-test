@cms @cms2
@lesson
@lesson-report-submit
@ignore

Feature: Teacher can change bulk action in individual lesson report of future lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher" has gone to detailed lesson info page
        And "teacher" has opened creating "individual" lesson report page

    Scenario Outline: Teacher can use Bulk action to update <option1> to <option2> "Attendance Status" of student
        Given "teacher" has applied bulk action with "<option1>"
        When "teacher" applies bulk action with "<option2>"
        Then "teacher" sees Attendance Status of student is updated to "<option2>"
        Examples:
            | option1           | option2                                                                 |
            | Attend            | 1 of [Absent, Absent (informed), Late, Late (informed), Leave Early]    |
            | Absent            | 1 of [Attend, Absent (informed), Late, Late (informed), Leave Early]    |
            | Absent (informed) | 1 of [Attend, Absent, Late, Late (informed), Leave Early]               |
            | Late              | 1 of [Attend, Absent, Absent (informed), Late (informed) , Leave Early] |
            | Late (informed)   | 1 of [Attend, Absent, Absent (informed), Late, Leave Early]             |
            | Leave Early       | 1 of [Attend, Absent, Absent (informed), Late, Late (informed) ]        |
