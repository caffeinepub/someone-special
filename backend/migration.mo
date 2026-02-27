import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  type HeartNote = {
    id : Text;
    creator : Text;
    message : Text;
    timestamp : Int;
    position : (Float, Float);
  };

  type ActorState = {
    heartNotes : Map.Map<Text, HeartNote>;
    personalGreetingMessage : Text;
  };

  public func run(old : ActorState) : ActorState {
    old;
  };
};
