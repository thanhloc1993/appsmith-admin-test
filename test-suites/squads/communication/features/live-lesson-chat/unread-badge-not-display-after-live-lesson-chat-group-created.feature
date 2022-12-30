@cms @learner @teacher
@communication
@live-lesson-chat

Feature: Unread badge is not displayed after live lesson chat group is created
    Background:
        Given "school admin" logins CMS
        And "student" with course and enrolled status has logged Learner App
        And "teacher" logins Teacher App
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher" has filtered location in location settings on Teacher App with the lesson location
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario: Participants do not see unread badge is displayed
        Then "teacher" sees unread badge is not displayed
        And "student" sees unread badge is not displayed