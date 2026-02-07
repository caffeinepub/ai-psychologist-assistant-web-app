import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Locale {
    code: string;
    countries: Array<string>;
    languageName: string;
    localeSymbol: string;
    default: boolean;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface ConversationEntry {
    color: string;
    sender: string;
    language: string;
    message: string;
    timestamp: string;
    expectedReply: string;
}
export interface UserProfile {
    preferredLanguage?: string;
    name: string;
}
export interface http_header {
    value: string;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    analyzeSentiment(text: string): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    convertToSentenceCase(text: string): Promise<string>;
    detectLanguage(text: string): Promise<string>;
    fetchSupportedLocales(): Promise<Array<Locale>>;
    generateLanguage(language: string): Promise<string>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConversationHistory(user: Principal): Promise<Array<ConversationEntry>>;
    getCurrentLocale(): Promise<Locale>;
    getDetectedLanguage(): Promise<string>;
    getFilteredConversationHistory(user: Principal, localeFilter: string): Promise<Array<ConversationEntry>>;
    getStaticAssistantMessage(): Promise<string>;
    getStaticMessage(): Promise<string>;
    getStaticTypingIndicator(): Promise<void>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    parseMessages(messages: Array<string>): Promise<Array<string>>;
    queueMessage(message: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveConversationEntry(encodedEntry: Uint8Array): Promise<void>;
    sendTestJsonMessage(): Promise<string>;
    sendTestMessage(): Promise<string>;
    shouldAskCalmingQuestions(): Promise<[boolean, string, string, string, string | null, string | null, string | null]>;
    shouldEndOnSootingNote(): Promise<[boolean, string]>;
    shouldOfferGroundingTips(): Promise<[boolean, string, string, string | null, string | null]>;
    shouldReflectRepeatWork(): Promise<[boolean, string, string]>;
    shouldSendTypingIndicator(): Promise<boolean>;
    simulateTypedMessage(message: string): Promise<void>;
    startTyping(): Promise<void>;
    stopTyping(): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    trimText(input: string): Promise<string>;
    updateLocalMessage(entry: Uint8Array): Promise<void>;
}
