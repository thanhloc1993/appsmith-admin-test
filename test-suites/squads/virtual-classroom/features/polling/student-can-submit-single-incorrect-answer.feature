@cms @teacher @learner
@virtual-classroom
@virtual-classroom-polling

Feature: Student can submit single incorrect answer
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App
        And "teacher" has opened create polling page on Teacher App
        And "teacher" has added more options from C to J on Teacher App

    Scenario Outline: Student can submit single incorrect answer
        Given "teacher" fulfills by text in question and fulfills by text answer option field on Teacher App
        And "teacher" has selected "<correct option>" as correct answer on Teacher App
        And "teacher" has started polling on Teacher App
        When "student" submits "<incorrect option>" options on Learner App
        Then "student" sees their selected answer option in option list on Learner App
        And "teacher" sees "student"'s submitted time and also their submitted answer in Detail page on Teacher App
        And "teacher" sees "1"|"1" number of answer on Teacher App
        And "teacher" sees "<incorrect option>" option has "100" answer ratio on Teacher App
        Examples:
            | correct option | incorrect option |
            | A              | B                |
            | B              | A                |
            | C              | A                |
            | E              | A                |
            | F              | A                |
            | G              | A                |
            | H              | A                |
            | I              | A                |
            | J              | A                |