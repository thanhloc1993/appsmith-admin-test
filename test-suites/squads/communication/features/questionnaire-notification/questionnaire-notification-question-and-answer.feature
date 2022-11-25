@cms @learner @parent
@communication
@questionnaire-notification
@ignore

Feature: Behaviour of question and answer in questionnaire

    Background: 
        Given "school admin" login CMS
        And "school admin" is at "Notification" page on CMS

    Scenario: Back to default when delete 1 last question
        Given "school admin" has created notification
        And "school admin" has added a valid question with question type is "Short Answer"
        When "school admin" delete the question
        Then "school admin" sees questionnaire notification back to default notification

    Scenario Outline: Delete answer when answer of question have more than 2 answer
        Given "school admin" has create notification 
        And "school admin" has add 2 valid answers with question type is "<questionType>"
        When "school admin" add 1 valid answer
        And "school admin" delete first answer
        Then "school admin" sees First answer remove 
        And "school admin" sees 2 answers left 
        And "school admin" sees delete answer button disable
        Examples:
            | questionType    |
            | Multiple choice |
            | Checkbox        |
