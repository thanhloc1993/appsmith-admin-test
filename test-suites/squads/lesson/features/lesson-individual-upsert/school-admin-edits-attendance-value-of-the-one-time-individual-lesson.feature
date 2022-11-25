@cms
@lesson
@lesson-individual-upsert

Feature: School Admin can edit Attendance value of the one time individual lesson
    Background:
        Given "school admin" logins CMS

    Scenario Outline: School Admin can edit Attendance value of the <status> one time individual lesson
        Given "school admin" has created a "<status>" one time "individual" lesson in the "future"
        And "school admin" has opened editing future one time individual lesson page
        And "school admin" has applied "<option1>" Attendance status value
        When "school admin" edits Attendance value to "<option2>"
        Then "school admin" sees "<option2>" Attendance value in detailed lesson page
        Examples:
            | status    | option1     | option2                            |
            | Draft     | Attend      | 1 of [Absent, Late, Leave Early]   |
            | Draft     | Absent      | 1 of [Attend, Late, Leave Early]   |
            | Published | Late        | 1 of [Attend, Absent, Leave Early] |
            | Published | Leave Early | 1 of [Attend, Absent, Late]        |
