@cms
@cms2
@lesson
@lesson-upsert
@ignore

Feature: Teacher can edit Attendance value of future lesson which has no lesson report
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher" has gone to detailed lesson info page

    Scenario Outline: Teacher can edit Attendance value in editing lesson page of future lesson which has no lesson report
        Given "teacher" has opened editing lesson page
        And "teacher" has applied "<option1>" Attendance value
        When "teacher" edits to "<option2>" Attendance value
        Then "teacher" sees "<option2>" Attendance value in detailed lesson page
        Examples:
            | option1           | option2                                                                |
            | Attend            | 1 of [Absent, Absent (informed), Late, Late (informed), Leave Early]   |
            | Absent            | 1 of [Attend, Absent (informed), Late, Late (informed), Leave Early]   |
            | Absent (informed) | 1 of [Attend, Absent, Late, Late (informed), Leave Early]              |
            | Late              | 1 of [Attend, Absent, Absent (informed), Late (informed), Leave Early] |
            | Late (informed)   | 1 of [Attend, Absent, Absent (informed), Late, Leave Early]            |
            | Leave Early       | 1 of [Attend, Absent, Absent (informed), Late, Late (informed)]        |