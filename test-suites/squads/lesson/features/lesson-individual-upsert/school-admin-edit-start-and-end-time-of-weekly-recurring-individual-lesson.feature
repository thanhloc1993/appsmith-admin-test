@cms
@lesson
@lesson-individual-upsert

Feature: School Admin edits start&end time of weekly recurring individual lesson
    Background:
        Given "school admin" logins CMS
        And "school admin" has applied "org" location

    Scenario Outline: School admin can edit start & end time of a <status> lesson with "This and the following lessons" option
        Given "school admin" has created a "<status>" "Weekly Recurring" "individual" lesson in the "future"
        And "school admin" has gone to detailed lesson info page of the 2nd lesson in the chain
        And "school admin" has gone to detailed "future" lesson info page of the 2nd lesson in the recurring chain
        And "school admin" has opened editing lesson page
        When "school admin" edits start & end time
        And "school admin" saves the changes with "<status>" "This and the following lessons" option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated start & end time for this lesson
        And "school admin" sees "<status>" "future" lessons in chain from edited lesson has start&end time are updated
        And "school admin" sees "<status>" "future" lessons in chain from edited lesson has repeat duration are remained
        And "school admin" sees "<status>" lessons in chain before edited lesson has end date is lesson date of previous lesson
        And "school admin" sees "<status>" "future" lessons in chain before edited remaining start & end time and weekly on
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: School admin can edit start & end time of a <status> lesson with "Only this Lesson" option
        Given "school admin" has created a "<status>" "Weekly Recurring" "individual" lesson in the "past"
        And "school admin" has opened editing lesson page of the "past" lesson in the middle of the recurring chain
        When "school admin" edits start & end time
        And "school admin" saves the changes with "<status>" "Only this Lesson" option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated start & end time and remained repeat duration in this "<status>" "past" lesson
        And "school admin" sees other "<status>" "past" lessons in chain no change end date
        Examples:
            | status    |
            | Draft     |
            | Published |
