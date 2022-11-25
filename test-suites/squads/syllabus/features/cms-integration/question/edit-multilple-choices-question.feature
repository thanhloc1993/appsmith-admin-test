@cms
@syllabus
@cms-syllabus-integration
@question

Feature: [Integration] School admin edits the multiple choices question

    Background:
        Given "school admin" logins CMS
        And school admin has created a "has 1 multiple choices question in LO" book
        And school admin goes to book detail page
        And school admin goes to LO detail page

    # In this scenario will cover random pick correct answer, random delete/add more answer, random update other information
    Scenario: School admin can edits a multiple choices question
        When school admin edits a multiple choices question
        Then school admin sees message "You have updated question successfully"
        And school admin sees that multiple choices question updated

    Scenario Outline: School admin can't edit multiple choices question with <invalidAction>
        When school admin edits a multiple choices question with invalid action "<invalidAction>"
        Then school admin cannot update that multiple choices question

        Examples:
            | invalidAction                                                    |
            | 1 of [empty description]                                         |
            | 1 of [all empty answers, any empty answer, add new empty answer] |
