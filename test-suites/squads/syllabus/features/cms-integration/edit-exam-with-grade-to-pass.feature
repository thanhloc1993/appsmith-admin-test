@cms @cms-syllabus-integration @syllabus @exam-lo @staging

Feature: [Integration] Edit exam with grade to pass

  Background:
    Given "school admin" logins CMS
    And school admin has created a "simple content with 1 LO exam" book
    And school admin goes to book detail page

  Scenario: School admin edits exam with grade to pass setting
    Given school admin goes to exam LO edit page
    When school admin edits exam with grade to pass setting is "1 of [null, 1, 50000, 99999]"
    And school admin sees exam detail with grade to pass in CMS

  Scenario: School admin edits exam with invalid grade to pass setting
    Given school admin goes to exam LO edit page
    When school admin edits exam with grade to pass setting is "1 of [0, 100000]"
    Then school admin sees error message under grade to pass input field
