@cms @teacher @learner
@syllabus @flashcard @flashcard-common

Feature: Switch card list view and card view in Flashcard by toggle

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content have 5 card" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0261
    Scenario: Switch card list view to "Definition" in Flashcard Detail Screen
        Given student goes to Flashcard Detail screen
        And the toggle is showing "term"
        When student switches the toggle to "definition"
        Then student sees flashcard list show "definition"

    #TCID:syl-0261
    Scenario: Switch card list view to "Term" in Flashcard Detail Screen
        Given student goes to Flashcard Detail screen
        And the toggle switches to "definition"
        When student switches the toggle to "term"
        Then student sees flashcard list show "term"

    #TCID:syl-0262
    Scenario: Switch card view to "Term" in Flashcard Learn Screen
        Given student goes to Flashcard Learn screen
        And student opens Options section in Flashcard Learn screen
        And the toggle is showing "definition"
        When student switches the toggle to "term"
        Then student sees the "term" of that card

    #TCID:syl-0262
    Scenario: Switch card view to "Definition" in Flashcard Learn Screen
        Given student goes to Flashcard Learn screen
        And student opens Options section in Flashcard Learn screen
        And the toggle switches to "term"
        When student switches the toggle to "definition" in Options section
        Then student sees the "definition" of that card