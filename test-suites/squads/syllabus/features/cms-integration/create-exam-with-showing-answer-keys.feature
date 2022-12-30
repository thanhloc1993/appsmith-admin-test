@cms @cms-syllabus-integration @syllabus @exam-lo @staging

Feature: [Integration] Create exam with showing answer keys setting

  Background:
    Given "school admin" logins CMS
    And school admin has created a "has chapter and topic only" book

  Scenario: School admin creates exam with showing answer keys setting
    Given school admin is at book detail page
    When school admin creates exam with showing answer keys setting is "1 of [immediately, after due date]"
    Then school admin sees message of creating successfully
    And school admin sees the exam with showing answer keys setting in CMS
