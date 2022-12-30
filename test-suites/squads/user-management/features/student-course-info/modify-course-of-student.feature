@cms @teacher @learner
@user @student-course

Feature: Modify course of student

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App

    Scenario Outline: Add <status> course to student when editing student info
        Given school admin has created a student with parent info and "available" course
        When school admin adds a new "<status>" course
        Then school admin sees updated course list on student detail page
        And teacher sees this course on Teacher App
        And student logins Learner App successfully with credentials which school admin gives
        And student sees only available courses on Learner App

        Examples:
            | status      |
            | available   |
            | unavailable |

    Scenario Outline: Edit course's duration from <oldStatus> to <newStatus> when editing student info
        Given school admin has created a student with parent info and "<oldStatus>" course
        When school admin edits course's duration "<oldStatus>" to "<newStatus>"
        Then school admin sees updated course list on student detail page
        And teacher sees this course on Teacher App
        And student logins Learner App successfully with credentials which school admin gives
        And student sees only available courses on Learner App

        Examples:
            | oldStatus   | newStatus   |
            | available   | unavailable |
            | unavailable | available   |

    @ignore
    Scenario: Edit course with start date > end date
        Given school admin has created a student with parent info and "available" course
        When school admin edits previously added course with start date > end date
        Then school admin sees end date updated following start date
        And school admin sees updated course list on student detail page
        And teacher sees this course on Teacher App
        And student logins Learner App successfully with credentials which school admin gives
        And student sees only available courses on Learner App