@cms
@lesson
@lesson-filter

Feature: School admin can filter past lesson by single option
    Background:
        Given "school admin" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "school admin" has gone to "past" lessons list page

    Scenario Outline: School admin can filter by single <option> field
        Given "school admin" has chosen "5" lessons per page in the first result page
        And "school admin" has gone to the next lesson results page
        When "school admin" filters with "<option>"
        Then "school admin" is redirected to the first result page
        And "school admin" sees "<option>" chip filter in result page
        And "school admin" sees a lesson list which matches "<option>"
        And "school admin" still sees lessons per page is "5"
        Examples:
            | option       |
            | Teacher Name |
            | Center       |
            | Student Name |
            | Grade        |
            | Course       |

    Scenario: School admin can not filter a lesson without selecting any criteria in filter popup
        When "school admin" selects no criteria
        Then "school admin" sees message "Invalid search query - returning all items"