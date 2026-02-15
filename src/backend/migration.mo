import AccessControl "authorization/access-control";
import Map "mo:core/Map";
import Time "mo:core/Time";

module {
  type Notice = {
    id : Nat;
    category : NoticeCategory;
    title : Text;
    content : Text;
    date : Text;
    timestamp : Time.Time;
  };

  type NoticeCategory = {
    #waterSupply;
    #civicIssues;
    #meetings;
    #general;
  };

  type Event = {
    id : Nat;
    eventType : EventType;
    title : Text;
    description : Text;
    date : Text;
    timestamp : Time.Time;
    isPast : Bool;
  };

  type EventType = {
    #associationMeeting;
    #culturalProgram;
    #welfareDrive;
  };

  type GalleryItem = {
    id : Nat;
    title : Text;
    imageUrl : Text;
    description : Text;
  };

  type MembershipRegistration = {
    id : Nat;
    name : Text;
    address : Text;
    email : Text;
    phone : Text;
    membershipType : MembershipType;
  };

  type MembershipType = {
    #regular;
    #premium;
  };

  type Payment = {
    id : Nat;
    memberId : Nat;
    amount : Nat;
    paymentType : PaymentType;
    date : Text;
  };

  type PaymentType = {
    #maintenanceFee;
    #welfareFund;
  };

  type ContactFormSubmission = {
    id : Nat;
    name : Text;
    email : Text;
    message : Text;
    date : Text;
  };

  type UserProfile = {
    name : Text;
  };

  type Actor = {
    notices : Map.Map<Nat, Notice>;
    events : Map.Map<Nat, Event>;
    galleryItems : Map.Map<Nat, GalleryItem>;
    memberships : Map.Map<Nat, MembershipRegistration>;
    payments : Map.Map<Nat, Payment>;
    contactSubmissions : Map.Map<Nat, ContactFormSubmission>;
    userProfiles : Map.Map<Principal, UserProfile>;
    accessControlState : AccessControl.AccessControlState;
    nextNoticeId : Nat;
    nextEventId : Nat;
    nextGalleryItemId : Nat;
    nextMembershipId : Nat;
    nextPaymentId : Nat;
    nextContactId : Nat;
  };

  public func run(old : Actor) : Actor {
    old;
  };
};
