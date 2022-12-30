@cms
@communication
@questionnaire-notification

Feature: Check button question and answer of questionnaire

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "school admin" is at "Notification" page on CMS

    Scenario: check hidden button Question which have 10 question and 10 answer each
        When "school admin" open compose dialog and input required fields
        And "school admin" creates Questions and Answers of Questionnaire section
            | numberOfQuestions | numberOfAnswersEach | questionType                  |
            | 1                 | 10                  | QUESTION_TYPE_MULTIPLE_CHOICE |
            | 1                 | 10                  | QUESTION_TYPE_CHECK_BOX       |
            | 8                 | 0                   | QUESTION_TYPE_FREE_TEXT       |
        Then "school admin" sees buttons hidden with conditions on questionnaire form

    Scenario: Check show Answer textbox and disable delete button Answer with question type is Checkbox and Multiple choice
        When "school admin" open compose dialog and input required fields
        And "school admin" creates Questions and Answers of Questionnaire section
            | numberOfQuestions | numberOfAnswersEach | questionType                  |
            | 1                 | 2                   | QUESTION_TYPE_MULTIPLE_CHOICE |
            | 1                 | 2                   | QUESTION_TYPE_CHECK_BOX       |
        Then "school admin" sees delete answer button disable
