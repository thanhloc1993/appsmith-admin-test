@cms @teacher
@lesson
@lesson-group-upsert
@ignore

Feature: School Admin can edit material of the one time group lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" login Teacher App

    Scenario Outline: School Admin can edit material of the <status> one time group lesson by adding
        Given "school admin" has created a "<status>" "One Time" "group" lesson in the "past" with attached "<material>"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed the newly "past" lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" adds "<material>" to the lesson
        And "school admin" saves the changes of the lesson
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" "can see" added "<material>" in lesson detail page on CMS
        And "teacher" "<action>" "<material>" material of the lesson page on Teacher App
        Examples:
            | status    | material | action      |
            | Draft     | pdf      | can not see |
            | Draft     | video    | can not see |
            | Published | pdf      | can see     |
            | Published | video    | can see     |

    Scenario Outline: School Admin can edit material of the <status> one time group lesson by removing
        Given "school admin" has created a "<status>" "One Time" "group" lesson in the "past" with attached "<material>"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed the newly "past" lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" removes "<material>" to the lesson
        And "school admin" saves the changes of the lesson
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" "does not see" added "<material>" in lesson detail page on CMS
        And "teacher" "does not see" "<material>" material of the lesson page on Teacher App
        Examples:
            | status    | material |
            | Draft     | pdf      |
            | Draft     | video    |
            | Published | pdf      |
            | Published | video    |