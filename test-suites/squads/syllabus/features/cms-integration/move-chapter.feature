@cms
@cms-syllabus-integration
@syllabus @book

Feature: [Integration] School admin movers chapter integration test

    Background:
        Given "school admin" logins CMS
        And school admin has created a "has 2 chapter" book
        And school admin goes to book detail page

    #TCID:syl-0040
    Scenario Outline: School admin moves chapter <direction>
        Given school admin selects a chapter is not at "<position>"
        When school admin moves chapter "<direction>"
        Then school admin sees message "You have moved item successfully"
        And school admin sees that chapter is moved "<direction>" on CMS

        Examples:
            | position | direction |
            | top      | up        |
            | bottom   | down      |
