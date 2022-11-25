@cms @cms-syllabus-integration @syllabus @exam-lo @staging

Feature: [Integration] Create exam with manual grading

  Background:
    Given "school admin" logins CMS
    And school admin has created a "has chapter and topic only" book

  Scenario: School admin creates exam with manual grading setting
    Given school admin is at book detail page
    When school admin creates exam with manual grading setting is "1 of [on, off]"
    Then school admin sees message of creating successfully
    And school admin sees the created exam with manual grading in CMS
