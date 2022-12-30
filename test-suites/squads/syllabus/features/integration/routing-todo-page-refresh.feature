@learner @cms
@syllabus @routing

Feature: Routing and refresh for To-Dos Page On Learner Web

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App

    #TCID:None
    Scenario Outline: Student can access to Todos Page Page when entering right url from "<screen>"
        Given student goes to "<screen>" on Home Screen
        When student enters "tab?tab_name=todos" on browser address
        Then student is on "To-Dos Page"

        Examples:
            | screen        |
            | Learning Page |
            | Stats Page    |
            | Messages Page |
            | Lesson Page   |

    #TCID:None
    @ignore
    Scenario: Student refreshes Todos Page
        Given student goes to "To-Dos Page" on Home Screen
        When student refreshes their browser
        Then student is still on "To-Dos Page"
