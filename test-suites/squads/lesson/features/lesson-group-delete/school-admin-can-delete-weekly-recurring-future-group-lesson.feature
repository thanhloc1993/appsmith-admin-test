@cms
@lesson
@lesson-group-delete

Feature: School Admin can delete weekly recurring future group lesson
    Background:
        Given "school admin" logins CMS

    Scenario Outline: School Admin can delete <status> weekly recurring group lesson with the "Only this lesson" option
        Given "school admin" has created a "<status>" weekly recurring "group" lesson with lesson date in the "past"
        And "school admin" has applied "all child locations of parent" location
        And "school admin" has gone to detailed the newly "past" lesson info page
        When "school admin" deletes the recurring lesson with the "Only this lesson" option
        Then "school admin" is redirected to "future" lessons list page
        And "school admin" does not see the deleted lesson on "past" lesson list on CMS
        And "school admin" can see other lessons in the recurring chain still remain
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: School Admin can delete <status> weekly recurring group lesson with the "This and the following lessons" option
        Given "school admin" has created a "<status>" weekly recurring "group" lesson with lesson date in the "future"
        And "school admin" has applied "all child locations of parent" location
        And "school admin" has gone to detailed lesson info page of the 2nd lesson in the chain
        When "school admin" deletes the recurring lesson with the "This and the following lessons" option
        Then "school admin" is redirected to "future" lessons list page
        And "school admin" does not see the deleted lesson on "future" lesson list on CMS
        And "school admin" can "not see" other lessons in chain "after" deleted lesson
        And "school admin" can "see" other lessons in chain "before" deleted lesson
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: School Admin can cancel deleting <status> weekly recurring
        Given "school admin" has created a "<status>" weekly recurring "group" lesson with lesson date in the "future"
        And "school admin" has applied "all child locations of parent" location
        And "school admin" has gone to detailed the newly "future" lesson info page
        When "school admin" cancels deleting the lesson
        Then "school admin" is still in detailed lesson info page
        And "school admin" still sees the "future" lesson on CMS
        And "school admin" can see other lessons in the recurring chain still remain
        Examples:
            | status    |
            | Draft     |
            | Published |
