@cms @teacher
@virtual-classroom
@virtual-classroom-jump-page

Feature: Teacher can see preview button when sharing pdf
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And school admin has created a lesson of lesson management with attached "pdf" on CMS
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App

    Scenario: Teacher can see preview button when share pdf
        When "teacher" shares lesson's "pdf" on Teacher App
        Then "teacher" sees inactive Preview icon in the main bar on Teacher App