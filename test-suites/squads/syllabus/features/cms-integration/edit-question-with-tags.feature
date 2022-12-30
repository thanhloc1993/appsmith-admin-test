@cms
@syllabus @question-v2 @staging
@cms-syllabus-integration

Feature: [Integration] Edit question with tags

  Background:
    Given "school admin" logins CMS
    And school admin has created a "simple content with 1 LO exam has 1 question" book
    And school admin goes to book detail page
    And school admin goes to the LO "exam LO" detail page

  Scenario: School admin edits tags in question
    When school admin edits tags in question
    Then school admin sees message "You have updated question successfully"
    And school admin sees tags in the question preview
