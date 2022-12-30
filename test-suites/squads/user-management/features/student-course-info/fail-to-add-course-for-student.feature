@cms
@user @student-course
@ignore

Feature: Fail to add course for student
    Background:
        Given "school admin" logins CMS

    Scenario Outline: Cannot add course with missing "<requiredField>"
        Given school admin has created a student "student S1" with "0 parents", "0 visible courses"
        And school admin adds "1" draft courses to popup
        When school admin adds a new course with "missing" "<requiredField>"
        Then school admin sees error message
        And school admin cannot create a new course
        Examples:
            | requiredField |
            | All           |
            | Name          |
            | Start Date    |
            | End Date      |

    Scenario Outline: Fill only 1 course out of multiple courses
        Given school admin has created a student "student S1" with "0 parents", "0 visible courses"
        And school admin adds "2" draft courses to popup
        When school admin adds course "C1" with "full fields"
        And school admin adds new course "C2" with "missing" "<requiredField>"
        Then school admin sees error message
        And school admin cannot create a new course
        Examples:
            | requiredField |
            | All           |
            | Name          |
            | Start Date    |
            | End Date      |

    Scenario: Cannot add previously added course
        Given school admin has created a student "student S1" with "0 parents", "1 visible courses"
        And school admin adds "1" draft courses to popup
        When school admin adds a new course with "previously added course"
        Then school admin sees previously added course is unable to choose