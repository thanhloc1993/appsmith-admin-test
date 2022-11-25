@cms @learner @user @import-students
Feature: Import students successfully

  Background:
    Given "school admin" logins CMS

  Scenario Outline: Import success when file has <condition>
    Given school admin has created a "student template csv" file with "<condition>" and "<=1000 rows"
    When school admin imports the "student template csv" file
    And school admin sees a "successful" message contained "<content>" on the snackbar
    And school admin "sees" new imported students on the Student Management
    And school admin reissues a random imported student password
    And "student" password is reissued
    And "student" logins "successfully" with old username, "new password" and organization "Tenant S1"

    Examples:
      | condition            | content                                         |
      | only mandatory input | You have imported the student list successfully |
      | all valid input      | You have imported the student list successfully |

  Scenario Outline: Import success when file has <validField>
    Given school admin has created a "student template csv" file with "valid fields <validField>" and "<=1000 rows"
    When school admin imports the "student template csv" file
    And school admin sees a "successful" message contained "<content>" on the snackbar
    And school admin "sees" new imported students on the Student Management
    And school admin reissues a random imported student password
    And "student" password is reissued
    And "student" logins "successfully" with old username, "new password" and organization "Tenant S1"

    Examples:
      | validField                                                     | content                                         |
      | First Name Phonetic & Last Name Phonetic & Gender & Birthday   | You have imported the student list successfully |
      | Student Phone Number & Home Phone Number & Contact Preference  | You have imported the student list successfully |
      | City & Prefecture & Postal Code & First Street & Second Street | You have imported the student list successfully |
      | Student Tag                                                    | You have imported the student list successfully |
