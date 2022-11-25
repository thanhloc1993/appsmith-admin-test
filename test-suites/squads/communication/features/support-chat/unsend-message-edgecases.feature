@cms @teacher @learner @parent @communication @support-chat @ignore
Feature: unsend message in chat for edge cases

  Background: 
    Given "school admin" logins CMS
    And school admin has created "student" with grade and "parent" info
    And "teacher" logins Teacher App
    And "student" logins Learner App
    And "parent P1" of "student" logins Learner App
    And "teacher" join group chat of "student"
    And "teacher" join group chat of "parent"

  Scenario Outline: Teacher unsend message when <receiver> have not read them
    Given "teacher" in chat
    And "teacher" sends message
    And "<receiver>" have not read message
    When "teacher" unsend message
    Then "teacher" sees message change to unsend
    And "<receiver>" sees unsend message display under chat group

    Examples: 
      | receiver |
      | student  |
      | parent   |

  Scenario Outline: <sender> unsend fail message
    Given "<sender>" in chat
    And "<sender>" sends message
    And the network is down
    When "<sender>" unsend message
    Then "<sender>" sees error of unsend fail message
    And "<receiver>" still see message

    Examples: 
      | sender  | receiver |
      | teacher | teacher  |
      | student | student  |
      | parent  | parent   |

  Scenario Outline: <receiver> cannot unsend message of <sender>
    Given "<sender>" in chat
    When "<sender>" sends text message
    And "<receiver>" try to unsend text message
    Then "<receiver>" cannot unsend text message

    Examples: 
      | sender  | receiver |
      | teacher | teacher  |
      | student | student  |
      | parent  | parent   |
