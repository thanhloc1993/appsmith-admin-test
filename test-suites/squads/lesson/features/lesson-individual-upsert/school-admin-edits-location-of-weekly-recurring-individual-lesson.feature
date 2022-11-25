@cms
@lesson
@lesson-individual-upsert
@ignore

Feature: School Admin edits location of weekly recurring individual lesson
    Background:
        Given "school admin" logins CMS

    Scenario Outline: School Admin can edit location of a <status> future weekly recurring lesson
        Given "school admin" has created a "<status>" weekly recurring individual lesson with lesson date in the future
        And "school admin" has applied "all child locations of parent" location
        And "school admin" has gone to detailed "future" lesson info page of the 2nd lesson in the recurring chain
        And "school admin" has opened editing lesson page
        When "school admin" edits Location
        And "school admin" updates location of student
        And "school admin" saves the changes with "This and the following lessons" option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated location in lesson detail
        And "school admin" sees other "<status>" lessons in chain from edited lesson has location are updated 
        And "school admin" sees other "<status>" lessons in chain from edited lesson has repeat duration are remained
        And "school admin" sees "<status>" lessons in chain before edited lesson has end date is lesson date of previous lesson
        And "school admin" sees other "<status>" lessons in chain before edited lesson remain location and weekly on
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: School Admin can edit location of a <status> past weekly recurring lesson
        Given "school admin" has created a "<status>" weekly recurring individual lesson with lesson date in the past
        And "school admin" has applied "all child locations of parent" location
        And "school admin" has gone to detailed "past" lesson info page of the 2nd lesson in the recurring chain
        And "school admin" has opened editing lesson page
        When "school admin" edits Location
        And "school admin" updates location of student
        And "school admin" saves the changes with "Only this Lesson" option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated location in lesson detail
        And "school admin" sees this "<status>" lesson leaves chain and changes to one time lesson
        And "school admin" sees other "<status>" lessons in chain no change
        Examples:
            | status    |
            | Draft     |
            | Published |
