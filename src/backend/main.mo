import Map "mo:core/Map";
import Blob "mo:core/Blob";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Timer "mo:core/Timer";
import Time "mo:core/Time";
import Nat32 "mo:core/Nat32";
import Char "mo:core/Char";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Debug "mo:core/Debug";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";

actor {
  let conversationHistory = Map.empty<Principal, [ConversationEntry]>();
  let currentSessions = Map.empty<Principal, SessionState>();
  let messageQueue = Map.empty<Principal, List.List<Text>>();
  let detectedLanguage = Map.empty<Principal, Text>();
  let typingStates = Map.empty<Principal, TypingIndicator>();
  let supportedLocales = List.empty<Locale>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Custom Types
  public type Language = {
    #tamil;
    #english;
    #telugu;
    #kannada;
    #hindi;
    #marathi;
    #tanglish;
  };

  public type TypingIndicator = {
    isTyping : Bool;
    typingSymbol : Text;
    textToType : ?Text;
    currentTextLength : ?Nat32;
  };

  public type ConversationEntry = {
    sender : Text;
    message : Text;
    expectedReply : Text;
    language : Text;
    timestamp : Text;
    color : Text;
  };

  public type SessionState = {
    active : Bool;
    currentMood : Text;
    currentStep : Nat;
    sessionTimer : Text;
  };

  public type Locale = {
    localeSymbol : Text;
    languageName : Text;
    code : Text;
    countries : [Text];
    default : Bool;
  };

  module Locale {
    public func compareByName(locale1 : Locale, locale2 : Locale) : Order.Order {
      Text.compare(locale1.languageName, locale2.languageName);
    };
  };

  public type DetectedLanguage = {
    language : Text;
    confidence_score : Text;
    isReliable : Bool;
  };

  public type BreathingExercise = {
    num_seconds_breathe_in : Nat;
    num_seconds_breathe_hold : Nat;
    num_seconds_breathe_out : Nat;
  };

  public type HelperPhrase = {
    phrase : Text;
    language : Text;
    tone : Text;
    use_case : Text;
    color : Text;
  };

  public type LocalizedPhrase = {
    language : Text;
    phrase : Text;
  };

  public type ResourceLink = {
    title : Text;
    url : Text;
    language : Text;
    description : Text;
  };

  public type CalmingMusic = {
    title : Text;
    url : Text;
    genre : Text;
    language : Text;
  };

  public type JournalPrompt = {
    prompt : Text;
    language : Text;
    mood_triggered : Text;
  };

  public type UserState = {
    userId : Text;
    current_step : Nat;
    last_input : Text;
    current_mood : Text;
    detected_language : Text;
    current_locale : Locale;
    previous_text_returned : Text;
    previous_typing_indicator : Text;
    current_typing_indicator : Text;
  };

  public type MoodIntensity = {
    mood : Text;
    intensity : Int;
  };

  public type MoodMessage = {
    mood : Text;
    language : Text;
    intensity : Int;
    message : Text;
  };

  public type UserProfile = {
    name : Text;
    preferredLanguage : ?Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Constants and Helper Functions
  public shared ({ caller }) func trimText(input : Text) : async Text {
    let charIter = input.chars();
    let nonWhitespaceCharsIter = charIter.filter(
      func(c) { not c.isWhitespace() }
    );
    Runtime.unreachable();
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
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

  // Conversation History Management
  public shared ({ caller }) func saveConversationEntry(encodedEntry : Blob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save conversation entries");
    };
    // Deserialize entry and update conversation history for caller
    // Implementation omitted for brevity
    ();
  };

  public shared ({ caller }) func getConversationHistory(user : Principal) : async [ConversationEntry] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only users can view their own conversation history");
    };
    switch (conversationHistory.get(user)) {
      case (?history) { history };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getFilteredConversationHistory(user : Principal, localeFilter : Text) : async [ConversationEntry] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own conversation history");
    };
    switch (conversationHistory.get(user)) {
      case (?history) {
        history.filter(
          func(entry) {
            entry.language == localeFilter;
          }
        );
      };
      case (null) { [] };
    };
  };

  // Sentence Case Conversion Utility
  public shared ({ caller }) func convertToSentenceCase(text : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can use this function");
    };
    text;
  };

  // Language Detection
  public shared ({ caller }) func detectLanguage(text : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can detect language");
    };
    let emptyJson = "{}";
    let detectedLanguageJson = await makePostOutcall("https://detect.language.api/", text, [
      { name = "Content-Type"; value = "application/json" },
      { name = "Authorization"; value = "Bearer ABC123" },
    ]);
    detectedLanguage.add(caller, detectedLanguageJson);
    detectedLanguageJson;
  };

  public query ({ caller }) func getDetectedLanguage() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get detected language");
    };
    detectedLanguage.get(caller).toText();
  };

  public shared ({ caller }) func fetchSupportedLocales() : async [Locale] {
    // No authorization needed - public information
    let locale1 : Locale = {
      localeSymbol = "🇬🇧";
      languageName = "English";
      code = "en";
      countries = [ "US", "UK" ];
      default = true;
    };
    let locale2 : Locale = {
      localeSymbol = "🇮🇳";
      languageName = "Tamil";
      code = "ta";
      countries = [ "IN" ];
      default = false;
    };

    supportedLocales.add(locale1);
    supportedLocales.add(locale2);

    supportedLocales.toArray().sort(Locale.compareByName);
  };

  // Conversation Structure Queries
  public shared ({ caller }) func shouldReflectRepeatWork() : async (Bool, Text, Text) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access conversation functions");
    };
    (false, "", "");
  };

  public shared ({ caller }) func shouldAskCalmingQuestions() : async (Bool, Text, Text, Text, ?Text, ?Text, ?Text) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access conversation functions");
    };
    (false, "", "", "", null, null, null);
  };

  public shared ({ caller }) func shouldOfferGroundingTips() : async (Bool, Text, Text, ?Text, ?Text) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access conversation functions");
    };
    (false, "", "", null, null);
  };

  public shared ({ caller }) func shouldEndOnSootingNote() : async (Bool, Text) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access conversation functions");
    };
    (true, "Hopeful, soothing conclusion delivered in conversation's language");
  };

  // Sentiment Analysis (Dummy Function)
  public query ({ caller }) func analyzeSentiment(text : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can analyze sentiment");
    };
    text;
  };

  // Typed Message Simulation
  public shared ({ caller }) func simulateTypedMessage(message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can simulate typed messages");
    };
  };

  // Typing Control Functions
  public shared ({ caller }) func startTyping() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can control typing indicators");
    };
  };

  public shared ({ caller }) func stopTyping() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can control typing indicators");
    };
  };

  public query ({ caller }) func shouldSendTypingIndicator() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check typing indicators");
    };
    true;
  };

  // Message Queue Operations
  public shared ({ caller }) func queueMessage(message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can queue messages");
    };
    let messages = List.singleton(message);
    messageQueue.add(caller, messages);
    ();
  };

  // Server-Side Message Update
  public shared ({ caller }) func updateLocalMessage(entry : Blob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update messages");
    };
    // Deserialize and update message for specific user session
    // Implementation omitted for brevity
    ();
  };

  // Outcalls (HTTP Calls)
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func makeGetOutcall(url : Text, headers : [OutCall.Header]) : async Text {
    await OutCall.httpGetRequest(url, headers, transform);
  };

  func makePostOutcall(url : Text, body : Text, headers : [OutCall.Header]) : async Text {
    await OutCall.httpPostRequest(url, headers, body, transform);
  };

  // Static Message Retrieval
  public shared ({ caller }) func getStaticMessage() : async Text {
    // No authorization needed - public welcome message
    "Welcome to Project Chat!\n" #
    "assistantGPT is here to support you in Tamil, English, Tanglish, Telugu, Kannada, Hindi, and Marathi.\n" #
    "Share your thoughts and let's begin our conversation. Remember, this is a safe space for emotional support, not medical advice.";
  };

  public query ({ caller }) func getStaticAssistantMessage() : async Text {
    // No authorization needed - public welcome message
    "I'm assistantGPT, here to support you. Let's start wherever you feel comfortable.";
  };

  // Test Message Function
  public shared ({ caller }) func sendTestMessage() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send test messages");
    };
    "Test message sent successfully!";
  };

  // Admin Check
  public query ({ caller }) func isAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // Current Locale Retrieval
  public query ({ caller }) func getCurrentLocale() : async Locale {
    // No authorization needed - public information
    let localesArray = supportedLocales.toArray();
    if (localesArray.size() > 0) {
      localesArray[0];
    } else {
      Runtime.trap("No locales available");
    };
  };

  // Message Parsing
  public shared ({ caller }) func parseMessages(messages : [Text]) : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can parse messages");
    };
    messages;
  };

  // Language Generation (Dummy Function)
  public shared ({ caller }) func generateLanguage(language : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate language");
    };
    language;
  };

  // Static Typing Indicator
  public query ({ caller }) func getStaticTypingIndicator() : async () {
    // No authorization needed - public information
  };

  public shared ({ caller }) func sendTestJsonMessage() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send test JSON messages");
    };
    "{ \"message\": \"Test Successful!\" }";
  };
};
