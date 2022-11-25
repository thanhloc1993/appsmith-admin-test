@cms
@user @student-course
@ignore

Feature: Cancel Add or Edit course for student
    Background:
        Given "school admin" logins CMS

    Scenario Outline: Able to cancel add new course
        Given school admin has created a student "student s1" with "0 parents", "1 visible course"
        And school admin adds "1" draft courses to popup
        And school admin adds course with "full fields"
        When school cancels the adding process by using “<option>”
        Then school admin sees edit course popup closed
        And school admin sees the new course is not saved
        Examples:
            | option        |
            | X button      |
            | cancel button |
            | ESC key       |

    Scenario Outline: Able to cancel edit previously added course
        Given school admin has created a student "student s1" with "0 parents", "1 visible course"
        And school admin edits previously added course with different start date and end date
        When school cancels the editing process by using “<option>”
        Then school admin sees edit course popup closed
        And school admin sees the editing course is not saved
        Examples:
            | option        |
            | X button      |
            | cancel button |
            | ESC key       |