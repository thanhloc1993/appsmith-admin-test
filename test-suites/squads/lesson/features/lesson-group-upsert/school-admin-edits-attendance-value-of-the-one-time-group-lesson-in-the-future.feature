@cms
@lesson
@lesson-group-upsert
@ignore

Feature: School Admin can edit Attendance of Student the one time group lesson in the future by bulk
    Background:
        Given "school admin" logins CMS

    Scenario Outline: School Admin can edit Attendance value of the <status> one time group lesson in the future
        Given "school admin" has created a "<status>" group lesson in the "future" with "Online" teaching medium
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed the newly "future" lesson info page
        And "school admin" has opened editing lesson page
        And "school admin" has applied bulk action with "<option1>" for Attendance status of student
        When "school admin" edits to "<option2>" Attendance status
        Then "school admin" sees "<option2>" Attendance status in detailed group lesson page

        Examples:
            | status    | option1     | option2                            |
            | Draft     | Attend      | 1 of [Absent, Late, Leave Early]   |
            | Draft     | Absent      | 1 of [Attend, Late, Leave Early]   |
            | Published | Late        | 1 of [Attend, Absent, Leave Early] |
            | Published | Leave Early | 1 of [Attend, Absent, Late]        |