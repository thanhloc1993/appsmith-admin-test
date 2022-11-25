@cms
@user @student-search-filter @ignore
Feature: Filter student after editing student

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info

    Scenario Outline: Filter <status> grade after editing student
        When school admin edits grade of student on CMS
        And school admin filters "<status>" grade of the student on CMS
        Then the edited student "<result>" displayed on student list
        Examples:
            | status | result |
            | edited | is     |
            | old    | is not |

    Scenario: Filter new course after adding new course for student
        Given school admin creates new course
        When school admin adds new course for existed student on CMS
        And school admin filters new course of the student on CMS
        Then the edited student is displayed on student list