@cms
@cms-syllabus-integration
@syllabus @flashcard

Feature: [Integration] Move card in the flashcard in CMS

    Background:
        Given "school admin" logins CMS
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content have 5 card" book
        And school admin is at book detail page
        And school admin goes to the flashcard detail page

    #TCID:syl-0044
    Scenario Outline: Move card inside a flashcard
        When the card is not at "<position>"
        Then school admin moves card "<direction>"
        And school admin sees message "You have moved item successfully"
        And school admin sees card is moved "<direction>" on CMS

        Examples:
            | position | direction |
            | top      | up        |
            | bottom   | down      |
