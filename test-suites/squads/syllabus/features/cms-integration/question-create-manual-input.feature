@cms
@syllabus
@cms-syllabus-integration
@question
@ignore

Feature: [Integration] Create the manual input question integration

    Background:
        Given "school admin" logins CMS
        And school admin has created a "simple content with 1 LO learning" book
        And school admin goes to book detail page
        And school admin goes to create question page

    Scenario: School admin can create a question with the manual input question type
        When school admin creates a manual input question
        Then school admin sees message "You have created a new question successfully"
        And school admin will sees the newly created manual input question

    Scenario Outline: School admin cannot create a question because required <field> is empty
        When school admin creates a manual input question with missing "<field>"
        Then school admin cannot create any question

        Examples:
            | field       |
            | question    |
            | explanation |
