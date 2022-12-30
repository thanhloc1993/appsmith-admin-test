@cms @learner
@syllabus @grade-book @grade-book-view
@staging

Feature: School admin views grade book in CMS
  Background:
    Given "school admin" logins CMS
    And "student" with course and enrolled status has logged Learner App
    And school admin has created a "content with 4 grade to pass LO exams and each has 3 questions" book
    And school admin has created a matched studyplan for student

  Scenario: School admin sees grade book list with correct format
    Given student has done some LO exams with ascending correct answers and retried 1 exam
    When school admin is at grade book page
    Then school admin sees grade book list has correct data formats
