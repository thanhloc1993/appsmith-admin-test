@cms @cms2
@lesson
@lesson-filter

Feature: Teacher can filter future lesson by single option
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher" has gone to "future" lessons list page

    Scenario Outline: Teacher can filter by single <option> field
        Given "teacher" has chosen "5" rows per page in the first result page
        And "teacher" has gone to another result page
        When "teacher" filters with "<option>"
        Then "teacher" is redirected to the first result page
        And "teacher" sees "<option>" chip filter in result page
        And "teacher" sees a lesson list which matches "<option>"
        And "teacher" still sees lessons per page is "5"
        Examples:
            | option       |
            | Teacher Name |
            | Center       |
            | Student Name |
            | Grade        |
            | Course       |

    Scenario: Teacher can not filter a lesson without selecting any criteria in filter popup
        When "teacher" selects no criteria
        Then "teacher" sees message "Invalid search query - returning all items"