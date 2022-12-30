@cms @learner
@entry-exit @adobo
@staging

Feature:  Generate QR Code for student in learner app
  Background:
    Given "school admin" logins CMS

  Scenario Outline: Generate QR Code for <status> student
    And "school admin" has created "student" with "<status>" status and parent info
    And "student" logins Learner App
    Then "student" sees QR Code has been generated
    Examples:
      | status    |
      | Enrolled  |
      | Potential |
      | LOA       |
      | Withdrawn |
      | Graduated |
