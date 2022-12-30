@cms
@syllabus
@cms-syllabus-integration
@question-v2 @staging

Feature: [Integration] Create the multiple answers question integration V2

    Background:
        Given "school admin" logins CMS
        And school admin has created a "has 1 learning objective" book
        And school admin goes to book detail page
        And school admin goes to the new create question page

    Scenario Outline: School admin can create multiple answers question with <answerAction> answers
        When school admin creates multiple answers question with "<answerAction>" answers
        Then school admin sees message "You have created a new question successfully"
        And school admin will see the newly created multiple answers question

        Examples:
            | answerAction |
            | many         |
            | one          |
            | add more     |
            | delete some  |

    Scenario Outline: School admin cannot create a multiple answers question with <field>
        When school admin creates multiple answers question with "<field>"
        Then school admin sees the error message "<message>" in case "<field>"

        Examples:
            | field              | message                                       |
            | empty description  | This field is required                        |
            | all empty answers  | This field is required                        |
            | any empty answer   | This field is required                        |
            | no correct answers | Must have at least 1 answer marked as CORRECT |
