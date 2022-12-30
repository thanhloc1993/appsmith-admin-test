@learner @cms
@syllabus @routing

Feature: Routing and refresh for Stats Page On Learner Web

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App

    #TCID:None
    @ignore
    Scenario: Student refreshes Stats Page
        Given student goes to "Stats Page" on Home Screen
        When student refreshes their browser
        Then student is still on "Stats Page"

    #TCID:None
    Scenario Outline: Student can access to Stats Page when entering right url from "<screen>"
        Given student goes to "<screen>" on Home Screen
        When student enters "tab?tab_name=stats" on browser address
        Then student is on "Stats Page"

        Examples:
            | screen        |
            # | Learning Page |
            | Messages Page |
            | To-Dos Page   |
            | Lesson Page   |