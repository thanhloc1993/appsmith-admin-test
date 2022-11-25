@cms @learner @teacher
@syllabus @question @question-common @question-v2

Feature: Create and view question and question group on Learner And Teacher

  Background:
    Given "school admin" logins CMS
    And "student" logins Learner App
    And "teacher" logins Teacher App
    And school admin has created a "simple content with 2 LO learning, exam" book
    And school admin has created a matched studyplan for student
    And school admin goes to book detail page

  Scenario Outline: Student can see new <LOType> question and question group
    Given school admin goes to the LO "<LOType>" detail page
    When school admin creates question and question group detail in "<LOType>"
      | groupType           | questionList                                                           |
      | group               | fill in the blank, fill in the blank, multiple choice, multiple answer |
      | individual question | multiple choice                                                        |
      | group               | empty                                                                  |
      | group               | fill in the blank                                                      |
    Then school admin sees new question group list created in "<LOType>"
    And student sees the new question and question group on Learner App with "<LOType>"

    Examples:
      | LOType             |
      | learning objective |
      | exam LO            |

  Scenario Outline: Teacher can see new <LOType> question and question group
    Given school admin goes to the LO "<LOType>" detail page
    And school admin creates question and question group detail in "<LOType>"
      | groupType           | questionList                                                           |
      | group               | fill in the blank, fill in the blank, multiple choice, multiple answer |
      | individual question | multiple choice                                                        |
      | group               | empty                                                                  |
      | group               | fill in the blank                                                      |
    When student go to the "<LOType>"
    And student finish the "<LOType>"
    And teacher go to the student submission with "<LOType>"
    Then teacher sees the question and question group on Teacher App display correctly

    Examples:
      # TODO: add exam LO type for this scenario when we apply group of questions for manual grading
      | LOType             |
      | learning objective |
