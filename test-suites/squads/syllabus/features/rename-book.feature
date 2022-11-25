@cms @teacher @learner
@syllabus @studyplan @studyplan-book

Feature: Rename book

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a content book B1
    
    #TCID:syl-0062
    Scenario: Rename book (case:1 studyplan has 1 book)
        Given school admin has created a matched studyplan P1 for student
        # "matched studyplan" = a studyplan which exactly matches with book content
        When school admin renames book B1
        Then school admin sees the edited book B1 name on CMS
        And teacher does not see the edited book B1 name on Teacher App
        And student does not see the edited book B1 name on Learner App
    
    #TCID:syl-0063
    Scenario: Rename book (case:each studyplan has 1 book)
        Given school admin has created a matched studyplan P1 for student
        And school admin has created content book B3
        And school admin has created a matched studyplan P3 for student in the same course
        When school admin renames book B1
        Then school admin sees the edited book B1 name on CMS
        And teacher does not see the edited book B1 name on Teacher App
        And student sees the edited book B1 name on Learner App