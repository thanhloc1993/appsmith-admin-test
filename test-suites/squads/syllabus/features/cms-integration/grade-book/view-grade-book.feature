@cms
@cms-syllabus-integration
@syllabus @grade-book
@staging

Feature: [Integration] School admin views grade book in CMS
  Scenario: School admin sees empty grade book list when student course has no study plan
    Given "school admin" logins CMS
    And school admin has created student with course and enrolled status
    When school admin is at grade book page
    Then school admin doesn't see student on grade book
