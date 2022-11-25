@cms @teacher @learner
@user @student-course
@ignore

Feature: Add course for student
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App

    Scenario: Can open edit dialog
        Given school admin has created a student "student" with "0 parents", "0 visible courses"
        When school admin opens edit courses
        Then school admin sees no course on edit course popup

    Scenario Outline: Add new <status> course
        Given school admin has created a student "student" with "0 parents", "<number> visible courses"
        And school admin adds "1" draft courses to popup
        When school admin adds a new "<status>" course
        Then school admin sees updated course list on student detail page
        And teacher sees this course on Teacher App
        And teacher sees student in the courses on Teacher App
        And student logins Learner App successfully with credentials which school admin gives
        And student "<result>" new course on Learner App
        Examples:
            | status      | number | result       |
            | available   | 0      | sees         |
            | unavailable | 0      | does not see |
            | available   | 1      | sees         |
            | unavailable | 1      | does not see |

    Scenario Outline: Add multiple courses at the same time
        Given school admin has created a student "student" with "0 parents", "<number> visible courses"
        And school admin adds "2" draft courses to popup
        When school admin adds new "available" "course C1"
        And school admin adds new "unavailable" "course C2"
        Then school admin sees updated course list on student detail page
        And teacher sees all courses on Teacher App
        And teacher sees student in the courses on Teacher App
        And student logins Learner App successfully with credentials which school admin gives
        And student sees "course C1" on Learner App
        And student does not see "course C2" on Learner App
        Examples:
            | number |
            | 0      |
            | 1      |

    Scenario: Add new course with start date > end date
        Given school admin has created a student "student" with "0 parents", "0 visible courses"
        And school admin adds "1" draft course to popup
        When school admin adds new course with start date = end date
        And school admin edits start date > end date
        Then school admin sees end date updated following start date