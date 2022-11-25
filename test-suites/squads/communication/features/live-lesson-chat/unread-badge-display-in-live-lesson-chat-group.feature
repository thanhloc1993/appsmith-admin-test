@cms @teacher @teacher2 @learner @learner2
@communication
@live-lesson-chat

Feature: Unread badge is displayed in live lesson chat group

    Background:
        Given "school admin" logins CMS
        And "student S1, student S2" with course and enrolled status have logged Learner App
        And "teacher T1, teacher T2" login Teacher App
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher T1" has filtered location in location settings on Teacher App with the lesson location
        And "teacher T1" has joined lesson of lesson management on Teacher App
        And "student S1" has joined lesson on Learner App

    Scenario Outline: Unread badge is displayed when <receiver> receives new message
        When "<sender>" sends a text message
        #receiver does not open chat box
        Then "<receiver>" sees unread badge is displayed
        Examples:
            | sender     | receiver   |
            | student S1 | teacher T1 |
            | teacher T1 | student S1 |

    Scenario: New member sees unread badge display after joined lesson
        When "student S1" sends a text message
        And "teacher T1" sends a text message
        And "student S2" joins lesson on Learner App
        And "teacher T2" has filtered location in location settings on Teacher App with the lesson location
        And "teacher T2" joins lesson of lesson management on Teacher App
        Then "student S2" sees unread badge is displayed
        And "teacher T2" sees unread badge is displayed
