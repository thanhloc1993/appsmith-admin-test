@cms
@communication
@questionnaire-notification

Feature: Validator field questionnaire

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "school admin" is at "Notification" page on CMS

    Scenario: Send questionnaire with blank Question and blank Answer
        When "school admin" open compose dialog and input required fields
        And "school admin" creates Questions and Answers of Questionnaire section
            | numberOfQuestions | numberOfAnswersEach | questionType                  | questionTextBox | answerTextBox |
            | 1                 | 2                   | QUESTION_TYPE_MULTIPLE_CHOICE | blank           | valid         |
            | 1                 | 2                   | QUESTION_TYPE_CHECK_BOX       | valid           | blank         |
        And school admin sends notification
        Then "school admin" sees required fields validator Question and Answer

    @ignore
    Scenario Outline: Validator answer when send notification with 1 answer
        When "school admin" open compose dialog and input required fields
        And "school admin" add Question and 1 valid answer with question type is "<questionType>"
        And "school admin" sends notification
        Then "school admin" sees required field validator at second answer of question
        Examples:
            | questionType    |
            | Multiple Choice |
            | Checkbox        |
