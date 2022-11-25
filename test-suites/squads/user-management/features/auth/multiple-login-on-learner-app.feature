@learner @parent @user @login @ignore
Feature: Multiple login on Learner App

  Background: 
    Given school admin has created a "student 1" with "parent 1" info
    And school admin has created a "student 2" with "parent 2" info

  @blocker
  Scenario Outline: Able to add more account
    Given "<user_1>" logins on Learner App
    When "<user_1>" adds "<user_2>" account
    Then "<user_2>" logins successfully
    And the system switches to "<user_2>" account
    And "<user_2>" sees all the related tab to student on Learner App

    Examples: 
      | user_1                      | user_2                      |
      | student 2                   | student 1                   |
      | 1 of [student 1, student 2] |   1 of [parent 1, parent 2] |
      | parent 2                    | parent 1                    |
      |   1 of [parent 1, parent 2] | 1 of [student 1, student 2] |

  Scenario Outline: Able to remove account
    Given "<user_1>" has added on Learner App
    And "<user_2>" logins on Learner App
    When "<user_2>" removes "<user_1>" account
    And "<user_2>" logs out on Learner App
    Then "<user_1>" is removed on Account Screen
    And "<user_2>" redirects to authentication login screen

    Examples: 
      | user_1                     | user_2    |
      | 1 of [student 2, parent 1] | student 1 |
      | 1 of [parent 2, student 1] | parent 1  |

  @blocker
  Scenario Outline: User is logout after remove his/her account
    Given "<user>" logins on Learner App
    When "<user>" removes his/her account
    Then "<user>" is logged out on Learner App
    And "<user>" is removed on Account Screen
    And "<user>" redirects to authentication login screen

    Examples: 
      | user    |
      | student |
      | parent  |
