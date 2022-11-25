@cms @teacher @learner
@syllabus @flashcard @flashcard-common

Feature: Resume Flashcard Learn

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content have 5 card" book
        And school admin has created a matched studyplan for student
    
    #TCID:syl-0267
    Scenario Outline: Resume Flashcard Learn screen after learning <number> card
        Given student has learned "<number>" cards in flashcard with skipping 0 cards
        And student has stopped learning flashcard
        And student goes to Flashcard Detail screen
        When student selects learn button in Flashcard Detail screen
        Then student sees next card in Flashcard Learn screen
        And student can learn the rest of cards in Flashcard Learn screen

        Examples:
            | number   |
            | one      |
            | multiple |
    
    #TCID:syl-0268
    Scenario: Resume Flashcard Learn screen with continue learning mode
        Given student has learned "all" cards in flashcard with skipping 2 cards
        And student has continued learning "one" cards in flashcard with skipping 0 cards
        And student has stopped learning flashcard
        And student goes to Flashcard Detail screen
        When student selects learn button in Flashcard Detail screen
        Then student sees next card in Flashcard Learn screen
        And student can learn the rest of cards in Flashcard Learn screen
