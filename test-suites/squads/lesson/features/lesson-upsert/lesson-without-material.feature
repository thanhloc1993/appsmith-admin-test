@cms @teacher
@lesson
@lesson-upsert

Feature: View lesson without material
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App

    Scenario: Admin can view a lesson without material
        When school admin creates a lesson without material on CMS
        Then school admin sees no material in lesson detail screen on CMS
        And "teacher" sees no material on Teacher App
