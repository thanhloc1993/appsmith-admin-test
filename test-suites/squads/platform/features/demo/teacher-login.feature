@teacher @demo @ignore

Feature: Teacher Login Demo
  Teacher can login to Teacher App

  Scenario Outline: Teacher logins with email
    Given teacher does not login yet
    When teacher logins with "<teacher_email>" email, "<teacher_password>" password and "<teacher_organization>" organization
    Then teacher logins success

    Examples:
      | teacher_email           | teacher_password | teacher_organization |
      | tien.tran05@manabie.com | 123456           | manabie              |
