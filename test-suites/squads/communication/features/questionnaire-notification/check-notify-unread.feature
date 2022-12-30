@cms @learner
@communication
@questionnaire-notification
@ignore

Feature: Check notify unread button

    Background:
        Given "school admin" logins CMS
        And "school admin" has created "student S1" and "student S2"
        And "school admin" has created the questionnaire notification which expire in a minute
            | questionType | required | numberOfQuestions |
            | CheckBox     | true     | 1                 |
            | Short answer | true     | 1                 |

    Scenario: Notify Unread button disable when expiration date time end
        Given "school admin" sent the notification to "student S1" and "student S2"
        When "school admin" waits for questionnaire to be expired
        And "school admin" view detail questionnaire notification
        Then "school admin" sees "Notify Unread" button disable
