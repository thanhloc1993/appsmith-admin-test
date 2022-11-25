@cms
@communication
@questionnaire-notification

Feature: Compose questionnaire notification

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "school admin" is at "Notification" page on CMS
        And school admin has saved a draft notification with required fields

    Scenario: Send questionnaire notification with multiple question type
        When "school admin" selects created draft notification
        And "school admin" creates Questions and Answers of Questionnaire section
            | numberOfQuestions | numberOfAnswersEach | questionType                  |
            | 1                 | 2                   | QUESTION_TYPE_MULTIPLE_CHOICE |
            | 1                 | 2                   | QUESTION_TYPE_CHECK_BOX       |
            | 1                 | 0                   | QUESTION_TYPE_FREE_TEXT       |
        And school admin sends notification
        Then school admin sends notification successfully
