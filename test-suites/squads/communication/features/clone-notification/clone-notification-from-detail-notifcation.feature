@cms
@communication
@clone-notification

Feature: Clone notification at detail notification page
  Background:
    Given "school admin" logins CMS
    And "school admin" has created a student with grade, course and parent info
    And "school admin" is at "Notification" page on CMS

  Scenario Outline: Direct to compose notification with same data clone from Sent notification <questionnaire>
    Given "school admin" open compose dialog and input required fields
    And "school admin" has sent the notification "<questionnaire>"
      | questionSection | numberOfAnswersEach | questionType                  |
      | Question Q1     | 2                   | QUESTION_TYPE_MULTIPLE_CHOICE |
      | Question Q2     | 2                   | QUESTION_TYPE_CHECK_BOX       |
      | Question Q3     | 0                   | QUESTION_TYPE_FREE_TEXT       |
    When school admin sees message "You have sent the notification successfully!"
    And "school admin" goes to detail page of this notification
    Then school admin clicks "Clone" button
    And "school admin" sees compose notification screen with all data correctly
    And school admin clicks "Send" button
    And school admin sees message "You have sent the notification successfully!"
    Examples:
      | questionnaire         |
      | with questionnaire    |
      | without questionnaire |
