@cms
@lesson
@lesson-upsert
@ignore

Feature: School admin can edit Attendance value in creating lesson page
    Background:
        Given "school admin" logins CMS
        And "school admin" has gone to lesson management page
        And "school admin" has opened creating lesson page

    Scenario: School admin can see default Attendance value of student
        When "school admin" adds student in lesson
        Then "school admin" sees default Attendance value is blank

    Scenario Outline: School admin can edit Attendance value in creating lesson page
        Given "school admin" has added student in lesson
        When "school admin" updates Attendance value of student with "<option>"
        Then "school admin" sees Attendance value of students is "<option>" in creating lesson page
        Examples:
            | option            |
            | Attend            |
            | Absent            |
            | Absent (informed) |
            | Late              |
            | Late (informed)   |
            | Leave Early       |
