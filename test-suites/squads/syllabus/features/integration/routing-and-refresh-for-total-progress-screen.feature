@learner @cms
@syllabus

Feature: Routing and refresh for "Total Progress Screen" On Learner Web

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App

    #TCID:None
    Scenario Outline: Student can access "Total Progress Screen" when entering right Url
        Given student goes to "<screen>" on Home Screen
        When student goes to Total Progress Screen by using browser address
        Then student is on "Total Progress Screen"

        Examples:
            | screen        |
            | To-Dos Page   |
            | Stats Page    |
            | Messages Page |
            | Lesson Page   |

    @ignore
    Scenario: Student refreshes "Total Progress Screen"
        Given student goes to Total Progress Screen
        When student refreshes their browser
        Then student is still on "Total Progress Screen"

    #TCID:None
    Scenario: Student can go back to "Stats Page" from "Total Progress Screen"
        Given student goes to Total Progress Screen
        When student taps back on browser tab bar
        Then student is on "Stats Page"

    #TCID:None
    Scenario: Student can go back to "Stats Page" from an error "Total Progress Screen"
        Given student goes to Total Progress Screen accessed by wrong param
        And student sees error dialog
        And student confirms the error dialog
        Then student is on "Stats Page"