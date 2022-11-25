@cms @cms2
@lesson
@lesson-list

Feature: School admin can view default rows per page of past lessons list
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours

    Scenario: School admin can view default rows per page of past lessons list
        When "school admin" goes to "past" lessons list page
        Then "school admin" sees default rows per page is "10"
        And "school admin" sees number of lesson is equal or less than "10" in lesson list
