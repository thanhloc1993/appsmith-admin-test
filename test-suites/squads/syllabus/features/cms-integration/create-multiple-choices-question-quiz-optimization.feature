@cms
@syllabus
@cms-syllabus-integration
@question-v2 @staging

Feature: [Integration] Create the multiple choices question integration V2

    Background:
        Given "school admin" logins CMS
        And school admin has created a "simple content with 1 LO learning" book
        And school admin goes to book detail page
        And school admin goes to the new create question page

    Scenario Outline: School admin can create multiple choices question with <answer> answers
        When school admin creates multiple choices question with "<answer>" answers
        Then school admin sees message "You have created a new question successfully"
        And school admin sees the newly created multiple choices question

        Examples:
            | answer      |
            | many        |
            | one         |
            | add more    |
            | delete some |

    Scenario Outline: School admin cannot create a multiple choices question with <field>
        When school admin creates multiple choices question with "<field>"
        Then school admin sees validation error on "<field>"

        Examples:
            | field             |
            | any empty answer  |
            | empty description |
            | all empty answers |
