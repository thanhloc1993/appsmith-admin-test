@cms
@syllabus
@cms-syllabus-integration
@question

Feature: [Integration] School admin edits the manual input question

    Background:
        Given "school admin" logins CMS
        And school admin has created a "has 1 manual input question in LO" book
        And school admin goes to book detail page
        And school admin goes to LO detail page

    Scenario: School admin can edits a manual input question
        When school admin edits a manual input question
        Then school admin sees message "You have updated question successfully"
        And school admin sees that manual input question updated

    Scenario Outline: School admin cannot edit manual input question with <invalidAction>
        When school admin edits a manual input question with invalid action "<invalidAction>"
        Then admin sees the validated message of "<invalidAction>" when editing the manual input question

        Examples:
            | invalidAction                               |
            | missing description and missing explanation |
