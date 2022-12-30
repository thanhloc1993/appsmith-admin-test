@learner
@user @404-page

Feature: Page Not Found Navigation Before Login

    Background:
        Given student has not logged in yet

    Scenario: Student goes to Page Not Found Screen when entering wrong URL
        When student enters a random path on browser address
        Then student is on "Page Not Found Screen"

    Scenario: Student goes back to Auth Multi Users Screen from Page Not Found Screen
        Given student goes to Page Not Found Screen
        When student taps back on browser tab bar
        Then student is on "Auth Multi Users Screen"
