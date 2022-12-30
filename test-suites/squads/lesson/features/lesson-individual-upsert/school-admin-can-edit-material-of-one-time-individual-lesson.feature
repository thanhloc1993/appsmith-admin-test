@cms @teacher
@lesson
@lesson-individual-upsert

Feature: School Admin can edit material of one time individual lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App

    Scenario Outline: School admin can edit material of the <status> one time individual lesson by adding <material>
        Given "school admin" has created a "<status>" "Online" "individual" lesson in the "future" and attached "<material>"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed the newly "future" lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" adds "<material>" to the lesson
        And "school admin" clicks save with "<status>" the lesson page
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" "can see" added "<material>" in lesson detail page on CMS
        And "teacher" can "<action>" the "future" one time individual lesson on Teacher App
        And "teacher" "can see" "<material>" material of the lesson page on Teacher App
        Examples:
            | status    | material | action  |
            | Draft     | pdf      | not see |
            | Draft     | video    | not see |
            | Published | pdf      | see     |
            | Published | video    | see     |
#
    Scenario Outline: School Admin can edit material of the <status> one time individual lesson by removing
        Given "school admin" has created a "<status>" "Online" "individual" lesson in the "past" and attached "<material>"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed the newly "past" lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" removes "<material>" to the lesson
        And "school admin" clicks save with "<status>" the lesson page
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" "does not see" added "<material>" in lesson detail page on CMS
        And "teacher" "does not see" "<material>" material of the lesson page on Teacher App
        Examples:
            | status    | material |
            | Draft     | pdf      |
            | Draft     | video    |
            | Published | pdf      |
            | Published | video    |
