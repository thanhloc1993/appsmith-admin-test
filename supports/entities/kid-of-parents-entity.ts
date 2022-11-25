import { UserProfileEntity } from './user-profile-entity';

// Example JSON:
// {
//     "$":"KidsOfParentModel",
//     "kidsOfParent":[
//        {
//           "$":"Learner",
//           "id":"",
//           "createdAt":,
//           "appleUserId":"",
//           "facebookId":"",
//           "name":"",
//           "avatar":"",
//           "userGroupEnum":"student"
//        }
//     ]
//  }
export interface KidsOfParentEntity {
    kidsOfParent: UserProfileEntity[];
}
