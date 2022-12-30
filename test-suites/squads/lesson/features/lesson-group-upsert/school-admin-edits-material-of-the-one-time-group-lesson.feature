@cms @teacher
@lesson
@lesson-group-upsert

Feature: School Admin can edit material of the one time group lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" login Teacher App

    Scenario Outline: School Admin can edit material of the <status> one time group lesson by adding
        Given "school admin" has created a "<status>" "One Time" "group" lesson in the "past"
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" adds "<material>" to the lesson
        And "school admin" saves the changes "<status>" lesson
        And "teacher" applies center location in location settings on Teacher App
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" "can see" added "<material>" in lesson detail page on CMS
        And "teacher" can "<action>" the "past" lesson and "<material action>" "<material>" on Teacher App
        Examples:
            | status    | material | action  | material action |
            | Draft     | pdf      | not see | does not see    |
            | Draft     | video    | not see | does not see    |
            | Published | pdf      | see     | can see         |
            | Published | video    | see     | can see         |

    Scenario Outline: School Admin can edit material of the <status> one time group lesson by removing
        Given "school admin" has created a "<status>" "One Time" "group" lesson in the "past" with attached "<material>"
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" removes "<material>" to the lesson
        And "school admin" saves the changes "<status>" lesson
        And "teacher" applies center location in location settings on Teacher App
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" "does not see" added "<material>" in lesson detail page on CMS
        And "teacher" can "<action>" the "past" lesson and "does not see" "<material>" on Teacher App
        Examples:
            | status    | material | action  |
            | Draft     | pdf      | not see |
            | Draft     | video    | not see |
            | Published | pdf      | see     |
            | Published | video    | see     |