@cms
@lesson
@lesson-group-upsert

Feature: School Admin edits location of weekly recurring group lesson
    Background:
        Given "school admin" logins CMS

    Scenario Outline: School Admin can edit location of a <status> future weekly recurring lesson
        Given "school admin" has created "<status>" "group" "future weekly recurring" lesson
        And "school admin" has applied "all child locations of parent" location
        And "school admin" has gone to detailed "future" lesson info page of the 2nd lesson in the recurring chain
        And "school admin" has opened editing lesson page
        When "school admin" edits location of Weekly Recurring lesson
        And "school admin" updates Course of Weekly Recurring Lesson
        And "school admin" updates student location of the group lesson
        And "school admin" clicks save the changes with "<status>" "This and the following lessons" saving option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated location in lesson detail
        And "school admin" sees other "future" "<status>" lessons in chain from edited lesson has location are updated
        And "school admin" sees other "<status>" lessons in chain from edited lesson has repeat duration are remained
        And "school admin" sees "<status>" lessons in chain before edited lesson has end date is lesson date of previous lesson
        And "school admin" sees other "<status>" lessons in chain before edited lesson remain location and weekly on
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: School Admin can edit location of a <status> past weekly recurring lesson
        Given "school admin" has created "<status>" "group" "past weekly recurring" lesson
        And "school admin" has applied "all child locations of parent" location
        And "school admin" has gone to detailed "past" lesson info page of the 2nd lesson in the recurring chain
        And "school admin" has opened editing lesson page
        When "school admin" edits location of Weekly Recurring lesson
        And "school admin" updates Course of Weekly Recurring Lesson
        And "school admin" updates student location of the group lesson
        And "school admin" clicks save the changes with "<status>" "Only this Lesson" saving option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated location in lesson detail
        And "school admin" sees this "<status>" lesson leaves chain and changes to one time lesson in the "past"
        And "school admin" sees other "<status>" "past" lessons in chain no change
        Examples:
            | status    |
            | Draft     |
            | Published |
