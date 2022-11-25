@cms @learner @teacher
@communication
@live-lesson-chat

Feature: Send and receive message in live lesson chat group

    Background:
        Given "school admin" logins CMS
        And "student" with course and enrolled status has logged Learner App
        And "teacher" logins Teacher App
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher" has filtered location in location settings on Teacher App with the lesson location
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario Outline: <participant> can send and receive message
        When "<participant>" sends a text message
        Then "student" sees message display in lesson chat box
        And "teacher" sees message display in lesson chat box
        Examples:
            | participant |
            | teacher     |
            | student     |