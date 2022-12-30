
@cms @cms-syllabus-integration @syllabus @exam-lo @staging

Feature: [Integration] Edit exam with showing answer keys setting

  Background:
    Given "school admin" logins CMS
    And school admin has created a "simple content with 1 LO exam" book
    And school admin goes to book detail page

  Scenario: School admin edit exam with showing answer keys setting
    Given school admin goes to exam LO edit page
    When school admin edits exam with showing answer keys setting is "1 of [immediately, after due date]"
    Then school admin sees the exam with showing answer keys setting in CMS
