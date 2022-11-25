@cms @learner
@communication
@questionnaire-notification

Feature: Send and verify important/non-important notification

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "student" logins Learner App
        And "school admin" is at "Notification" page on CMS

    Scenario Outline: Create and send important/non-important notification with questionnaire
        When "school admin" open compose dialog and input required fields
        And "school admin" has set the notification as "<importantField>"
        And "school admin" creates Questions and Answers of Questionnaire section
            | numberOfQuestions | numberOfAnswersEach | questionType                  |
            | 1                 | 2                   | QUESTION_TYPE_MULTIPLE_CHOICE |
            | 1                 | 2                   | QUESTION_TYPE_CHECK_BOX       |
        And "school admin" has sent the notification
        Then school admin sends notification successfully
        And "student" sees the "<importantField>" notification "with questionnaire" display correctly in notification list
        Examples:
            | importantField |
            | important      |
            | non-important  |

    Scenario Outline: Create and send important/non-important notification without questionnaire
        When "school admin" open compose dialog and input required fields
        And "school admin" has set the notification as "<importantField>"
        And "school admin" has sent the notification
        Then school admin sends notification successfully
        And "student" sees the "<importantField>" notification "without questionnaire" display correctly in notification list
        Examples:
            | importantField |
            | important      |
            | non-important  |
