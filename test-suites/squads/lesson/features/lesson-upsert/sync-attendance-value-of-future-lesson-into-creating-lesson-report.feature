@cms @cms2 @learner
@lesson
@lesson-upsert
@ignore

Feature: Sync Attendance value of future lesson into creating lesson report
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "student" with course and enrolled status has logged Learner App
        And "school admin" has gone to lesson management page
        And "school admin" has opened creating lesson page

    Scenario Outline: Sync Attendance value of future lesson into creating lesson report
        Given "school admin" has filled date & time is within 10 minutes from now
        And "school admin" has filled all remain fields
        And "school admin" has set "<option>" Attendance value of student
        And "school admin" has created the lesson of lesson management
        And "teacher" has gone to detailed lesson info page
        When "teacher" opens creating individual lesson report page
        Then "teacher" sees "<option>" Attendance value of student
        Examples:
            | option            |
            | Attend            |
            | Absent            |
            | Absent (informed) |
            | Late              |
            | Late (informed)   |
            | Leave Early       |
