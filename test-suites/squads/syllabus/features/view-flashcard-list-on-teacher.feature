@cms @teacher @learner
@syllabus @flashcard @flashcard-common

Feature: View Flashcard list on Teacher App

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "1 flashcard have 5 card" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0059,syl-0060.,syl-0061
    Scenario: View Flashcard detail in topic
        Given school admin sees flashcard list has been created on CMS
        When teacher goes to study plan management screen on Teacher App
        And teacher goes to flashcard details screen
        Then teacher sees flashcard status "incomplete" and total card count
        And teacher sees details of cards and theirs order matches on CMS