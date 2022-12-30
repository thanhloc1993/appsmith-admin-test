@cms @teacher @learner
@syllabus @flashcard @flashcard-common

Feature: Continue learning Flashcard in Flashcard Learn

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content have 5 card" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0289
    Scenario Outline: Continue learning Flashcard after learning all cards with skip <number> card
        Given student has learned "all" cards in flashcard with skipping <number> cards
        And student sees nice work card in Flashcard Learn screen
        When student selects continue learning in Flashcard Learn Screen
        Then student sees Flashcard Learn screen
        And student sees new card set with <number> skipping cards from the latest learning attempt
        And student learns new card set with <number> skipping cards from the latest learning attempt

        Examples:
            | number |
            | 1      |
            | 2      |
