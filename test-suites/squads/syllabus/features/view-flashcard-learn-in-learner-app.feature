@cms @teacher @learner
@syllabus @flashcard @flashcard-common

Feature: View Flashcard Learn Screen

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "1 flashcard have 5 card" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0016,syl-0059,syl-0060
    Scenario: View Flashcard Learn screen
        Given student goes to Flashcard Detail screen
        When student selects learn button in Flashcard Detail screen
        Then student sees Flashcard Learn screen

    #TCID:syl-0265,syl-0266
    Scenario Outline: View Flashcard Learn screen after learning all cards with skipping <number> cards
        Given student has learned "all" cards in flashcard with skipping <number> cards
        And student has stopped learning flashcard
        And student goes to Flashcard Detail screen
        When student selects learn button in Flashcard Detail screen
        Then student sees Flashcard Learn screen

        Examples:
            | number |
            | 0      |
            | 1      |

    #TCID:syl-0274
    Scenario Outline: View Options Popup in Flashcard Learn Screen
        Given student goes to Flashcard Learn screen
        And student stands at card's position <number>
        When student selects options button in Flashcard Learn screen
        Then student sees Options Section in Flashcard Learn screen

        Examples:
            | number |
            | 0      |
            | 1      |

    #TCID:syl-0274
    Scenario: Can not view Options Button in Flashcard Learn Screen at finished card
        Given student goes to Flashcard Learn screen
        And student stands at the final card
        When student swipes right the card
        Then student does not see options button in Flashcard Learn screen