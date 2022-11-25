@cms
@lesson
@course
@ignore

Feature: School admin cannot edit teaching method of course
    Background:
        Given "school admin" logins CMS
        And "school admin" has gone to course page
        And "school admin" has opened creating course page
        And "school admin" has filled course name

    Scenario Outline: School admin cannot edit teaching method of course
        Given "school admin" has selected "<location_level>" location in Course
        And "school admin" has selected "<teaching_method>" teaching method
        When "school admin" creates a new course
        And "school admin" goes to detail course page
        And "school admin" opens editing course page
        Then "school admin" sees teaching method field is disable
        Examples:
            | teaching_method | location_level |
            | Individual      | one child      |
            | Group           | one child      |
