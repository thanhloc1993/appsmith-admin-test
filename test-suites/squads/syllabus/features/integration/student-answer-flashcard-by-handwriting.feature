@cms @learner
@flashcard @flashcard-common
@staging

Feature: Student answer flashcard by handwriting

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "1 flashcard with some handwriting cards" book
        And school admin has created a matched studyplan for student
        And student goes to Flashcard Detail screen
        And student selects Test Button in Flashcard Detail Screen

    Scenario: Student answer flashcard by handwriting
        When student answer flashcard by handwriting
        Then student sees all cards submitted
        And student sees the learning progress screen
