@cms @learner
@syllabus @task-assignment @task-assignment-common
@staging

Feature: School admin views student's ad-hoc book

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a course for student

    #TCID:syl-0959
    Scenario: School Admin cannot edit student's ad-hoc book
        When student creates 2 task assignments on learner app
        Then school admin sees the auto-generated study plan of "student" in individual tab
        And school admin sees the auto-generated book of "student" in study plan detail
        And school admin cannot edit the auto-generated book of "student"
        And school admin cannot move 2 task assignments