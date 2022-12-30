@cms
@cms-syllabus-integration
@syllabus @book

Feature: [Integration] School admin creates chapter

    Background:
        Given "school admin" logins CMS

    #TCID:syl-0003
    Scenario: School admin creates a chapter in an empty book
        Given school admin has created a "empty" book
        And school admin is at book page
        And school admin is at book detail page
        When school admin creates a new chapter in book
        Then school admin sees message "You have added chapter successfully"
        And school admin sees the new chapter on CMS

    #TCID:syl-0003
    Scenario: School admin creates a chapter in a book already has chapters
        Given school admin has created a "1 empty chapter" book
        And school admin is at book page
        And school admin is at book detail page
        When school admin creates a new chapter in book
        Then school admin sees message "You have added chapter successfully"
        And school admin sees the new chapter on CMS

    #TCID:syl-0004
    Scenario Outline:  School admin cannot create chapter with missing <field>
        Given school admin has created a "empty" book
        And school admin is at book page
        And school admin is at book detail page
        When school admin creates a chapter with missing "<field>" in book
        Then school admin cannot create any chapter
        Examples:
            | field |
            | name  |
