@cms @learner @teacher
@syllabus @flashcard @flashcard-common

Feature: Move card in the flashcard

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 5
        And school admin has created a "simple content have 5 card" book
        And school admin has created a matched studyplan for student
        And school admin is at book detail page
        And school admin goes to the flashcard detail page

    #TCID:syl-0093
    Scenario Outline: Move card inside a flashcard
        When the card is not at "<position>"
        Then school admin moves card "<direction>"
        And school admin sees message "You have moved item successfully"
        And school admin sees card is moved "<direction>" on CMS
        And student goes to Flashcard Detail screen
        And student sees card is moved "<direction>" in Flashcard Detail screen
        And teacher sees card is moved "<direction>" on Teacher App

        Examples:
            | position | direction |
            | top      | up        |
            | bottom   | down      |
