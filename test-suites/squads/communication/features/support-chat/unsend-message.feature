@cms @teacher @learner
@parent @communication
@support-chat

Feature: unsend message in chat

  Background:
    Given "school admin" logins CMS
    And school admin has created a student "student" with "1 parents", "0 visible courses"
    And "teacher" logins Teacher App
    And "teacher" has filtered location in location settings on Teacher App with student locations
    And "student" logins Learner App
    And "parent P1" of "student" logins Learner App
    And "teacher" is at the conversation screen on Teacher App
    And "student, parent P1" is at the conversation screen on Learner App
    And "teacher" joined "student" group chat and "parent P1" group chat successfully

  Scenario Outline: <sender> unsend "<messageType>" message
    Given "<sender>" has sent "<messageType>" message to "<receiver>"
    When "<sender>" unsend the "<messageType>" message
    Then "<sender>" sees "<messageType>" message changes to deleted
    And "<receiver>" sees "<messageType>" message changes to deleted

    Examples:
      | sender  | receiver | messageType |
      | teacher | parent   | text        |
      | teacher | student  | text        |
      | student | teacher  | pdf         |
      | parent  | teacher  | image       |
