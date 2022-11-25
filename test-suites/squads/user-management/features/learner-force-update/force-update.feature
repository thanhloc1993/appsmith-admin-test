@learner
@user @ignore
Feature: Force Update on Learner App

    Scenario Outline: Student has to update to the latest version to continue using the app
        Given there was a new app version
        And the app was "<status>"
        And student "<loggedInStatus>" logged in the app
        When student "<action>" the app
        ### Try to run the automation step with 3 instructions in Then sentences
        ### See the Force update dialog
        ### Tap on the Update Now
        ### Update the app version then can continue to use the app
        Then student has to update to the latest version to continue using the app
        Examples:
            | status        | loggedInStatus | action                  |
            | killed        | has            | open                    |
            | in background | has            | bring app to foreground |
            | in using      | has            | continue to use         |
            | killed        | hasn't         | open                    |
            | in background | hasn't         | bring app to foreground |
