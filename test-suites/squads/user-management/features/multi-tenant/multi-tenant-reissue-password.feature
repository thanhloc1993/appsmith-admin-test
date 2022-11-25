@cms @user @login @user-multi-tenant @User_Authentication_MultiTenantAuthentication
Feature: Reissue password in multi-tenant

  Background: 
    Given school admin "Tenant S1" logins CMS
    And school admin "Tenant S1" has created a student with student info and parent info

  @blocker
  Scenario Outline: Reissue <user> password
    When school admin "Tenant S1" reissues "<user>" password
    And school admin "confirm" reissue password
    Then "<user>" password is reissued
    And "<user>" logins "failed" with old username, "old password" and organization "Tenant S1"
    And "<user>" logins "failed" with old username, "new password" and organization "Tenant S2"
    And "<user>" logins "successfully" with old username, "new password" and organization "Tenant S1"

    @learner
    Examples: 
      | user    |
      | student |

    @parent
    Examples: 
      | user   |
      | parent |
