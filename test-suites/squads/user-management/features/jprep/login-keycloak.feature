# @teacher
# @learner
@cms
@jprep
@user @login
Feature: Login by Keycloak

    Background:
        # Given staff creates school admin account for partner manually
        Given system has synced student and teacher from partner

    @ignore
    Scenario: Login successfully by student account
        When student logins with valid username or password from partner
        Then student logins by Keycloak successfully
        And student data is displayed
    @ignore
    Scenario: Login successfully by teacher account
        When teacher logins with valid username or password from partner
        Then teacher logins by Keycloak successfully

    Scenario: Login successfully by admin account
        When school admin logins with valid username or password from partner
        Then school admin logins by Keycloak successfully