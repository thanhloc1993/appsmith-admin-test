@cms @teacher @learner @learner2
@syllabus @course-statistics
@Syllabus_StudyPlan_CourseStatistic

Feature: Teacher sees statistics of study plan items on course statistics on teacher web
    Background:
        Given "school admin" logins CMS
        And school admin has created a student "student S1" belong to "location"
        And school admin has created a student "student S2" belong to "location"
        And school admin has created a "course" belong to "location" and "class"
        And school admin adds the "course" for "student S1" with "location" and "class"
        And school admin adds the "course" for "student S2" with "location" and "class"
        And "student S1" logins Learner App
        And "student S2" logins Learner App

    #TCID:syl-0638,syl-0639
    @blocker
    Scenario: Teacher sees statistics of study plan items
        Given school admin has created a "2 items each learning type" book "book"
        And school admin creates a matched studyplan "study plan" by "book" for "course"
        And school admin has modified some study plan items to require and not require grade
        And students do a study plan item that requires grade
        # study plan item that requires grade = [LO with quizzes, Assignment-requires-grading, TaskAs-has-Correctness, Flashcard, Exam LO]
        And students do a study plan item that does not require grade
        # study plan item that not require grade = [non-LO-with-quizzes, Assignment-non-requires-grading, TaskAs-has-Correctness]
        And "teacher" logins Teacher App
        When teacher is at course statistics screen of "course"
        Then teacher sees statistics of the course
        # statistics of the course = Topic average score, LO average score, Completed student
        And teacher sees statistics of each study plan item
# statistics of each study plan item = list of students, score and status of the study plan item of each student
