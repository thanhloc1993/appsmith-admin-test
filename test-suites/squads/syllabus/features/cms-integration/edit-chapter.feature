@cms
@cms-syllabus-integration
@syllabus @book

Feature: [Integration] School admin edits chapter

    Background:
        Given "school admin" logins CMS
        And school admin has created a "1 empty chapter" book
        And school admin is at book detail page

    #TCID:syl-0994
    Scenario: School admin edits chapter
        When school admin edits chapter name
        Then school admin sees message "You have updated chapter successfully"
        And school admin sees the edited chapter name on CMS

    #TCID:syl-0995
    Scenario Outline:  School admin cannot edit chapter with missing <field>
        When school admin edits chapter with missing "<field>"
        Then school admin cannot edit chapter
        Examples:
            | field |
            | name  |
