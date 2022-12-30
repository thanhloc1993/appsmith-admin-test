@cms @teacher
@lesson
@course
@ignore

Feature: School admin can create a new course with teaching method
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "school admin" has gone to course page
        And "school admin" has opened creating course page
        And "school admin" has filled course name

    Scenario Outline: School admin can create a new course with <location_level> teaching method
        Given "school admin" has selected "<location_level>" location in Course
        And "school admin" has selected "<teaching_method>" teaching method
        When "school admin" creates a new course
        Then "school admin" is redirected to course list page
        And "school admin" sees a dialog that course is created successfully
        And "school admin" sees the new course with "<teaching_method>" teaching method on CMS
        And teacher sees the new course on Teacher App
        Examples:
            | teaching_method | location_level |
            | Individual      | one child      |
            | Group           | one child      |

    Scenario: School admin cannot create a new course with missing field
        When "school admin" creates a new course
        Then "school admin" sees an inline error message under location field
        And "school admin" sees an inline error message under teaching method field
        And "school admin" is still in creating course page
