import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  type Notice = {
    id : Nat;
    category : NoticeCategory;
    title : Text;
    content : Text;
    date : Text;
    timestamp : Int;
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
    timestamp : Int;
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

  type OldActor = {
    nextNoticeId : Nat;
    nextEventId : Nat;
    nextGalleryItemId : Nat;
    nextMembershipId : Nat;
    nextPaymentId : Nat;
    nextContactId : Nat;
    notices : Map.Map<Nat, Notice>;
    events : Map.Map<Nat, Event>;
    galleryItems : Map.Map<Nat, GalleryItem>;
    memberships : Map.Map<Nat, MembershipRegistration>;
    payments : Map.Map<Nat, Payment>;
    contactSubmissions : Map.Map<Nat, ContactFormSubmission>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  // New state (remains unchanged here)
  type NewActor = OldActor;

  func createSeedItem(id : Nat, title : Text, url : Text, desc : Text) : GalleryItem {
    { id; title; imageUrl = url; description = desc };
  };

  func getSeededGallery() : Map.Map<Nat, GalleryItem> {
    let seeded = Map.empty<Nat, GalleryItem>();
    seeded.add(1, createSeedItem(1, "The River Walk", "https://findelin-assets.s3.eu-west-1.amazonaws.com/garden-yellow.jpg", "A view of the tranquil river running through our town."));
    seeded.add(2, createSeedItem(2, "Evening Sky", "https://findelin-assets.s3.eu-west-1.amazonaws.com/shopping-arcade.jpg", "A beautiful sunset over the hills."));
    seeded.add(3, createSeedItem(3, "Blooming Garden", "https://findelin-assets.s3.eu-west-1.amazonaws.com/courtyard-flowers.jpg", "Flowers in full bloom during spring."));
    seeded.add(4, createSeedItem(4, "Winter Bliss", "https://findelin-assets.s3.eu-west-1.amazonaws.com/courtyard-pink-blue.jpg", "Snow covered town square in winter."));
    seeded;
  };

  public func run(old : OldActor) : NewActor {
    let seededGallery = getSeededGallery();
    let galleryToUse = if (old.galleryItems.isEmpty()) { seededGallery } else {
      old.galleryItems;
    };

    {
      old with
      nextGalleryItemId = galleryToUse.size() + 1;
      galleryItems = galleryToUse;
    };
  };
};
