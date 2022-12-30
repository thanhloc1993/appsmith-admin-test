@cms @parent @user @import-parents
Feature: Import parents successfully

  Background:
    Given "school admin" logins CMS

  Scenario Outline: Import success when file has <condition>
    Given school admin has created a "parent template csv" file with "<condition>" and "<=1000 rows"
    When school admin imports the "parent template csv" file
    And school admin sees a "successful" message contained "<successfulMessage>" on the snackbar
    And school admin adds a new random imported parent into a new student
    And school admin sees the new imported parent with correct data
    And school admin reissues the random imported parent password
    And "parent" password is reissued
    And "parent" logins "successfully" with old username, "new password" and organization "Tenant S1"

    Examples:
      | condition            | successfulMessage                              |
      | only mandatory input | You have imported the parent list successfully |
      | all valid input      | You have imported the parent list successfully |

  Scenario Outline: Import success when file has <validField>
    Given school admin has created a "parent template csv" file with "valid fields <validField>" and "<=1000 rows"
    When school admin imports the "parent template csv" file
    And school admin sees a "successful" message contained "<successfulMessage>" on the snackbar
    And school admin adds a new random imported parent into a new student
    And school admin sees the new imported parent with correct data
    And school admin reissues the random imported parent password
    And "parent" password is reissued
    And "parent" logins "successfully" with old username, "new password" and organization "Tenant S1"

    Examples:
      | validField                   | successfulMessage                              |
      | Parent Phone Number          | You have imported the parent list successfully |
      | Student Email & Relationship | You have imported the parent list successfully |
      | Parent Tag                   | You have imported the parent list successfully |
