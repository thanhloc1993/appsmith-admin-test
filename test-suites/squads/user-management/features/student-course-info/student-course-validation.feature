@cms
@user @student-course @ignore
Feature: student course validation

    Background:
        Given "school admin" logins CMS
        And student list has many records

    Scenario Outline: Unable to active student course after removing student/course location
        Given school admin has created a "course C1" belong to "location L1 & location L2"
        And school admin has created a "student S1" belong to "location L1"
        And school admin has added "unavailable" "course C1" with "location L1" for "student S1"
        And "school admin" has been editing student
        And school admin has removed "location L1" of "<option>"
        And school admin saves the editing process
        When school admin "opens" edit course popup in student detail page
        And school admin changes to "available" "course C1"
        And school admin saves the editing process
        Then school admin sees the error message for active course
        And school admin closes the course popup
        And school admin sees the "course C1" with new data is not saved
        And teacher can see "student S1" in the "course C1"
        And "student S1" does not see "course C1"
        Examples:
            | option     |
            | student S1 |
            | course C1  |

    Scenario Outline: Able to activate student_course after re-adding student/course location
        Given school admin has created a "course C1" belong to "location L1 $ location L2"
        And school admin has created a "student S1" belong to "location L1"
        And school admin has added "unavailable" "course C1" with "location L1" for "student S1"
        And "school admin" has been editing student
        And school admin has removed "location L1" of "<option>"
        And school admin saves the editing process
        When school admin "opens" edit course popup in student detail page
        And school admin re-adds "location L1" of "<option>"
        And school admin saves the editing process
        Then school admin sees the "course C1" with new data is saved
        And teacher can see "student S1" in the "course C1"
        And "student S1" does not see "course C1"
        Examples:
            | option     |
            | student S1 |
            | course C1  |