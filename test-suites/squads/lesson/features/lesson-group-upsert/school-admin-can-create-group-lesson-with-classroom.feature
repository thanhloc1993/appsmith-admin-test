@cms
@lesson
@lesson-group-upsert
@ignore

Feature: School Admin can create one time group lesson with classroom
    Background:
        Given "school admin" logins CMS
        And "school admin" has imported classroom
        And "school admin" has applied "all child locations of parent" location
        And "school admin" has gone to lesson management page
        And "school admin" has opened creating lesson page

    Scenario Outline: School admin can create <status>  one time individual lesson with classroom
        Given "school admin" has filled date & time is within 10 minutes from now
        And "school admin" has filled all remain fields in create lesson page
        And "school admin" has selected "Group" teaching method
        And "school admin" has filled classroom
        When "school admin" clicks save with "<status>" the lesson page
        Then "school admin" is redirected to "future" lessons list page
        And "school admin" sees newly created "<status>" "future" lesson on the list on CMS
        And "school admin" goes to detailed lesson info page
        And "school admin" sees the classroom in the detailed lesson page
        Examples:
            | status    |
            | Draft     |
            | Published |
    
    Scenario Outline: School admin can create <status>  one time individual lesson without classroom
        Given "school admin" has filled date & time is within 10 minutes from now
        And "school admin" has filled all remain fields in create lesson page
        And "school admin" has selected "Group" teaching method
        And "school admin" has not filled classroom yet
        When "school admin" clicks save with "<status>" the lesson page
        Then "school admin" is redirected to "future" lessons list page
        And "school admin" sees newly created "<status>" "future" lesson on the list on CMS
        And "school admin" goes to detailed lesson info page
        And "school admin" does not see the classroom in the detailed lesson page
        Examples:
            | status    |
            | Draft     |
            | Published |
