@cms @teacher @learner
@syllabus @studyplan @studyplan-item-view

Feature: Teacher expand/collapse a topic
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a content book
        And school admin has created a matched studyplan for student
        And teacher is at student's studyplan detail screen

    #TCID:None
    Scenario: Teacher collapse a topic
        When teacher collapses a topic
        Then teacher sees the topic name
        And teacher sees the progress of the topic
        And teacher does not see the topic's studyplan items

    #TCID:None
    Scenario: Teacher expands a topic
        Given teacher collapses a topic
        When teacher expands a topic
        Then teacher sees the topic name
        And  teacher sees the progress of the topic
        And teacher sees the topic's studyplan items