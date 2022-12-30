@cms @teacher @learner
@syllabus @flashcard @flashcard-common

Feature: Start Practice in Flashcard

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content have 5 card" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0301
    Scenario: Start practice at Flashcard Detail screen
        Given student goes to Flashcard Detail screen
        When student selects Test Button in Flashcard Detail Screen
        Then student sees detail screen of 1st question of Quiz

    #TCID:syl-0302,syl-0303
    Scenario: Start practice at flashcard detail screen at congratulations card
        Given student has learned "all" cards in flashcard with skipping 0 cards
        And student sees congratulations card in Flashcard Learn screen
        When student selects Test Button in Flashcard Learn Screen
        Then student sees detail screen of 1st question of Quiz

    #TCID:syl-0302,syl-0303
    Scenario: Start practice at flashcard detail screen at nice work card
        Given student has learned "all" cards in flashcard with skipping 1 cards
        And student sees nice work card in Flashcard Learn screen
        When student selects Test Button in Flashcard Learn Screen
        Then student sees detail screen of 1st question of Quiz

    #TCID:syl-0302,syl-0303
    Scenario: Start practice at flashcard detail screen at congratulations card with continue learning
        Given student has learned "all" cards in flashcard with skipping 5 cards
        And student has continued learning "all" cards in flashcard with skipping 0 cards
        And student sees congratulations card in Flashcard Learn screen
        When student selects Test Button in Flashcard Learn Screen
        Then student sees detail screen of 1st question of Quiz

    #TCID:syl-0302,syl-0303
    Scenario: Start practice at flashcard detail screen at nice work card with continue learning
        Given student has learned "all" cards in flashcard with skipping 5 cards
        And student has continued learning "all" cards in flashcard with skipping 1 cards
        And student sees nice work card in Flashcard Learn screen
        When student selects Test Button in Flashcard Learn Screen
        Then student sees detail screen of 1st question of Quiz