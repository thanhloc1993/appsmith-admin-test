@cms
@user @student-course
@ignore

Feature: Deselect student course with location on CMS

    Background:
        Given "school admin" logins CMS
        And school admin has imported location master data
        And school admin has created a "course C1, course C2, course C3" belong to "location L1"
        And school admin has created a student belong to "location L1"
        And school admin "opens" edit course popup in student detail page
        And school admin adds draft "course C1, course C2, course C3" to edit course popup

    Scenario Outline: Selects the draft courses
        When school admin selects "<type>" draft courses
        Then school admin sees "<type>" draft courses selected
        Examples:
            | type  |
            | one   |
            | multi |
            | all   |

    Scenario Outline: Deselects the draft courses
        When school admin selects "<type>" draft courses
        And school admin deselects "<type>" draft courses
        Then school admin sees "<type>" draft courses deselects
        Examples:
            | type  |
            | one   |
            | multi |
            | all   |
