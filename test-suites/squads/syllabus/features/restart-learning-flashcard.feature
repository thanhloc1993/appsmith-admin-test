@cms @teacher @learner
@syllabus @flashcard @flashcard-common

Feature: Restart learning Flashcard in Flashcard Learn

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content have 5 card" book
        And school admin has created a matched studyplan for student

    #"student sees Flashcard Learn screen" already check 1st card as default definition type
    #TCID:syl-0291
    Scenario Outline: Restart learning Flashcard after learning <number> cards
        Given student has learned "<number>" cards in flashcard with skipping 0 cards
        And student opens Options section in Flashcard Learn screen
        When student selects restart learning in Flashcard Learn Screen
        Then student sees Flashcard Learn screen

        Examples:
            | number   |
            | one      |
            | multiple |
    
    #TCID:syl-0292
    Scenario: Restart learning Flashcard after learning all cards
        Given student has learned "all" cards in flashcard with skipping 0 cards
        And student sees congratulations card in Flashcard Learn screen
        When student selects restart learning in Flashcard Learn Screen
        Then student sees Flashcard Learn screen
        And teacher sees student's flashcard result is still displayed as completed