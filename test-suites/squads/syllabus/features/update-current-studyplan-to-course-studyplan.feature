@cms @teacher @learner @learner2
@syllabus @studyplan @studyplan-course
@staging
@ignore

Feature: Update current studyplan (after editing) to 2 course's studyplans

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student S1" logins Learner App
        And "student S2" logins Learner App
        And school admin has created 2 new courses
        And school admin has added "student S1" to course C1
        And school admin has added "student S2" to course C2
        And school admin has created a content book
        And school admin has created a matched studyplan P1 for "student S1"
        And school admin has created a matched studyplan P2 for "student S2"

    #TCID:syl-0229
    Scenario: Update current studyplan (after editing) to 2 course's studyplans
        Given school admin downloads the studyplan P1 from course C1
        And school admin modifies some studyplan items
        When school admin updates the modified studyplan to studyplan P1 in course C1
        And school admin updates the modified studyplan to studyplan P2 in course C2
        Then school admin sees a modified studyplan created for course C1 on CMS
        And school admin sees a same modified studyplan created for course C2 on CMS
        And all students see modified available studyplan items on Learner App
        And all students do not see modified unavailable studyplan items on Learner App
        And teacher sees modified available studyplan items created for all students on Teacher App
        And teacher does not see modified unavailable studyplan items created for any student on Teacher App
