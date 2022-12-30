@cms @teacher @learner @learner2
@syllabus @studyplan @studyplan-course

Feature: Create course studyplan in course

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student S1" logins Learner App
        And "student S2" logins Learner App
        And school admin has created a new course without any location
        And school admin has added student S1 and student S2 to the course

    #TCID:syl-0055
    @blocker
    Scenario: Create a study plan with a has 1 assignment book
        # TODO: update with data table when apply feature book
        Given school admin has created a "has 1 assignment" book
        When school admin creates a master study plan with "full" field
        Then school admin sees message "You have added study plan successfully!"
        And school admin sees the newly created master study plan in master detail page
        And school admin goes to the "course" study plan in the course detail
        And school admin sees a new matched studyplan created for master studyplan on CMS
        And school admin sees a new matched studyplan created for all students studyplan on CMS
        And all students do not see new studyplan items on Learner App
        And teacher sees a new matched studyplan created for all students on Teacher App
        And teacher does not see new studyplan items created for any student on Teacher App
