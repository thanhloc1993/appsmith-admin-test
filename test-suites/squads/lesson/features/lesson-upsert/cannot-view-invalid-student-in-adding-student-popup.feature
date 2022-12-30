@cms
@lesson
@lesson-upsert

Feature: School admin cannot view invalid student in adding student popup
    Background:
        Given "school admin" logins CMS

    Scenario Outline: School Admin cannot see <status> student who has no course in adding student popup
        Given school admin has created a student "student" with "<status>" status, "0 visible courses"
        And "school admin" has gone to lesson management page
        And "school admin" has opened creating lesson page
        When "school admin" opens adding student popup
        And "school admin" searches for the student name in student popup
        Then "school admin" does not see any result
        Examples:
            | status    |
            | Potential |
            | Enrolled  |
            | Withdrawn |
            | Graduated |
            | LOA       |

    Scenario Outline: School Admin cannot see <status> student who has course in adding student popup
        Given school admin has created a student "student" with "<status>" status, "1 visible courses"
        And "school admin" has gone to lesson management page
        And "school admin" has opened creating lesson page
        When "school admin" opens adding student popup
        And "school admin" searches for the student name in student popup
        Then "school admin" does not see any result
        Examples:
            | status    |
            | Withdrawn |
            | Graduated |
            | LOA       |