import type { Coach, Route, User, Booking, Trip, Counter, Discount, CoachCost, CommissionRule, NewsItem, BroadcastMessage, Lottery, CounterQuota, Employee, CompanyUser } from './types';

export const CITIES: string[] = [
    'Dhaka', 'Rajshahi', 'Chittagong', 'Sylhet', 'Khulna', 'Barisal', 'Rangpur', 'Cox\'s Bazar'
];

export const USERS: User[] = [
    { id: 'U001', username: 'admin', password: 'admin123', email: 'admin@jarjishbus.com', role: 'ADMIN' },
    { id: 'U002', username: 'rakib_hasan', password: 'customer123', email: 'rakib@example.com', role: 'CUSTOMER' },
];

export const COACHES: Coach[] = [
    {
        id: 'COACH001',
        name: 'Hanif Enterprise',
        type: 'AC',
        totalSeats: 40,
        isActive: true,
        seatLayout: [
            ['A1', 'A2', '', 'A3', 'A4'],
            ['B1', 'B2', '', 'B3', 'B4'],
            ['C1', 'C2', '', 'C3', 'C4'],
            ['D1', 'D2', '', 'D3', 'D4'],
            ['E1', 'E2', '', 'E3', 'E4'],
            ['F1', 'F2', '', 'F3', 'F4'],
            ['G1', 'G2', '', 'G3', 'G4'],
            ['H1', 'H2', '', 'H3', 'H4'],
            ['I1', 'I2', '', 'I3', 'I4'],
            ['J1', 'J2', '', 'J3', 'J4'],
        ],
        facilities: ['WiFi', 'Charging Port', 'Water'],
        image: 'https://picsum.photos/seed/hanif/400/200'
    },
    {
        id: 'COACH002',
        name: 'Shyamoli NR Travels',
        type: 'Non-AC',
        totalSeats: 40,
        isActive: true,
        seatLayout: [
            ['A1', 'A2', '', 'A3', 'A4'],
            ['B1', 'B2', '', 'B3', 'B4'],
            ['C1', 'C2', '', 'C3', 'C4'],
            ['D1', 'D2', '', 'D3', 'D4'],
            ['E1', 'E2', '', 'E3', 'E4'],
            ['F1', 'F2', '', 'F3', 'F4'],
            ['G1', 'G2', '', 'G3', 'G4'],
            ['H1', 'H2', '', 'H3', 'H4'],
            ['I1', 'I2', '', 'I3', 'I4'],
            ['J1', 'J2', '', 'J3', 'J4'],
        ],
        facilities: ['Fan', 'Water'],
        image: 'https://picsum.photos/seed/shyamoli/400/200'
    },
    {
        id: 'COACH003',
        name: 'Green Line Paribahan',
        type: 'Sleeper',
        totalSeats: 30,
        isActive: false,
        seatLayout: [
            ['SA1', 'SA2', '', 'SA3'],
            ['SB1', 'SB2', '', 'SB3'],
            ['SC1', 'SC2', '', 'SC3'],
            ['SD1', 'SD2', '', 'SD3'],
            ['SE1', 'SE2', '', 'SE3'],
            ['FA1', 'FA2', '', 'FA3'],
            ['FB1', 'FB2', '', 'FB3'],
            ['FC1', 'FC2', '', 'FC3'],
            ['FD1', 'FD2', '', 'FD3'],
            ['FE1', 'FE2', '', 'FE3'],
        ],
        facilities: ['WiFi', 'Charging Port', 'Blanket', 'TV'],
        image: 'https://picsum.photos/seed/greenline/400/200'
    }
];

export const ROUTES: Route[] = [
    { id: 'RT001', from: 'Dhaka', to: 'Rajshahi', departureTime: '08:00 AM', arrivalTime: '01:00 PM', coachId: 'COACH001', availableSeats: 25, fare: 800 },
    { id: 'RT002', from: 'Dhaka', to: 'Rajshahi', departureTime: '10:00 PM', arrivalTime: '04:00 AM', coachId: 'COACH002', availableSeats: 30, fare: 550 },
    { id: 'RT003', from: 'Dhaka', to: 'Chittagong', departureTime: '09:00 AM', arrivalTime: '03:00 PM', coachId: 'COACH001', availableSeats: 15, fare: 1200 },
    { id: 'RT004', from: 'Dhaka', to: 'Chittagong', departureTime: '11:00 PM', arrivalTime: '05:00 AM', coachId: 'COACH003', availableSeats: 10, fare: 2000 },
    { id: 'RT005', from: 'Rajshahi', to: 'Dhaka', departureTime: '08:30 AM', arrivalTime: '01:30 PM', coachId: 'COACH002', availableSeats: 22, fare: 550 },
    { id: 'RT006', from: 'Sylhet', to: 'Dhaka', departureTime: '07:00 AM', arrivalTime: '01:00 PM', coachId: 'COACH001', availableSeats: 35, fare: 1000 },
];

const getTrip = (routeId: string): Trip => {
    const route = ROUTES.find(r => r.id === routeId)!;
    const coach = COACHES.find(b => b.id === route.coachId)!;
    return { ...route, coach };
};

