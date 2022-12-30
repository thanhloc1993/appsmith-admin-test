@cms
@cms-syllabus-integration
@syllabus @book

Feature: [Integration] School admin edits book

    Background:
        Given "school admin" logins CMS
        And school admin has created a "empty" book
        And school admin is at book detail page

    #TCID:syl-0990
    Scenario: School admin edits book
        When school admin edits book
        Then school admin sees message "You have updated book successfully"
        And school admin sees the edited book in book detail page

    #TCID:syl-0991
    Scenario Outline:  School admin cannot edit book with missing <field>
        When school admin edits book with missing "<field>"
        Then school admin cannot edit book
        Examples:
            | field |
            | name  |
