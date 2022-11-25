@cms @cms2
@lesson
@lesson-report-submit
@ignore

Feature: Teacher can use Bulk action to fill "Attendance Status" of student in individual lesson report of future lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher" has gone to detailed lesson info page

    Scenario: Teacher can see default Attendance status of student is blank
        When "teacher" opens creating individual lesson report page
        Then "teacher" sees Attendance Status of students is blank

    Scenario: Teacher can see default Bulk action setting of student
        Given "teacher" has opened creating "individual" lesson report page
        When "teacher" opens bulk action
        Then "teacher" sees default value is "Attend"

    Scenario Outline: Teacher can use Bulk action to fill <option> "Attendance Status" of student
        Given "teacher" has opened creating "individual" lesson report page
        When "teacher" applies bulk action with "<option>"
        Then "teacher" sees Attendance Status of students is "<option>"
        Examples:
            | option            |
            | Attend            |
            | Absent            |
            | Absent (informed) |
            | Late              |
            | Late (informed)   |
            | Leave Early       |
