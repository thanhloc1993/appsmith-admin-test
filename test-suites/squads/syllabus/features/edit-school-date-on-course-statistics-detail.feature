@cms @teacher @learner @learner2 @learner3
@syllabus @studyplan @studyplan-item-teacher-edit
@staging

Feature: Teacher edits school date for students
    Background:
        Given "school admin" logins CMS
        And school admin has created a student "student S1" belong to "location"
        And school admin has created a student "student S2" belong to "location"
        And school admin has created a student "student S3" belong to "location"
        And school admin has created a "course" belong to "location" and "class"
        And school admin adds the "course" for "student S1" with "location" and "class"
        And school admin adds the "course" for "student S2" with "location" and "class"
        And school admin adds the "course" for "student S3" with "location" and "class"
        And school admin has created a "simple content without quiz" book "book"
        And "teacher" logins Teacher App

    Scenario Outline: Teacher edits school date for one or multi students
        Given school admin creates a matched studyplan "study plan" by "book" "with" track school progress for "course"
        And "student S1" logins Learner App
        And "student S2" logins Learner App
        And "student S3" logins Learner App
        When teacher is at course statistics screen of "course"
        And teacher goes to course statistics detail
        And teacher edits school date for "<number>" students
        Then teacher sees the school date has been edited

        Examples:
            | number |
            | one    |
            | some   |
            | all    |