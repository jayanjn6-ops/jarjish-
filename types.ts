export type CoachType = 'AC' | 'Non-AC' | 'Sleeper';
export type Role = 'ADMIN' | 'CUSTOMER' | 'GUEST';

export interface User {
  id: string;
  username: string;
  password?: string; // Made optional for security simulation; in real app, it'd be handled server-side
  email: string;
  role: Role;
}

export interface CompanyUser {
    id: string;
    username: string;
    contact: string;
    pictureUrl: string;
    roleGroup: 'Counter Master' | 'Company Administrator' | 'Call Center';
    counterId: string;
    type: 'Postpaid' | 'own';
    status: 'active' | 'inactive';
}

export interface Coach {
  id: string;
  name: string;
  type: CoachType;
  totalSeats: number;
  seatLayout: string[][];
  facilities: string[];
  image: string;
  isActive: boolean;
}

export interface Route {
  id:string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  coachId: string;
  availableSeats: number;
  fare: number;
}

export interface SearchCriteria {
  from: string;
  to: string;
  date: string;
}

export interface Passenger {
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
}

export interface Booking {
  id: string;
  trip: Trip;
  seats: string[];
  passenger: Passenger;
  totalFare: number;
  paymentStatus: 'Paid';
  bookingDate: string;
  userId: string | null; // Can be null for guest bookings
  status: 'Confirmed' | 'Cancelled';
}

export interface Trip extends Route {
    coach: Coach;
}

export interface Counter {
    id: string;
    name: string;
    location: string;
    manager: string;
}

export interface Discount {
    id: string;
    code: string;
    percentage: number;
    validUntil: string;
    isActive: boolean;
}

export interface Cancellation {
    id: string;
    bookingId: string;
    cancellationDate: string;
    refundAmount: number;
    processedBy: string; // Admin User ID
}

export interface CoachCost {
    id: string;
    coachId: string;
    costType: 'Maintenance' | 'Fuel' | 'Driver Salary' | 'Other';
    amount: number;
    date: string;
    description: string;
}

export interface CommissionRule {
    id: string;
    appliesTo: 'ALL_COUNTERS' | 'SPECIFIC_COUNTER';
    counterId?: string; 
    rate: number; // Percentage
    description: string;
}

export interface NewsItem {
    id: string;
    title: string;
    content: string;
    publishedDate: string;
    author: string; // Admin User name
}

export interface BroadcastMessage {
    id: string;
    title: string;
    message: string;
    sentDate: string;
    sentBy: string; // Admin User name
}

export interface Lottery {
    id:string;
    name: string;
    drawDate: string;
    prize: string;
    winningTicketId: string | null; // Booking ID
}

export interface CounterQuota {
    id: string;
    counterId: string;
    routeId: string;
    quota: number; // Number of tickets
}

export interface Employee {
    id: string;
    name: string;
    position: string;
    contact: string;
    salary: number;
}