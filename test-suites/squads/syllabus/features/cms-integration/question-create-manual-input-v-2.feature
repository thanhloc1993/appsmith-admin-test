@cms
@syllabus
@cms-syllabus-integration
@question-v2 @staging

Feature: [Integration] Create the manual input question integration v2

    Background:
        Given "school admin" logins CMS
        And school admin has created a "has 1 learning objective" book
        And school admin goes to book detail page
        And school admin goes to create question v2 page

    Scenario: School admin can create a question with the manual input question type
        When school admin creates a manual input question v2
        Then school admin sees message "You have created a new question successfully"
        And school admin will sees the newly created manual input question

    Scenario Outline: School admin cannot create a question because required <field> is missing
        When school admin creates a manual input question v2 with empty "<field>"
        Then school admin sees error on missing "<field>"

        Examples:
            | field       |
            | question    |
            | explanation |
