import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";



actor {
  type HeartNote = {
    id : Text;
    creator : Text;
    message : Text;
    timestamp : Int;
    position : (Float, Float);
  };

  module HeartNote {
    public func compare(note1 : HeartNote, note2 : HeartNote) : Order.Order {
      Text.compare(note1.id, note2.id);
    };
  };

  let heartNotes = Map.empty<Text, HeartNote>();
  var personalGreetingMessage : Text = "Welcome to your love-filled online sanctuary!";

  public shared ({ caller }) func addHeartNote(id : Text, creator : Text, message : Text, timestamp : Int, position : (Float, Float)) : async () {
    switch (heartNotes.get(id)) {
      case (null) {
        let newNote : HeartNote = {
          id;
          creator;
          message;
          timestamp;
          position;
        };
        heartNotes.add(id, newNote);
      };
      case (?_) { Runtime.trap("Heart note with this ID already exists") };
    };
  };

  public shared ({ caller }) func editHeartNote(id : Text, newMessage : Text) : async () {
    switch (heartNotes.get(id)) {
      case (null) { Runtime.trap("Heart note not found") };
      case (?existingNote) {
        let updatedNote : HeartNote = {
          existingNote with
          message = newMessage;
        };
        heartNotes.add(id, updatedNote);
      };
    };
  };

  public query ({ caller }) func getHeartNote(id : Text) : async HeartNote {
    switch (heartNotes.get(id)) {
      case (null) { Runtime.trap("Heart note not found") };
      case (?note) { note };
    };
  };

  public query ({ caller }) func getAllHeartNotes() : async [HeartNote] {
    heartNotes.values().toArray().sort();
  };

  public shared ({ caller }) func deleteHeartNote(id : Text) : async () {
    switch (heartNotes.get(id)) {
      case (null) { Runtime.trap("Heart note not found") };
      case (?_) {
        heartNotes.remove(id);
      };
    };
  };

  public query ({ caller }) func getPersonalGreetingMessage() : async Text {
    personalGreetingMessage;
  };

  public shared ({ caller }) func updatePersonalGreetingMessage(newMessage : Text) : async () {
    personalGreetingMessage := newMessage;
  };
};
