@cms
@user @never-logged-in

Feature: School admin can filter never logged in student

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with parent info and "visible" course
        And school admin selects all locations on location setting

    Scenario Outline: School admin can filter never logged in student
        Given school admin is on "<pages>" page
        When school admin filters never logged in student
        And school admin filters student by other parameters
        Then school admin sees list of never logged in students who matches above filter
        Examples:
            | pages        |
            | Student List |

    @ignore
    Scenario: School admin can remove filter never logged in student
        Given "school admin" is on student page
        And "school admin" filters never logged in student
        And "school admin" filters student by other parameters
        When "school admin" removes filter never logged in student
        Then "school admin" sees list of students who matches above filter