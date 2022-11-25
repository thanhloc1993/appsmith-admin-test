@cms @teacher @learner
@syllabus @flashcard @flashcard-common

Feature: Flip card in Flashcard

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content have 5 card" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0263
    Scenario: Flip card in Flashcard Detail List
        Given student goes to Flashcard Detail screen
        And the toggle is showing "term"
        When student flips the card
        Then student sees the "definition" of that card
        And student can not see the "definition" of other cards

    #TCID:syl-0263
    Scenario: Flip card in Flashcard Detail List with definition toggle
        Given student goes to Flashcard Detail screen
        And the toggle switches to "definition"
        When student flips the card
        Then student sees the "term" of that card
        And student can not see the "term" of other cards

    #TCID:syl-0264
    Scenario Outline: Flip card in Flashcard Learn Screen
        Given student goes to Flashcard Learn screen
        And student stands at card's position <number>
        And the card is showing "definition"
        When student flips the card
        Then student sees the "term" of that card

        Examples:
            | number |
            | 0      |
            | 2      |

    #TCID:syl-0264
    Scenario Outline: Flip card in Flashcard Learn Screen in second flip
        Given student goes to Flashcard Learn screen
        And student stands at card's position <number>
        And the card flips to "term"
        When student flips the card
        Then student sees the "definition" of that card

        Examples:
            | number |
            | 0      |
            | 2      |