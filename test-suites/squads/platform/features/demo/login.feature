@cms @teacher @learner
@login @demo @ignore

Feature: Login cross testing
  SchoolAdmin can login to CMS
  Teacher can login to Teacher App
  Learner can login to Learner App

  Scenario Outline: Login with email
    Given school admin does not login yet
    And teacher does not login yet
    And student does not login yet
    When school admin logins with the email is "<admin_email>" and the password is "<admin_password>"
    And teacher logins with "<teacher_email>" email, "<teacher_password>" password and "<teacher_organization>" organization
    And student logins with "<student_email>" email, "<student_password>" password and "<student_organization>" organization
    Then school admin logins success
    And teacher logins success
    And student logins success

    Examples:
      | admin_email                        | admin_password | teacher_email           | teacher_password | teacher_organization | student_email                        | student_password | student_organization |
      | product.test+matsuzemi@manabie.com | Manabie123     | tien.tran05@manabie.com | 123456           | manabie              | phucloi.nguyen+systaging@manabie.com | Manabie@2021     | e2e                  |
