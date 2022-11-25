@cms @teacher @user @staff-info
Feature: Create staff account with user groups

  Background:
    Given "school admin" logins CMS

  Scenario Outline: Create staff account with "<number>" user groups
    Given school admin has created "15" user groups with granted permission
    When school admin creates a new staff with "<number>" user groups
    Then school admin sees newly created staff on CMS
    And staff logins Teacher App successfully after forgot password

    Examples:
      | number |
      | 1      |
      | 11     |

  Scenario: Create staff account without user groups
    When school admin creates a new staff with "0" user groups
    Then school admin sees newly created staff on CMS
    And staff "can not" login to Teacher App after forgot password
