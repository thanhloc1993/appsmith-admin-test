@cms @teacher @learner
@syllabus @flashcard @flashcard-common

Feature: Go back previous card in Flashcard Learn

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content have 5 card" book
        And school admin has created a matched studyplan for student

    #TCID:None
    Scenario Outline: View go back button in Flashcard Learn screen after learning <number> cards
        Given student goes to Flashcard Learn screen
        And student stands at card's position <number>
        Then student sees bottom back button is "<status>" in Flashcard Learn Screen

        Examples:
            | number | status   |
            | 0      | disabled |
            | 2      | enabled  |

    #TCID:None
    Scenario Outline: View go back button in Flashcard Learn screen after continued learning <number> skipping cards
        Given student has learned "all" cards in flashcard with skipping 5 cards
        And student continues learning and stands at card's position <number>
        Then student sees bottom back button is "<status>" in Flashcard Learn Screen

        Examples:
            | number | status   |
            | 0      | disabled |
            | 2      | enabled  |

    #TCID:syl-0276
    Scenario: View go back button in Flashcard Learn screen after learning all cards
        Given student has learned "all" cards in flashcard with skipping 0 cards
        And student sees congratulations card in Flashcard Learn screen
        Then student sees bottom back button is "disappeared" in Flashcard Learn Screen

    #TCID:syl-0275
    Scenario: View go back button in Flashcard Learn screen after learning all cards with skipping 1 cards
        Given student has learned "all" cards in flashcard with skipping 1 cards
        And student sees nice work card in Flashcard Learn screen
        Then student sees bottom back button is "disappeared" in Flashcard Learn Screen

    #TCID:syl-0277
    Scenario Outline: Go back previous card in Flashcard Learn screen after learning <number> cards
        Given student goes to Flashcard Learn screen
        And student stands at card's position <number>
        When student selects go back previous card button in Flashcard Learn Screen
        Then student sees card at position <previous number>
        And student sees progress bar show progress <number> with total cards

        Examples:
            | number | previous number |
            | 1      | 0               |
            | 2      | 1               |

    #TCID:syl-0278
    Scenario Outline: Go back previous card in Flashcard Learn screen after continued learning <number> skipping cards
        Given student has learned "all" cards in flashcard with skipping 5 cards
        And student continues learning and stands at card's position <number>
        When student selects go back previous card button in Flashcard Learn Screen
        Then student sees card at position <previous number>
        And student sees progress bar show progress <number> with total skipping cards

        Examples:
            | number | previous number |
            | 1      | 0               |
            | 2      | 1               |