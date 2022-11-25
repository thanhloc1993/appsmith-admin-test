@cms @teacher @learner
@syllabus @task-assignment @task-assignment-common @staging

Feature: Create task assignment on Learner E2E
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a course for student

    #TCID:syl-0952
    Scenario: Student create task assignment for 1 of 2 courses
        Given school admin has created a course 2 for student
        When student creates task assignment with full required fields in course 1
        Then school admin sees new individual study plan created with name is student name's To-do in course 1
        And school admin doesn't see new individual study plan in course 2
        And school admin sees detailed book from study plan with book name, chapter name, topic name is student name's To-do
        And teacher sees a new study plan with the name is student name's To-do in course 1
        And teacher views detailed task assignment created by student with all required items
        And teacher doesn't see any new study plan of course 2
        And student sees created task assignment detail with all required items
