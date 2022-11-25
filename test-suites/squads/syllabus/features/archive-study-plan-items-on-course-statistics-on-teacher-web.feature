@cms @teacher @learner @learner2 @learner3
@syllabus @course-statistics
@Syllabus_StudyPlan_CourseStatistic

Feature: Teacher archives study plan items on course statistics on teacher web

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
        Then teacher sees "archived" statistics of the course
        Examples:
            | number |
            | one    |
            | some   |
            | all    |

    #TCID:None
    @ignore
    Scenario: Teacher archives one study plan item of a student and one study plan item of all student
        Given students do a study plan item that requires grade
        # study plan item that requires grade = [non-LO-with-quizzes, Assignment-non-requires-grading, TaskAs-has-Correctness]
        And students do a study plan item that does not require grade
        # study plan item that requires grade = [LO with quizzes, Assignment-requires-grading, TaskAs-has-Correctness, Flashcard, Exam LO]
        And teacher is at studyplan detail screen of the "student 1"
        And teacher archives all study plan items
        And teacher is at studyplan detail screen of the "student 2"
        And teacher archives a study plan item
        When teacher is at course statistics
        Then teacher sees statistics of the course
        # statistics of the course = Topic average score, LO average score, Completed student
        And teacher sees statistics of each study plan item
    # statistics of each study plan item = list of students, score and status of the study plan item of each student

    #TCID:None
    @ignore
    Scenario: Teacher archives all study plan items for all students
        Given student does a study plan item that requires grade
        # study plan item that requires grade = [non-LO-with-quizzes, Assignment-non-requires-grading, TaskAs-has-Correctness]
        And student does a study plan item that does not require grade
        # study plan item that requires grade = [LO with quizzes, Assignment-requires-grading, TaskAs-has-Correctness, Flashcard, Exam LO]
        And teacher is at studyplan detail screen of the "student 1"
        And teacher archives all study plan items
        And teacher is at studyplan detail screen of the "student 2"
        And teacher archives all study plan items
        When teacher is at course statistics
        Then teacher sees statistics of the course
        # statistics of the course = Topic average score, LO average score, Completed student
        And teacher sees statistics of each study plan item
# statistics of each study plan item = list of students, score and status of the study plan item of each student