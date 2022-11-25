@learner @cms
@syllabus @routing

Feature: Routing and refresh for Learning Page On Learner Web

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App

    #TCID:None
    @ignore
    Scenario: Student refreshes Learning Page
        Given student is on "Home Screen"
        And student is on "Learning Page"
        When student refreshes their browser
        Then student is still on "Learning Page"

    #TCID:None
    Scenario Outline: Student can access to Learning Page when entering right url from "<screen>"
        Given student goes to "<screen>" on Home Screen
        When student enters "tab?tab_name=home" with random string on browser address
        Then student is on "Learning Page"

        Examples:
            | screen        |
            | To-Dos Page   |
            | Stats Page    |
            | Messages Page |
            | Lesson Page   |
