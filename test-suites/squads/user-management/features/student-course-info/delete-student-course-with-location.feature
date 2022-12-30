@cms
@user @student-course
@ignore

Feature: Delete student course with location on CMS

    Background:
        Given "school admin" logins CMS
        And school admin has imported location master data

    Scenario Outline: Delete draft student course
        Given school admin has created a "course C1, course C2, course C3" belong to "location L1"
        And school admin has created a student belong to "location L1"
        And school admin "opens" edit course popup in student detail page
        And school admin adds draft "course C1, course C2, course C3" to edit course popup
        When school admin selects "<option>" draft course
        Then school admin sees delete button is "<status>"
        Examples:
            | option  | status   |
            | nothing | disabled |
            | one     | enabled  |
            | multi   | enabled  |
            | all     | enabled  |

    Scenario: Delete previously added student course
        Given school admin has created a student course with location
        And school admin "opens" edit course popup in student detail page
        When school admin can not select the previous course
        Then school admin sees delete button is "disabled"
