@cms @user @parent
@ignore

Feature: Switch Student After Remove Parent

    Background:
        Given "school admin" logins CMS
        And "school admin" has created "student S1" with "Enrolled" status and parent info

        And "school admin" removes parent of "student S1"

    Scenario: Switch Student in Parent App after remove parent from student
        Given "parent P1" of "student S1" logins Learner App
        When "parent P1" goes to switch student page
        Then "parent P1" sees no associated students displayed
