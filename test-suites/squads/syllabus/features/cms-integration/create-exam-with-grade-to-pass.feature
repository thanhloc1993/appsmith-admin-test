@cms @cms-syllabus-integration @syllabus @exam-lo @staging

Feature: [Integration] Create exam with grade to pass

  Background:
    Given "school admin" logins CMS
    And school admin has created a "has chapter and topic only" book

  Scenario: School admin creates exam with grade to pass setting
    Given school admin is at book detail page
    When school admin creates exam with grade to pass setting is "1 of [null, 1, 50000, 99999]"
    Then school admin sees message of creating successfully
    And school admin sees exam detail with grade to pass in CMS

  Scenario: School admin creates exam with invalid grade to pass setting
    Given school admin is at book detail page
    When school admin creates exam with grade to pass setting is "1 of [0, 100000]"
    Then school admin sees error message under grade to pass input field
