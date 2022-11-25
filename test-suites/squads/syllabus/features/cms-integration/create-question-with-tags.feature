@cms
@syllabus @question-v2 @staging
@cms-syllabus-integration

Feature: [Integration] Create question with tags

  Background:
    Given "school admin" logins CMS
    And school admin has created a "simple content with 1 LO learning" book
    And school admin goes to book detail page
    And school admin goes to create question page in "learning objective"

  Scenario Outline: School admin creates question with tags
    When school admin creates "<type>" question with tags
    Then school admin sees message "You have created a new question successfully"
    And school admin sees tags in the question preview

    Examples:
      | type                                                                     |
      | 1 of [multiple choice, fill in the blank, manual input, multiple answer] |
