@cms
@user @student-course

Feature: Cancel student course with location on CMS

    Background:
        Given "school admin" logins CMS
        And school admin has imported location master data
        And school admin selects all locations on location setting

    Scenario Outline: Cancel adding course for student
        Given school admin has created a student belong to "location L1"
        And school admin has created a "course C1" belong to "location L1"
        And school admin "opens" edit course popup in student detail page
        And school admin adds draft "course C1" to edit course popup
        When school admin cancels the editing process by using "<option>"
        Then school admin sees nothing changed in course tab
        Examples:
            | option        |
            | X button      |
            | cancel button |
            | ESC key       |

    Scenario Outline: Cancel editing course for student
        Given school admin has created a student course with location
        And school admin "opens" edit course popup in student detail page
        When school admin changes start date and end date of the course
        And school admin cancels the editing process by using "<option>"
        Then school admin sees nothing changed in course tab
        Examples:
            | option        |
            | X button      |
            | cancel button |
            | ESC key       |
