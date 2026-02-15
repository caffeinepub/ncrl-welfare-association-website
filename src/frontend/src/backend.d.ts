import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Event {
    id: bigint;
    title: string;
    date: string;
    description: string;
    isPast: boolean;
    timestamp: Time;
    eventType: EventType;
}
export interface Notice {
    id: bigint;
    title: string;
    content: string;
    date: string;
    timestamp: Time;
    category: NoticeCategory;
}
export interface GalleryItem {
    id: bigint;
    title: string;
    description: string;
    imageUrl: string;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum EventType {
    culturalProgram = "culturalProgram",
    associationMeeting = "associationMeeting",
    welfareDrive = "welfareDrive"
}
export enum MembershipType {
    premium = "premium",
    regular = "regular"
}
export enum NoticeCategory {
    civicIssues = "civicIssues",
    meetings = "meetings",
    waterSupply = "waterSupply",
    general = "general"
}
export enum PaymentType {
    welfareFund = "welfareFund",
    maintenanceFee = "maintenanceFee"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addGalleryItem(title: string, imageUrl: string, description: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createEvent(eventType: EventType, title: string, description: string, date: string, isPast: boolean): Promise<bigint>;
    createNotice(category: NoticeCategory, title: string, content: string, date: string): Promise<bigint>;
    deleteEvent(id: bigint): Promise<void>;
    deleteGalleryItem(id: bigint): Promise<void>;
    deleteNotice(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactInfo(): Promise<[string, string, string]>;
    getGalleryItems(): Promise<Array<GalleryItem>>;
    getLatestNotices(limit: bigint): Promise<Array<Notice>>;
    getNoticesByCategory(category: NoticeCategory): Promise<Array<Notice>>;
    getPastEvents(): Promise<Array<Event>>;
    getUpcomingEvents(): Promise<Array<Event>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeBootstrapToken(adminBootstrapToken: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContactForm(name: string, email: string, message: string, date: string): Promise<bigint>;
    submitMembershipRegistration(name: string, address: string, email: string, phone: string, membershipType: MembershipType): Promise<bigint>;
    submitPayment(memberId: bigint, amount: bigint, paymentType: PaymentType, date: string): Promise<bigint>;
    updateEvent(id: bigint, eventType: EventType, title: string, description: string, date: string, isPast: boolean): Promise<void>;
    updateNotice(id: bigint, category: NoticeCategory, title: string, content: string, date: string): Promise<void>;
}
