@cms
@user @student-course

Feature: Edit student course with location on CMS

    Background:
        Given "school admin" logins CMS
        And school admin has imported location master data
        And school admin selects all locations on location setting

    Scenario Outline: Edit student course with location
        Given school admin has created a student belong to "location L1 & location L2"
        And school admin has created a "<course>" belong to "location L1 & location L2"
        When school admin wants to add a new student-course
        And school admin adds a new "available" "<course>" with "location L1"
        And school admin edits "location L1" to "location L2" of "<course>" in the student
        Then school admin sees the "<course>" with "location L2" added for the student
        Examples:
            | course                |
            | course C1             |
            | course C1 & course C2 |

    Scenario: Edit student course with invalid time
        Given school admin has created a student course with location
        When school admin "opens" edit course popup in student detail page
        And school admin edits end date to be smaller than the start date
        Then school admin sees the editing date is disabled

    Scenario: Edit student course with archived location
        Given school admin has created a student course with new "location L1 & location L2"
        When school admin archives "location L1"
        And school admin "opens" edit course popup in student detail page
        Then school admin only sees "location L2" display in the location dropdown
        And school admin archives "location L2" to clean data

    Scenario: Edit student course with changed name location
        Given school admin has created a student course with new "location"
        When school admin changes the name of location
        And school admin "opens" edit course popup in student detail page
        Then school admin sees the location name has changed
        And school admin archives "location" to clean data
