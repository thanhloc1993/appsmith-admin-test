@cms
@cms-syllabus-integration
@syllabus @book

Feature: [Integration] School admin creates book

    Background:
        Given "school admin" logins CMS
        And school admin is at book page

    #TCID:syl-0001
    Scenario: School admin creates an empty book
        When school admin creates a book
        Then school admin sees message "You have created a new book successfully"
        And school admin sees a new empty book on CMS

    #TCID:syl-0962
    Scenario Outline:  School admin cannot create book with missing <field>
        When school admin creates a book with missing "<field>"
        Then user cannot create any book
        Examples:
            | field |
            | name  |
