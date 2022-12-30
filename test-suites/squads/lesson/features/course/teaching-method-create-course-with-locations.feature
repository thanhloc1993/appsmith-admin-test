@cms @teacher
@lesson
@course
@ignore

Feature: School admin can create a new course with location
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "school admin" has gone to course page
        And "school admin" has opened creating course page

    Scenario Outline: School admin can create a new course with location and teaching method
        Given "school admin" has filled course name
        And "school admin" has selected "<type>" location
        And "school admin" has selected "<teaching_method>" teaching method
        When "school admin" creates a new course
        Then "school admin" is redirected to course list page
        And "school admin" sees a dialog that course is created successfully
        And "school admin" sees the new course on CMS
        And "teacher" sees the new course on Teacher App
        Examples:
            | type         | teaching_method |
            | one parent   | Individual      |
            | one parent   | Group           |

    Scenario Outline: School admin can cancel creating course
        Given "school admin" has filled course name
        And "school admin" has selected "<type>" location
        And "school admin" has selected "<teaching_method>" teaching method
        When "school admin" cancels creating course
        Then "school admin" is redirected to course list page
        And "school admin" does not see the new course on CMS
        And "teacher" does not see the new course on Teacher App
        Examples:
            | type         | teaching_method |
            | one parent   | Individual      |
            | one parent   | Group           |
