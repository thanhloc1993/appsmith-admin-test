@cms @teacher
@virtual-classroom
@virtual-classroom-jump-page

Feature: Teacher cannot see preview button
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And school admin has created a lesson of lesson management with attached "pdf, video" on CMS
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App

    Scenario: Teacher cannot see preview button in lesson waiting room on Teacher App
        Given "teacher" has shared lesson's "pdf" on Teacher App
        And "teacher" has left lesson on Teacher App
        When "teacher" goes to lesson waiting room on Teacher App
        Then "teacher" does not see Preview icon in the main bar on Teacher App

    Scenario: Teacher cannot see preview button when sharing video
        When "teacher" shares lesson's "video" on Teacher App
        Then "teacher" does not see Preview icon in the main bar on Teacher App

    Scenario: Teacher cannot see preview button when stop sharing
        Given "teacher" has shared lesson's "pdf" on Teacher App
        When "teacher" stops sharing material on Teacher App
        Then "teacher" does not see Preview icon in the main bar on Teacher App