export const INITIAL_BOOKINGS: Booking[] = [
    {
        id: 'BK1672532400',
        trip: getTrip('RT001'),
        seats: ['A1', 'A2'],
        passenger: { name: 'Rakib Hasan', gender: 'Male', contact: '01712345678' },
        totalFare: 1600,
        paymentStatus: 'Paid',
        bookingDate: '2024-07-15',
        userId: 'U002',
        status: 'Confirmed'
    },
    {
        id: 'BK1672542400',
        trip: getTrip('RT004'),
        seats: ['SA1'],
        passenger: { name: 'Admin User', gender: 'Male', contact: '01812345678' },
        totalFare: 2000,
        paymentStatus: 'Paid',
        bookingDate: '2024-07-16',
        userId: 'U001',
        status: 'Confirmed'
    },
    {
        id: 'BK1672552400',
        trip: getTrip('RT003'),
        seats: ['B3', 'B4'],
        passenger: { name: 'Sultana Ahmed', gender: 'Female', contact: '01912345678' },
        totalFare: 2400,
        paymentStatus: 'Paid',
        bookingDate: '2024-07-18',
        userId: 'U002',
        status: 'Cancelled'
    },
];

export const INITIAL_COUNTERS: Counter[] = [
    { id: 'CTR001', name: 'Gabtoli Central', location: 'Dhaka', manager: 'Mr. Karim' },
    { id: 'CTR002', name: 'Mohakhali Terminal', location: 'Dhaka', manager: 'Mr. Rahim' },
    { id: 'CTR003', name: 'Shirol Bus Stand', location: 'Rajshahi', manager: 'Ms. Salma' },
    { id: 'CTR004', name: 'Rangpur (Morden)', location: 'Rangpur', manager: 'Mr. Akter' },
    { id: 'CTR005', name: 'Rajshahi counter', location: 'Rajshahi', manager: 'Mr. Busbd' },

];


export const INITIAL_COMPANY_USERS: CompanyUser[] = [
    { id: 'CU001', username: 'akter25', contact: '01750105225', pictureUrl: 'https://i.pravatar.cc/150?u=akter25', roleGroup: 'Counter Master', counterId: 'CTR004', type: 'Postpaid', status: 'active' },
    { id: 'CU002', username: 'busbd86', contact: '16460', pictureUrl: 'https://i.pravatar.cc/150?u=busbd86', roleGroup: 'Company Administrator', counterId: 'CTR005', type: 'Postpaid', status: 'active' },
    { id: 'CU003', username: 'gmakash', contact: '01771222278', pictureUrl: 'https://i.pravatar.cc/150?u=gmakash', roleGroup: 'Counter Master', counterId: 'CTR003', type: 'Postpaid', status: 'inactive' },
    { id: 'CU004', username: 'hpbachu', contact: '01309462856', pictureUrl: 'https://i.pravatar.cc/150?u=hpbachu', roleGroup: 'Call Center', counterId: 'CTR001', type: 'own', status: 'active' },
    { id: 'CU005', username: 'hpashik', contact: '01755-455508', pictureUrl: 'https://i.pravatar.cc/150?u=hpashik', roleGroup: 'Counter Master', counterId: 'CTR002', type: 'own', status: 'active' },
];


export const INITIAL_DISCOUNTS: Discount[] = [
    { id: 'DSC001', code: 'EID2024', percentage: 10, validUntil: '2024-08-01', isActive: true },
    { id: 'DSC002', code: 'JARJISHFIRST', percentage: 15, validUntil: '2024-12-31', isActive: true },
    { id: 'DSC003', code: 'EXPIRED', percentage: 20, validUntil: '2023-12-31', isActive: false },
];

export const INITIAL_COACH_COSTS: CoachCost[] = [
    { id: 'CST001', coachId: 'COACH001', costType: 'Maintenance', amount: 5000, date: '2024-07-10', description: 'Engine oil change' },
    { id: 'CST002', coachId: 'COACH002', costType: 'Fuel', amount: 8000, date: '2024-07-12', description: 'Full tank diesel' },
    { id: 'CST003', coachId: 'COACH001', costType: 'Driver Salary', amount: 30000, date: '2024-07-01', description: 'Monthly salary' },
];

export const INITIAL_COMMISSIONS: CommissionRule[] = [
    { id: 'COM001', appliesTo: 'ALL_COUNTERS', rate: 5, description: 'Standard 5% commission for all counters' },
    { id: 'COM002', appliesTo: 'SPECIFIC_COUNTER', counterId: 'CTR001', rate: 7.5, description: 'Higher commission for Gabtoli Central' },
];

export const INITIAL_NEWS: NewsItem[] = [
    { id: 'NWS001', title: 'Eid Holiday Special Schedule', content: 'We are pleased to announce our special schedule for the upcoming Eid holidays. More trips have been added to popular routes.', publishedDate: '2024-07-01', author: 'admin' },
];

export const INITIAL_BROADCASTS: BroadcastMessage[] = [
    { id: 'BRD001', title: 'System Maintenance Alert', message: 'The booking system will be down for scheduled maintenance on July 20th from 2 AM to 4 AM.', sentDate: '2024-07-18', sentBy: 'admin' },
];

export const INITIAL_LOTTERIES: Lottery[] = [
    { id: 'LOT001', name: 'July Jackpot', drawDate: '2024-07-31', prize: 'Dhaka-Cox\'s Bazar Couple Trip', winningTicketId: null },
];

export const INITIAL_QUOTAS: CounterQuota[] = [
    { id: 'QT001', counterId: 'CTR001', routeId: 'RT001', quota: 10 },
    { id: 'QT002', counterId: 'CTR002', routeId: 'RT003', quota: 5 },
];

export const INITIAL_EMPLOYEES: Employee[] = [
    { id: 'EMP001', name: 'Mr. Karim', position: 'Counter Manager', contact: '01711111111', salary: 25000 },
    { id: 'EMP002', name: 'Mr. Rahim', position: 'Counter Manager', contact: '01822222222', salary: 25000 },
    { id: 'EMP003', name: 'Driver Alam', position: 'Driver', contact: '01933333333', salary: 30000 },
];