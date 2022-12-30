@learner @cms
@syllabus @404-page

Feature: Page Not Found Navigation After Login

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App

    #TCID:None
    Scenario: Student goes to Page Not Found Screen after entering wrong URL
        When student enters a random path on browser address
        Then student is on "Page Not Found Screen"

    #TCID:None
    Scenario: Student goes back to Home Screen from Page Not Found Screen
        When student goes to Page Not Found Screen
        And student taps back on browser tab bar
        Then student is on "Home Screen"