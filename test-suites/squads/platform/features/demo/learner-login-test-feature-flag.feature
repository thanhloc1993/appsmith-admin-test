@learner
@learner-login @demo @ignore @feature_xxxx_v1

Feature: Learner Login Demo with feature flag
  Learner can login to Learner App

  Scenario Outline: Learner logins with email
    Given student does not login yet
    When student logins with "<student_email>" email, "<student_password>" password and "<student_organization>" organization
    Then student logins success

    Examples:
      | student_email                        | student_password | student_organization |
      | phucloi.nguyen+systaging@manabie.com | Manabie@2021     | e2e                  |
