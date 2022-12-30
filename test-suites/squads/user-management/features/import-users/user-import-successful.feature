@cms @learner @user @import-students @import-parents
Feature: User import successfully

  Background:
    Given "school admin" logins CMS

  Scenario Outline: <entity> import success when file has <condition>
    Given school admin has created a "<entity> template csv" file with "<condition>" and "<=1000 rows"
    When school admin imports the "<entity> template csv" file
    And school admin sees a "successful" message contained "<successfulMessage>" on the snackbar

    Examples:
      | entity  | condition            | successfulMessage                               |
      | student | only mandatory input | You have imported the student list successfully |
      | student | all valid input      | You have imported the student list successfully |
      | parent  | only mandatory input | You have imported the parent list successfully  |
      | parent  | all valid input      | You have imported the parent list successfully  |

  @ignore
  Scenario: Check parents imported successfully
    Given school admin has imported the "parent template csv" file
    When school admin adds a random imported parent into a new student
    And school admin reissues the random imported parent password
    Then school admin "sees" the random imported parent with correct data
    And "parent" password is reissued
    And "parent" logins successfully with old username, "new password" and organization "Tenant S1"

  @ignore
  Scenario: Check students imported successfully on the Student Management
    Given school admin has imported the "student template csv" file
    When school admin searches a random imported student
    Then school admin "sees" the random imported student on the Student Management

  @ignore
  Scenario: Check students imported successfully can login on Learner App
    Given school admin has imported the "student template csv" file
    When school admin reissues a random imported student password
    Then "student" password is reissued
    And "student" logins "successfully" with old username, "new password" and organization "Tenant S1"
