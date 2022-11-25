@cms @teacher @learner @learner2 @learner3
@syllabus @course-statistics
@staging

Feature: Teacher unarchives study plan items on course statistics on teacher app

    Background:
        Given "school admin" logins CMS
        And school admin has created a student "student S1" belong to "location"
        And school admin has created a student "student S2" belong to "location"
        And school admin has created a student "student S3" belong to "location"
        And school admin has created a "course" belong to "location" and "class"
        And school admin adds the "course" for "student S1" with "location" and "class"
        And school admin adds the "course" for "student S2" with "location" and "class"
        And school admin adds the "course" for "student S3" with "location" and "class"
        And school admin has created a "2 items each learning type" book "book"
        And school admin creates a matched studyplan "study plan" by "book" for "course"

    Scenario Outline: Teacher sees statistics when a study plan item is archived for students
        Given school admin has modified some study plan items to require and not require grade
        And "student S1" logins Learner App
        And "student S2" logins Learner App
        And "student S3" logins Learner App
        And students answers study plan item that requires grade
        And "teacher" logins Teacher App
        When teacher is at course statistics screen of "course"
        And teacher goes to study plan item detail screen
        And teacher archives "<number>" student
        And teacher unarchives "<number>" student
        Then teacher sees "active" statistics of the course
        Examples:
            | number |
            | one    |
            | some   |
            | all    |