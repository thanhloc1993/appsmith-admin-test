@cms
@lesson
@lesson-filter

Feature: School admin can change filter of past lesson
    Background:
        Given "school admin" logins CMS
        #need refactor step context
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "school admin" has gone to "past" list page

    Scenario Outline: School admin can change <option> filter in filter popup
        Given "school admin" has applied filter with "Lesson Start Date, Lesson End Date, Start Time, End Time"
        When "school admin" changes "<option>" in filter popup
        Then "school admin" sees updated lesson list which matches "<option>"
        Examples:
            | option            |
            | Lesson Start Date |
            | Lesson End Date   |
            | Start Time        |
            | End Time          |
