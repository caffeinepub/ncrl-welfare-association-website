import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
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

  public type UserProfile = {
    name : Text;
  };

  let accessControlState = AccessControl.initState(); // Only reinitialize when no persistent state is needed.
  include MixinAuthorization(accessControlState);

  var nextNoticeId = 1;
  var nextEventId = 1;
  var nextGalleryItemId = 1;
  var nextMembershipId = 1;
  var nextPaymentId = 1;
  var nextContactId = 1;

  let notices = Map.empty<Nat, Notice>();
  let events = Map.empty<Nat, Event>();
  var galleryItems = Map.empty<Nat, GalleryItem>();
  let memberships = Map.empty<Nat, MembershipRegistration>();
  let payments = Map.empty<Nat, Payment>();
  let contactSubmissions = Map.empty<Nat, ContactFormSubmission>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let defaultGalleryItems : [GalleryItem] = [
    {
      id = 1;
      title = "Community Garden";
      imageUrl = "/assets/generated/gallery-garden.png";
      description = "A beautiful view of our community garden in full bloom.";
    },
    {
      id = 2;
      title = "Annual Picnic";
      imageUrl = "/assets/generated/gallery-picnic.png";
      description = "Family members enjoying games and food at the annual picnic.";
    },
    {
      id = 3;
      title = "Welfare Drive";
      imageUrl = "/assets/generated/gallery-drive.png";
      description = "Volunteers organizing donated goods for local families.";
    },
    {
      id = 4;
      title = "Cultural Night";
      imageUrl = "/assets/generated/gallery-culture.png";
      description = "A snapshot of performances during Cultural Night celebrations.";
    },
    {
      id = 5;
      title = "Clean-Up Day";
      imageUrl = "/assets/generated/gallery-cleanup.png";
      description = "Residents participating in neighborhood clean-up efforts.";
    },
    {
      id = 6;
      title = "Community Center";
      imageUrl = "/assets/generated/gallery-community.png";
      description = "The new community center now available for local events.";
    },
  ];

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createNotice(category : NoticeCategory, title : Text, content : Text, date : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create notices");
    };

    let newNotice : Notice = {
      id = nextNoticeId;
      category;
      title;
      content;
      date;
      timestamp = Time.now();
    };
    notices.add(nextNoticeId, newNotice);
    nextNoticeId += 1;
    newNotice.id;
  };

  public query func getNoticesByCategory(category : NoticeCategory) : async [Notice] {
    notices.values().filter(func(n) { n.category == category }).toArray();
  };

  public query func getLatestNotices(limit : Nat) : async [Notice] {
    let sortedNotices = notices.values().toArray().sort(
      func(a, b) {
        if (a.timestamp > b.timestamp) { #less } else if (a.timestamp < b.timestamp) {
          #greater;
        } else { #equal };
      }
    );

    Array.tabulate<Notice>(
      if (limit > sortedNotices.size()) { sortedNotices.size() } else { limit },
      func(i) { sortedNotices[i] },
    );
  };

  public shared ({ caller }) func deleteNotice(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete notices");
    };

    if (notices.containsKey(id)) {
      notices.remove(id);
    } else {
      Runtime.trap("Notice does not exist.");
    };
  };

  public shared ({ caller }) func createEvent(eventType : EventType, title : Text, description : Text, date : Text, isPast : Bool) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create events");
    };

    let newEvent : Event = {
      id = nextEventId;
      eventType;
      title;
      description;
      date;
      timestamp = Time.now();
      isPast;
    };
    events.add(nextEventId, newEvent);
    nextEventId += 1;
    newEvent.id;
  };

  public query func getUpcomingEvents() : async [Event] {
    events.values().filter(func(e) { not e.isPast }).toArray();
  };

  public query func getPastEvents() : async [Event] {
    events.values().filter(func(e) { e.isPast }).toArray();
  };

  public shared ({ caller }) func deleteEvent(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete events");
    };

    if (events.containsKey(id)) {
      events.remove(id);
    } else {
      Runtime.trap("Event does not exist.");
    };
  };

  public shared ({ caller }) func addGalleryItem(title : Text, imageUrl : Text, description : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add gallery items");
    };

    let newItem : GalleryItem = {
      id = nextGalleryItemId;
      title;
      imageUrl;
      description;
    };
    galleryItems.add(nextGalleryItemId, newItem);
    nextGalleryItemId += 1;
    newItem.id;
  };

  public query func getGalleryItems() : async [GalleryItem] {
    let itemsArray = galleryItems.values().toArray();
    if (itemsArray.size() == 0) {
      defaultGalleryItems;
    } else {
      itemsArray;
    };
  };

  public shared ({ caller }) func deleteGalleryItem(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete gallery items");
    };

    if (galleryItems.containsKey(id)) {
      galleryItems.remove(id);
    } else {
      Runtime.trap("Gallery item does not exist.");
    };
  };

  public shared ({ caller }) func submitMembershipRegistration(name : Text, address : Text, email : Text, phone : Text, membershipType : MembershipType) : async Nat {
    // No authorization check - allow guests to register for membership
    let newMembership : MembershipRegistration = {
      id = nextMembershipId;
      name;
      address;
      email;
      phone;
      membershipType;
    };
    memberships.add(nextMembershipId, newMembership);
    nextMembershipId += 1;
    newMembership.id;
  };

  public shared ({ caller }) func submitPayment(memberId : Nat, amount : Nat, paymentType : PaymentType, date : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit payments");
    };

    let newPayment : Payment = {
      id = nextPaymentId;
      memberId;
      amount;
      paymentType;
      date;
    };
    payments.add(nextPaymentId, newPayment);
    nextPaymentId += 1;
    newPayment.id;
  };

  public shared ({ caller }) func submitContactForm(name : Text, email : Text, message : Text, date : Text) : async Nat {
    // No authorization check - allow guests to submit contact forms
    let newContact : ContactFormSubmission = {
      id = nextContactId;
      name;
      email;
      message;
      date;
    };
    contactSubmissions.add(nextContactId, newContact);
    nextContactId += 1;
    newContact.id;
  };

  public query func getContactInfo() : async (Text, Text, Text) {
    (
      "123 Main St, City, Country",
      "+1234567890",
      "info@association.com",
    );
  };
};
