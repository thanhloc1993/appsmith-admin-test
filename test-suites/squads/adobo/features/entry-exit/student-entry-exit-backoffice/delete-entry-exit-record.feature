@cms
@entry-exit @adobo
@student-entry-exit-backoffice

Feature: School admin deletes an entry & exit record
    Background:
        Given "school admin" logins CMS

    @blocker
    # TODO: @entry-exit will work on mobile features in a future task
    Scenario Outline: School admin deletes entry & exit record
        Given "school admin" has created "student" with "<status>" status and parent info
        And at least 2 entry & exit records have been created for "student"
        # And "student" logins Learner App
        # And "parent" logins Learner App
        When "school admin" deletes the selected entry & exit record of "student"
        Then "school admin" sees entry & exit record has been deleted
        # And "student" sees entry & exit record has been deleted in Learner App
        # And "parent" sees entry & exit record has been deleted in Learner App
        Examples:
            | status    |
            | Enrolled  |
            | Potential |

    Scenario Outline: School admin cannot delete record of <cannotStatus> student
        Given "school admin" has created "student" with "enrolled" status and parent info
        And at least 1 entry & exit record has been created for "enrolled" "student"
        And "school admin" updates student status to "<cannotStatus>"
        When "school admin" tries to delete the selected entry & exit record of "student"
        Then "school admin" sees that they cannot delete the record
        Examples:
            | cannotStatus |
            | Withdrawn    |
            | LOA          |
            | Graduated    |
