@cms
@lesson
@lesson-filter

Feature: School admin can change filter of future lesson
    Background:
        Given "school admin" logins CMS
        #need refactor step context
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "school admin" has gone to "future" list page

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
