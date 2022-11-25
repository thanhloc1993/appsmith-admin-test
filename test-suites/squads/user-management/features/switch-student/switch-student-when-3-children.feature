@cms @user @parent

Feature: Switch Student in Parent App

    Background:
        Given "school admin" logins CMS
        And "school admin" has created "3" students with the same parent

    Scenario: Switch Student in Parent App when have 3 children
        And "parent P1" of "student S1" logins Learner App
        When "parent P1" goes to switch student page
        Then "parent P1" sees all kids are displayed in ascending order
        And "parent P1" sees all kids are having correct avatars

    Scenario: Switch Student in Parent App when Student is selected
        Given "parent P1" of "student S1" logins Learner App
        When "parent P1" goes to switch student page
        And "parent P1" switches to "student S2"
        Then "parent P1" sees correct avatar of "student S2" on app bar
        And "parent P1" is redirected to stat page
