@cms @cms-syllabus-integration @syllabus @exam-lo @staging

Feature: [Integration] Edit exam with manual grading

  Background:
    Given "school admin" logins CMS
    And school admin has created a "simple content with 1 LO exam" book
    And school admin goes to book detail page

  Scenario: School admin edit exam with manual grading setting
    Given school admin goes to exam LO edit page
    Then school admin sees manual grading setting is disabled
