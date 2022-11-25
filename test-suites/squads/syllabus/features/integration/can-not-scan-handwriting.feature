@cms @learner @syllabus @question @question-handwriting @Syllabus_Quiz_Mobile_Handwriting
Feature: Failed to scan handwriting to answer fill in the blank questions

  Background:
    Given "school admin" logins CMS
    And "student" logins Learner App
    And school admin has created a "simple content with multiple handwriting answers" book
    And school admin has created a matched studyplan for student
    And student has gone to "1 of [learning objective, exam LO]"
    
  #TCID:syl-0987,syl-0988
  Scenario Outline: Fail to scan handwriting with sketch is <sketched_type>
    Given student chooses the answer enabled handwriting
    When student enters handwriting mode
    And student sketches the answer by "<sketched_type>" on the whiteboard
    And student scans the handwriting
    Then student sees error message
    And student sees the answer doesn't fill

    Examples:
      | sketched_type |
      | Empty         |
      | Meaningless   |
