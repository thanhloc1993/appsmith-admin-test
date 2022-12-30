@cms @learner
@syllabus @grade-book
@Syllabus_StudyPlan_GradeBook_Learner_View

Feature: Student views grade book on Learner App
  Background:
    Given "school admin" logins CMS
    And "student" with course and enrolled status has logged Learner App
    And school admin has created a "content with 4 grade to pass LO exams and each has 3 questions" book
    And school admin has created a matched studyplan for student

  Scenario: Student views grade book list with correct format
    Given student has done some LO exams with ascending correct answers and retried 1 exam
    And student is at total progress page
    # check format of:  completed, passed, score, number of attempts, failed colour
    Then student views grade book list has correct data format in cells