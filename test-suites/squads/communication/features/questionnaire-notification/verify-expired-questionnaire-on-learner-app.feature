@cms @learner
@communication
@questionnaire-notification

Feature: Verify expired questionnaire on learner app

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And "school admin" has created the questionnaire notification which expire in a minute
            | questionType | required | numberOfQuestions |
            | CheckBox     | true     | 1                 |
            | Short answer | true     | 1                 |

    Scenario: Learner access to notification detail with the expired questionnaire
        Given "school admin" sent the notification to "student"
        When "student" waits for questionnaire to be expired
        And "student" accesses to notification detail
        Then "student" sees notification display with expired questionnaire
