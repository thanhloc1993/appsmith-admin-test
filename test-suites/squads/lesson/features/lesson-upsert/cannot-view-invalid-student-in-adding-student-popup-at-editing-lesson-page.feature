@cms
@lesson
@lesson-upsert

Feature: School admin cannot view invalid student in adding student popup at editing lesson page
    Background:
        Given "school admin" logins CMS

    Scenario Outline: School Admin cannot see <status> student who has no course in adding student popup at editing lesson page
        Given school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        #TODO: create another valid student S1 and then create lesson for this valid student S1 and edit that and search for invalid student S2
        And school admin has created a student "student" with "<status>" status, "0 visible courses"
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page
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

    Scenario Outline: School Admin cannot see <status> student who has course in adding student popup at editing lesson page
        Given school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And school admin has created a student "student" with "<status>" status, "1 visible courses"
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" opens adding student popup
        And "school admin" searches for the student name in student popup
        Then "school admin" does not see any result
        Examples:
            | status    |
            | Withdrawn |
            | Graduated |
            | LOA       |