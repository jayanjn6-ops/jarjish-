
import React, { useState, useMemo, useEffect } from 'react';
import type { SearchCriteria, Trip, Booking, Passenger, User, Coach, Route, Role, CoachType, Counter, Discount, Cancellation, CoachCost, CommissionRule, NewsItem, BroadcastMessage, Lottery, CounterQuota, Employee, CompanyUser } from './types';
import { CITIES, COACHES as INITIAL_COACHES, ROUTES as INITIAL_ROUTES, USERS as INITIAL_USERS, INITIAL_BOOKINGS, INITIAL_COUNTERS, INITIAL_DISCOUNTS, INITIAL_COACH_COSTS, INITIAL_COMMISSIONS, INITIAL_NEWS, INITIAL_BROADCASTS, INITIAL_LOTTERIES, INITIAL_QUOTAS, INITIAL_EMPLOYEES, INITIAL_COMPANY_USERS } from './constants';

type View = 'SEARCH' | 'RESULTS' | 'SEATING' | 'PASSENGER_INFO' | 'CONFIRMATION' | 'USER_DASHBOARD';
type AdminView = 'DASHBOARD' | 'COMPANY_USER_LIST' | 'COACHES' | 'COACH_COST' | 'ROUTES' | 'COUNTERS' | 'TICKET_MANAGEMENT' | 'TICKET_CANCELLATION' | 'REPORTS' | 'FARE_MANAGEMENT' | 'FUND_MANAGEMENT' | 'COMMISSION_CONFIG' | 'DISCOUNTS' | 'LOTTERY' | 'BROADCAST' | 'NEWS' | 'USER_MANAGEMENT' | 'COUNTER_QUOTAS' | 'HRD_BOARD' | 'SYSTEM_SETTINGS' | 'TWO_FACTOR_AUTH' | 'CMS_MIGRATION';
type ModalType = 'USER' | 'COACH' | 'ROUTE' | 'COUNTER' | 'DISCOUNT' | 'COACH_COST' | 'COMMISSION' | 'NEWS' | 'BROADCAST' | 'LOTTERY' | 'QUOTA' | 'EMPLOYEE' | 'FARE' | 'COMPANY_USER' | null;

type DepartureTimeSlot = 'morning' | 'afternoon' | 'evening';
type Filters = {
  coachTypes: CoachType[];
  departureTimes: DepartureTimeSlot[];
};
type SortOption = 'fare_asc' | 'fare_desc' | 'departure_asc' | 'departure_desc';


// --- Icon Components ---
const CoachIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-8 w-8 text-white ${className ?? ''}`.trim()}><path d="M8 6v6m-2-6v6m-2-6v6M14 6v6m2-6v6M4 12h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2-2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z"></path><path d="M10 12V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"></path><path d="M18 18v2m-12-2v2"></path></svg>;
const ArrowRightIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 mx-2 text-gray-400 ${className ?? ''}`.trim()}><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>;
const CalendarIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 text-gray-400 ${className ?? ''}`.trim()}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>;
const WifiIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 mr-1 ${className ?? ''}`.trim()}><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" x2="12.01" y1="20" y2="20"></line></svg>;
const ZapIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 mr-1 ${className ?? ''}`.trim()}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
const UserIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 ${className ?? ''}`.trim()}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const UsersIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 mr-3 ${className ?? ''}`.trim()}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const LogoutIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 ${className ?? ''}`.trim()}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>;
const DashboardIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 mr-3 ${className ?? ''}`.trim()}><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>;
const TicketIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 mr-2 ${className ?? ''}`.trim()}><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path></svg>;
const XIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-6 w-6 ${className ?? ''}`.trim()}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const EditIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 ${className ?? ''}`.trim()}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>;
const DeleteIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 ${className ?? ''}`.trim()}><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
const RouteIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 mr-3 ${className ?? ''}`.trim()}><circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" /><circle cx="18" cy="5" r="3" /></svg>;
const PlusIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 mr-1 ${className ?? ''}`.trim()}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const FilterIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 ${className ?? ''}`.trim()}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>;

// --- NEW Icons for Admin Panel ---
const CompanyIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 mr-3 ${className ?? ''}`.trim()}><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" /></svg>;
const DollarSignIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 mr-3 ${className ?? ''}`.trim()}><line x1="12" y1="2" x2="12" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
const MapPinIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 mr-3 ${className ?? ''}`.trim()}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>;
const TicketXIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 mr-3 ${className ?? ''}`.trim()}><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="m9.5 14.5 5-5" /><path d="m14.5 14.5-5-5" /></svg>;
const ChartIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 mr-3 ${className ?? ''}`.trim()}><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>;
const TagIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 mr-3 ${className ?? ''}`.trim()}><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.432 0l6.568-6.568a2.426 2.426 0 0 0 0-3.432L12.586 2.586Z" /><circle cx="8.5" cy="8.5" r=".5" fill="currentColor"/></svg>;
const SpeakerIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 mr-3 ${className ?? ''}`.trim()}><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><circle cx="12" cy="14" r="4" /><line x1="12" y1="6" x2="12.01" y2="6" /></svg>;
const NewspaperIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 mr-3 ${className ?? ''}`.trim()}><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2V4" /><path d="M12 8h4" /><path d="M12 12h4" /><path d="M12 16h4" /><path d="M8 8v8" /></svg>;
const ShieldIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 mr-3 ${className ?? ''}`.trim()}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>;
const SettingsIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 mr-3 ${className ?? ''}`.trim()}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>;


// --- UI Components (Shared) ---

const Footer: React.FC = () => (
  <footer className="bg-gray-800 text-white mt-auto">
    <div className="container mx-auto px-4 py-6 text-center">
      <p>&copy; {new Date().getFullYear()} Jarjish Coach. All rights reserved.</p>
      <p className="text-sm text-gray-400 mt-2">Contact: +880123456789 | info@jarjishbus.com</p>
    </div>
  </footer>
);

const LoginModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => void;
  onSwitchToRegister: () => void;
  error: string;
}> = ({ isOpen, onClose, onLogin, onSwitchToRegister, error }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(username, password);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-sm m-4 relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
                    <XIcon />
                </button>
                <h2 className="text-2xl font-bold text-center text-brand-dark mb-6">Login</h2>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" placeholder="e.g., admin"/>
                    </div>
                     <div>
                        <label htmlFor="password"className="block text-sm font-medium text-gray-700">Password</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" placeholder="e.g., admin123"/>
                    </div>
                    <button type="submit" className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-4 rounded-md transition-colors">Login</button>
                </form>
                 <div className="text-xs text-center text-gray-500 mt-4">
                    <p className="font-bold">Demo Credentials:</p>
                    <p>Admin: admin / admin123</p>
                    <p>Customer: rakib_hasan / customer123</p>
                </div>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?{' '}
                    <button onClick={onSwitchToRegister} className="font-semibold text-brand-primary hover:underline">
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

const RegistrationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onRegister: (username: string, email: string, password: string) => void;
  onSwitchToLogin: () => void;
  error: string;
}> = ({ isOpen, onClose, onRegister, onSwitchToLogin, error }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setPasswordError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }
        setPasswordError('');
        onRegister(username, email, password);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-sm m-4 relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
                    <XIcon />
                </button>
                <h2 className="text-2xl font-bold text-center text-brand-dark mb-6">Create Account</h2>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                {passwordError && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{passwordError}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input id="reg-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    <div>
                        <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                     <div>
                        <label htmlFor="reg-password"className="block text-sm font-medium text-gray-700">Password</label>
                        <input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                     <div>
                        <label htmlFor="reg-confirm-password"className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input id="reg-confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    <button type="submit" className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-4 rounded-md transition-colors">Create Account</button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{' '}
                    <button onClick={onSwitchToLogin} className="font-semibold text-brand-primary hover:underline">
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};


// --- User Panel Components ---

const UserHeader: React.FC<{
  currentUser: User | null;
  onShowLogin: () => void;
  onShowRegistration: () => void;
  onLogout: () => void;
  onNavigate: (view: View) => void;
}> = ({ currentUser, onShowLogin, onShowRegistration, onLogout, onNavigate }) => (
  <header className="bg-brand-dark text-white shadow-lg sticky top-0 z-50">
    <div className="container mx-auto px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('SEARCH')}>
        <CoachIcon />
        <h1 className="text-2xl md:text-3xl font-bold tracking-wider">Jarjish Coach</h1>
      </div>
      <nav className="flex items-center space-x-4">
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('SEARCH'); }} className="text-white hover:text-brand-accent transition-colors">Home</a>
        {currentUser ? (
          <>
            {currentUser.role === 'CUSTOMER' && (
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('USER_DASHBOARD'); }} className="text-white hover:text-brand-accent transition-colors">My Bookings</a>
            )}
            <div className="flex items-center space-x-2 text-brand-light">
              <UserIcon />
              <span>{currentUser.username}</span>
            </div>
            <button onClick={onLogout} className="flex items-center bg-brand-secondary hover:bg-brand-primary text-white font-semibold py-2 px-3 rounded-md transition-colors">
              <LogoutIcon />
            </button>
          </>
        ) : (
          <>
            <button onClick={onShowLogin} className="bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm">Login</button>
            <button onClick={onShowRegistration} className="bg-transparent hover:bg-brand-light text-white font-semibold py-2 px-4 border border-white rounded-md transition-colors text-sm">Sign Up</button>
          </>
        )}
      </nav>
    </div>
  </header>
);

const SearchWidget: React.FC<{ onSearch: (criteria: SearchCriteria) => void }> = ({ onSearch }) => {
  const [from, setFrom] = useState('Dhaka');
  const [to, setTo] = useState('Rajshahi');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ from, to, date });
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 w-full max-w-4xl mx-auto -mt-16 relative z-10 animate-fade-in">
      <h2 className="text-2xl font-bold text-brand-dark mb-6 text-center">Find Your Perfect Trip</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
        <div className="flex flex-col">
          <label htmlFor="from" className="text-sm font-semibold text-gray-600 mb-1">From</label>
          <select id="from" value={from} onChange={(e) => setFrom(e.target.value)} className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary">
            {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="to" className="text-sm font-semibold text-gray-600 mb-1">To</label>
          <select id="to" value={to} onChange={(e) => setTo(e.target.value)} className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary">
            {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="date" className="text-sm font-semibold text-gray-600 mb-1">Date of Journey</label>
          <div className="relative">
             <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2" />
             <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="p-3 pl-10 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary" />
          </div>
        </div>
        <button type="submit" className="md:col-start-3 lg:col-start-4 bg-brand-accent hover:bg-yellow-500 text-brand-dark font-bold py-3 px-6 rounded-md transition-transform transform hover:scale-105 w-full">Search Coaches</button>
      </form>
    </div>
  );
};

const TripCard: React.FC<{ trip: Trip; onSelect: () => void }> = ({ trip, onSelect }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
        <img src={trip.coach.image} alt={trip.coach.name} className="w-full h-48 object-cover" />
        <div className="p-4 flex-grow flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-brand-dark">{trip.coach.name}</h3>
                    <div className={`px-3 py-1 text-sm font-semibold rounded-full ${trip.coach.type === 'AC' ? 'bg-blue-100 text-blue-800' : trip.coach.type === 'Non-AC' ? 'bg-orange-100 text-orange-800' : 'bg-indigo-100 text-indigo-800'}`}>{trip.coach.type}</div>
                </div>
                <p className="text-gray-600">{trip.from} to {trip.to}</p>
            </div>
            <div className="flex items-center justify-between my-4 text-sm text-gray-700">
                <div className="text-center"><p className="font-semibold">Departure</p><p>{trip.departureTime}</p></div>
                <ArrowRightIcon />
                <div className="text-center"><p className="font-semibold">Arrival</p><p>{trip.arrivalTime}</p></div>
            </div>
             <div className="flex items-center text-xs text-gray-500 mb-4">
                {trip.coach.facilities.includes('WiFi') && <span className="flex items-center mr-3"><WifiIcon /> WiFi</span>}
                {trip.coach.facilities.includes('Charging Port') && <span className="flex items-center"><ZapIcon /> Charging Port</span>}
             </div>
            <div className="flex justify-between items-center border-t pt-3 mt-auto">
                <div>
                    <p className="text-lg font-bold text-brand-primary">{trip.fare} BDT</p>
                    <p className="text-sm text-green-600 font-semibold">{trip.availableSeats} seats available</p>
                </div>
                <button onClick={onSelect} className="bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-6 rounded-md transition-colors">View Seats</button>
            </div>
        </div>
    </div>
);

const FilterSortPanel: React.FC<{
    filters: Filters;
    sortBy: SortOption;
    onFilterChange: (filterType: keyof Filters, value: any) => void;
    onSortChange: (value: SortOption) => void;
    tripCount: number;
}> = ({ filters, sortBy, onFilterChange, onSortChange, tripCount }) => {
    
    const handleCoachTypeChange = (type: CoachType, checked: boolean) => {
        const newTypes = checked
            ? [...filters.coachTypes, type]
            : filters.coachTypes.filter(t => t !== type);
        onFilterChange('coachTypes', newTypes);
    };

    const handleDepartureTimeChange = (time: DepartureTimeSlot, checked: boolean) => {
        const newTimes = checked
            ? [...filters.departureTimes, time]
            : filters.departureTimes.filter(t => t !== time);
        onFilterChange('departureTimes', newTimes);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg sticky top-28 h-fit">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h3 className="text-xl font-bold text-brand-dark flex items-center"><FilterIcon className="mr-2" /> Filter & Sort</h3>
                <span className="text-sm font-semibold bg-brand-light text-brand-dark py-1 px-2 rounded-full">{tripCount} trips</span>
            </div>
            {/* Sort Section */}
            <div>
                <label htmlFor="sort" className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                <select id="sort" value={sortBy} onChange={(e) => onSortChange(e.target.value as SortOption)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary">
                    <option value="departure_asc">Departure: Earliest First</option>
                    <option value="departure_desc">Departure: Latest First</option>
                    <option value="fare_asc">Fare: Low to High</option>
                    <option value="fare_desc">Fare: High to Low</option>
                </select>
            </div>

             {/* Filter Section */}
            <div className="mt-6">
                <h4 className="font-semibold text-gray-700 border-t pt-4">Coach Type</h4>
                <div className="space-y-2 mt-2">
                    {(['AC', 'Non-AC', 'Sleeper'] as CoachType[]).map(type => (
                         <label key={type} className="flex items-center">
                            <input type="checkbox" checked={filters.coachTypes.includes(type)} onChange={e => handleCoachTypeChange(type, e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-secondary" />
                            <span className="ml-2 text-gray-600">{type}</span>
                        </label>
                    ))}
                </div>
            </div>
             <div className="mt-4">
                <h4 className="font-semibold text-gray-700 border-t pt-4">Departure Time</h4>
                <div className="space-y-2 mt-2">
                    {(['morning', 'afternoon', 'evening'] as DepartureTimeSlot[]).map(time => (
                         <label key={time} className="flex items-center">
                            <input type="checkbox" checked={filters.departureTimes.includes(time)} onChange={e => handleDepartureTimeChange(time, e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-secondary" />
                            <span className="ml-2 text-gray-600 capitalize">{time}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}

const SearchResults: React.FC<{ 
    trips: Trip[]; 
    onSelectTrip: (trip: Trip) => void; 
    onBack: () => void;
    filters: Filters;
    sortBy: SortOption;
    onFilterChange: (filterType: keyof Filters, value: any) => void;
    onSortChange: (value: SortOption) => void;
}> = (props) => (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
        <button onClick={props.onBack} className="text-brand-primary hover:underline mb-4">&larr; Back to Search</button>
        <h2 className="text-3xl font-bold text-center mb-8 text-brand-dark">Available Trips</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
                <FilterSortPanel {...props} tripCount={props.trips.length} />
            </div>
            <div className="lg:col-span-3">
                {props.trips.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {props.trips.map(trip => <TripCard key={trip.id} trip={trip} onSelect={() => props.onSelectTrip(trip)} />)}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-500 text-xl">No trips match your current filters.</p>
                        <p className="text-sm text-gray-400 mt-2">Try adjusting your filter or sort options.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
);


const Seat: React.FC<{ seatNumber: string; status: 'available' | 'booked' | 'selected'; onSelect: (seat: string) => void }> = ({ seatNumber, status, onSelect }) => {
    const baseClasses = "w-10 h-10 md:w-12 md:h-12 border-2 rounded-md flex items-center justify-center font-semibold text-xs";
    const statusClasses = {
        available: "bg-white border-gray-300 text-gray-600 cursor-pointer hover:bg-brand-light hover:border-brand-primary",
        booked: "bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed",
        selected: "bg-brand-primary border-brand-dark text-white",
    };
    return <button onClick={() => status === 'available' && onSelect(seatNumber)} disabled={status !== 'available'} className={`${baseClasses} ${statusClasses[status]}`}>{seatNumber}</button>;
};

const SeatSelection: React.FC<{ trip: Trip; bookings: Booking[]; onConfirm: (seats: string[]) => void, onBack: () => void }> = ({ trip, bookings, onConfirm, onBack }) => {
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const bookedSeats = useMemo(() => bookings.filter(b => b.trip.id === trip.id).flatMap(b => b.seats), [bookings, trip.id]);

    const handleSelectSeat = (seat: string) => {
        setSelectedSeats(prev => prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]);
    };
    const totalFare = selectedSeats.length * trip.fare;

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            <button onClick={onBack} className="text-brand-primary hover:underline mb-4">&larr; Back to Results</button>
            <h2 className="text-3xl font-bold text-center mb-2 text-brand-dark">Select Your Seats</h2>
            <p className="text-center text-gray-600 mb-8">{trip.coach.name} - {trip.from} to {trip.to}</p>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex justify-end mb-4"><div className="w-10 h-10 md:w-12 md:h-12 border-2 rounded-md flex items-center justify-center font-semibold text-xs bg-gray-200">DRV</div></div>
                    <div className="grid grid-cols-5 gap-2 md:gap-4 justify-items-center">
                        {trip.coach.seatLayout.flat().map((seat, index) => {
                            if (seat === '') return <div key={index} className="w-10 h-10 md:w-12 md:h-12"></div>;
                            const isBooked = bookedSeats.includes(seat);
                            const isSelected = selectedSeats.includes(seat);
                            const status = isSelected ? 'selected' : isBooked ? 'booked' : 'available';
                            return <Seat key={seat} seatNumber={seat} status={status} onSelect={handleSelectSeat} />;
                        })}
                    </div>
                     <div className="mt-6 flex justify-center space-x-4 text-sm">
                        <div className="flex items-center"><div className="w-4 h-4 border-2 border-gray-300 rounded mr-2"></div> Available</div>
                        <div className="flex items-center"><div className="w-4 h-4 bg-brand-primary rounded mr-2"></div> Selected</div>
                        <div className="flex items-center"><div className="w-4 h-4 bg-gray-300 rounded mr-2"></div> Booked</div>
                    </div>
                </div>
                <div className="w-full lg:w-1/3">
                    <div className="bg-white p-6 rounded-lg shadow-lg sticky top-28">
                        <h3 className="text-xl font-bold border-b pb-3 mb-4 text-brand-dark">Booking Summary</h3>
                        <p className="font-semibold">{trip.coach.name}</p>
                        <p className="text-sm text-gray-500">{trip.from} → {trip.to}</p>
                        <div className="mt-4">
                            <p className="font-semibold">Selected Seats:</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {selectedSeats.length > 0 ? selectedSeats.map(s => <span key={s} className="bg-brand-light text-brand-dark font-semibold px-3 py-1 rounded-full text-sm">{s}</span>) : <p className="text-sm text-gray-500">No seats selected</p>}
                            </div>
                        </div>
                        <div className="mt-6 border-t pt-4"><div className="flex justify-between items-center text-lg font-bold"><span>Total Fare:</span><span>{totalFare} BDT</span></div></div>
                        <button onClick={() => onConfirm(selectedSeats)} disabled={selectedSeats.length === 0} className="mt-6 w-full bg-brand-accent hover:bg-yellow-500 text-brand-dark font-bold py-3 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">Proceed</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PassengerForm: React.FC<{ onConfirm: (passenger: Passenger) => void; onBack: () => void }> = ({ onConfirm, onBack }) => {
    const [name, setName] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
    const [contact, setContact] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm({ name, gender, contact });
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-lg animate-fade-in">
             <button onClick={onBack} className="text-brand-primary hover:underline mb-4">&larr; Back to Seat Selection</button>
            <div className="bg-white p-8 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-center mb-8 text-brand-dark">Passenger Information</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"/>
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                        <select id="gender" value={gender} onChange={e => setGender(e.target.value as any)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"><option>Male</option><option>Female</option><option>Other</option></select>
                    </div>
                    <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number</label>
                        <input type="tel" id="contact" value={contact} onChange={e => setContact(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    <button type="submit" className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-3 px-4 rounded-md transition-colors">Confirm Booking</button>
                </form>
            </div>
        </div>
    );
};

const BookingConfirmation: React.FC<{ booking: Booking; onNewSearch: () => void }> = ({ booking, onNewSearch }) => (
    <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in">
        <div className="bg-white p-8 rounded-lg shadow-xl border-t-8 border-green-500">
            <h2 className="text-3xl font-bold text-center text-green-600 mb-4">Booking Successful!</h2>
            <p className="text-center text-gray-600 mb-8">Your ticket has been confirmed. Please check the details below.</p>
            <div className="space-y-4 border-t border-b py-6">
                 <div className="flex justify-between"><span className="font-semibold text-gray-600">Booking ID:</span><span className="font-bold text-brand-dark">{booking.id}</span></div>
                <div className="flex justify-between"><span className="font-semibold text-gray-600">Passenger Name:</span><span>{booking.passenger.name}</span></div>
                 <div className="flex justify-between"><span className="font-semibold text-gray-600">Contact:</span><span>{booking.passenger.contact}</span></div>
                 <div className="flex justify-between"><span className="font-semibold text-gray-600">Coach Operator:</span><span>{booking.trip.coach.name} ({booking.trip.coach.type})</span></div>
                 <div className="flex justify-between"><span className="font-semibold text-gray-600">Route:</span><span>{booking.trip.from} to {booking.trip.to}</span></div>
                <div className="flex justify-between"><span className="font-semibold text-gray-600">Departure:</span><span>{booking.trip.departureTime}</span></div>
                 <div className="flex justify-between"><span className="font-semibold text-gray-600">Selected Seats:</span><span className="font-bold">{booking.seats.join(', ')}</span></div>
            </div>
            <div className="flex justify-between items-center mt-6 bg-brand-light p-4 rounded-md"><span className="text-lg font-bold text-brand-dark">Total Fare Paid:</span><span className="text-2xl font-bold text-brand-primary">{booking.totalFare} BDT</span></div>
            <button onClick={onNewSearch} className="mt-8 w-full bg-brand-accent hover:bg-yellow-500 text-brand-dark font-bold py-3 px-4 rounded-md transition-colors">Book Another Ticket</button>
        </div>
    </div>
);

const UserDashboard: React.FC<{ bookings: Booking[]; user: User }> = ({ bookings, user }) => {
    const userBookings = bookings.filter(b => b.userId === user.id);
    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            <h2 className="text-3xl font-bold mb-8 text-brand-dark flex items-center"><TicketIcon /> My Bookings</h2>
            {userBookings.length > 0 ? (
                <div className="space-y-6">
                    {userBookings.map(booking => (
                        <div key={booking.id} className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${booking.status === 'Cancelled' ? 'border-red-500' : 'border-brand-primary'}`}>
                            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                                <div><p className="text-xl font-bold text-brand-dark">{booking.trip.from} to {booking.trip.to}</p><p className="text-sm text-gray-500">{new Date(booking.bookingDate).toDateString()}</p></div>
                                <div className="flex items-center gap-4 mt-2 md:mt-0">
                                  {booking.status === 'Cancelled' && <span className="text-sm font-bold text-red-500 bg-red-100 py-1 px-3 rounded-full">CANCELLED</span>}
                                  <p className="text-lg font-semibold text-brand-primary">{booking.totalFare} BDT</p>
                                </div>
                            </div>
                            <div className="border-t pt-4 space-y-2 text-sm">
                                <p><span className="font-semibold">Coach:</span> {booking.trip.coach.name}</p>
                                <p><span className="font-semibold">Departure:</span> {booking.trip.departureTime}</p>
                                <p><span className="font-semibold">Seats:</span> <span className="font-bold">{booking.seats.join(', ')}</span></p>
                                <p><span className="font-semibold">Booking ID:</span> {booking.id}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (<p>You have no bookings yet.</p>)}
        </div>
    );
};

const UserPanel: React.FC<{
    currentUser: User | null;
    bookings: Booking[];
    routes: Route[];
    coaches: Coach[];
    onLogout: () => void;
    onShowLogin: () => void;
    onShowRegistration: () => void;
    onNewBooking: (booking: Booking) => void;
    onRequireLogin: (action: () => void) => void;
}> = ({ currentUser, bookings, routes, coaches, onLogout, onShowLogin, onShowRegistration, onNewBooking, onRequireLogin }) => {
    const [view, setView] = useState<View>('SEARCH');
    const [trips, setTrips] = useState<Trip[]>([]);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);
    const [filters, setFilters] = useState<Filters>({ coachTypes: [], departureTimes: [] });
    const [sortBy, setSortBy] = useState<SortOption>('departure_asc');

    const resetSearch = () => {
        setView('SEARCH');
        setTrips([]);
        setSelectedTrip(null);
        setSelectedSeats([]);
        setBookingDetails(null);
        setFilters({ coachTypes: [], departureTimes: [] });
        setSortBy('departure_asc');
    }

    const handleSearch = (criteria: SearchCriteria) => {
        const foundRoutes = routes.filter(r => r.from === criteria.from && r.to === criteria.to);
        const populatedTrips = foundRoutes.map(r => ({ ...r, coach: coaches.find(b => b.id === r.coachId)! })).filter(t => t.coach && t.coach.isActive);
        setTrips(populatedTrips);
        setView('RESULTS');
    };

    const handleSelectTrip = (trip: Trip) => {
        setSelectedTrip(trip);
        setView('SEATING');
    };
  
    const handleSeatConfirm = (seats: string[]) => {
        if (!currentUser) {
            onRequireLogin(() => {
                setSelectedSeats(seats);
                setView('PASSENGER_INFO');
            });
        } else {
            setSelectedSeats(seats);
            setView('PASSENGER_INFO');
        }
    };
  
    const handlePassengerConfirm = (passenger: Passenger) => {
        if (!selectedTrip) return;
        const newBooking: Booking = {
            id: `BK${Date.now()}`,
            trip: selectedTrip,
            seats: selectedSeats,
            passenger: passenger,
            totalFare: selectedSeats.length * selectedTrip.fare,
            paymentStatus: 'Paid',
            bookingDate: new Date().toISOString().split('T')[0],
            userId: currentUser?.id || null,
            status: 'Confirmed'
        };
        onNewBooking(newBooking);
        setBookingDetails(newBooking);
        setView('CONFIRMATION');
    };

    const handleFilterChange = (filterType: keyof Filters, value: any) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    const timeTo24Hour = (timeStr: string): number => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0; // Midnight case
        return hours * 100 + minutes;
    };

    const filteredAndSortedTrips = useMemo(() => {
        let processedTrips = [...trips];

        // Apply filters
        if (filters.coachTypes.length > 0) {
            processedTrips = processedTrips.filter(trip => filters.coachTypes.includes(trip.coach.type));
        }

        if (filters.departureTimes.length > 0) {
            processedTrips = processedTrips.filter(trip => {
                const departureHour = timeTo24Hour(trip.departureTime) / 100;
                return filters.departureTimes.some(timeSlot => {
                    if (timeSlot === 'morning' && departureHour < 12) return true;
                    if (timeSlot === 'afternoon' && departureHour >= 12 && departureHour < 18) return true;
                    if (timeSlot === 'evening' && departureHour >= 18) return true;
                    return false;
                });
            });
        }
        
        // Apply sorting
        processedTrips.sort((a, b) => {
            switch (sortBy) {
                case 'fare_asc': return a.fare - b.fare;
                case 'fare_desc': return b.fare - a.fare;
                case 'departure_asc': return timeTo24Hour(a.departureTime) - timeTo24Hour(b.departureTime);
                case 'departure_desc': return timeTo24Hour(b.departureTime) - timeTo24Hour(a.departureTime);
                default: return 0;
            }
        });

        return processedTrips;
    }, [trips, filters, sortBy]);

    const renderView = () => {
        switch (view) {
            case 'RESULTS': return <SearchResults trips={filteredAndSortedTrips} onSelectTrip={handleSelectTrip} onBack={() => setView('SEARCH')} filters={filters} sortBy={sortBy} onFilterChange={handleFilterChange} onSortChange={setSortBy} />;
            case 'SEATING': return selectedTrip && <SeatSelection trip={selectedTrip} bookings={bookings} onConfirm={handleSeatConfirm} onBack={() => setView('RESULTS')} />;
            case 'PASSENGER_INFO': return <PassengerForm onConfirm={handlePassengerConfirm} onBack={() => setView('SEATING')} />;
            case 'CONFIRMATION': return bookingDetails && <BookingConfirmation booking={bookingDetails} onNewSearch={resetSearch} />;
            case 'USER_DASHBOARD': return currentUser && <UserDashboard bookings={bookings} user={currentUser} />;
            case 'SEARCH': default: return null;
        }
    };

    return (
        <div className="flex flex-col min-h-screen font-sans bg-gray-50">
            <UserHeader currentUser={currentUser} onShowLogin={onShowLogin} onShowRegistration={onShowRegistration} onLogout={onLogout} onNavigate={setView}/>
            <main className="flex-grow">
                {view === 'SEARCH' && (
                    <>
                        <div className="h-64 md:h-80 bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/seed/road/1200/400')"}}>
                            <div className="h-full w-full bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-center p-4">
                                <h1 className="text-4xl md:text-5xl font-extrabold">Your Journey, Our Priority</h1>
                                <p className="mt-2 text-lg md:text-xl max-w-2xl">Book your coach tickets with ease and travel with comfort.</p>
                            </div>
                        </div>
                        <SearchWidget onSearch={handleSearch} />
                    </>
                )}
                {renderView()}
            </main>
            <Footer />
        </div>
    );
};


// --- Admin Panel Components ---

const AdminHeader: React.FC<{title: string; onAdd?: () => void; addText?: string; children?: React.ReactNode }> = ({ title, onAdd, addText, children }) => (
    <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-brand-dark">{title}</h2>
        <div className="flex items-center space-x-2">
            {children}
            {onAdd && addText && (
                <button onClick={onAdd} className="bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-4 rounded-md flex items-center transition-colors">
                    <PlusIcon/> {addText}
                </button>
            )}
        </div>
    </div>
);

const AdminTableWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
            {children}
        </div>
    </div>
);

const Table: React.FC<{headers: string[]; children: React.ReactNode}> = ({ headers, children }) => (
    <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase">
            <tr>{headers.map(h => <th key={h} className="p-3">{h}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
    </table>
);

const TableRow: React.FC<{children: React.ReactNode; onEdit?: () => void; onDelete?: () => void;}> = ({ children, onEdit, onDelete }) => (
    <tr className="border-b hover:bg-gray-50">
        {children}
        {(onEdit || onDelete) && (
            <td className="p-3">
              <div className="flex space-x-2">
                {onEdit && <button onClick={onEdit} className="text-blue-600 hover:text-blue-800"><EditIcon /></button>}
                {onDelete && <button onClick={() => window.confirm('Are you sure?') && onDelete()} className="text-red-600 hover:text-red-800"><DeleteIcon /></button>}
              </div>
            </td>
        )}
    </tr>
);


const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-brand-light p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-gray-500 text-sm font-semibold">{title}</p>
            <p className="text-2xl font-bold text-brand-dark">{value}</p>
        </div>
    </div>
);

const AdminDashboard: React.FC<{ bookings: Booking[], coaches: Coach[], routes: Route[] }> = ({ bookings, coaches, routes }) => {
    const totalRevenue = bookings.filter(b => b.status === 'Confirmed').reduce((sum, b) => sum + b.totalFare, 0);
    const today = new Date().toISOString().split('T')[0];
    const todaysSales = bookings.filter(b => b.bookingDate === today && b.status === 'Confirmed').reduce((sum, b) => sum + b.totalFare, 0);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8 text-brand-dark">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Revenue" value={`${totalRevenue} BDT`} icon={<span className="text-2xl">৳</span>} />
                <StatCard title="Today's Sales" value={`${todaysSales} BDT`} icon={<CalendarIcon className="h-6 w-6 text-brand-primary" />} />
                <StatCard title="Total Bookings" value={bookings.length.toString()} icon={<TicketIcon className="h-6 w-6 text-brand-primary" />} />
                <StatCard title="Total Coaches" value={coaches.length.toString()} icon={<CoachIcon className="h-6 w-6 text-brand-primary text-brand-dark" />} />
            </div>
            <AdminTableWrapper>
                 <h3 className="text-xl font-bold mb-4 text-brand-dark p-3">Recent Bookings</h3>
                 <Table headers={['ID', 'Passenger', 'Route', 'Fare', 'Status', 'Date']}>
                    {bookings.slice(0, 5).map(b => (
                        <tr key={b.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{b.id}</td>
                          <td className="p-3">{b.passenger.name}</td>
                          <td className="p-3">{b.trip.from} &rarr; {b.trip.to}</td>
                          <td className="p-3">{b.totalFare} BDT</td>
                          <td className="p-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${b.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{b.status}</span></td>
                          <td className="p-3">{b.bookingDate}</td>
                        </tr>
                    ))}
                </Table>
            </AdminTableWrapper>
        </div>
    );
};

const UserManagement: React.FC<{ users: User[], onEdit: (user: User) => void, onAdd: () => void, onDelete: (userId: string) => void }> = ({ users, onEdit, onAdd, onDelete }) => (
    <div>
        <AdminHeader title="User Management" onAdd={onAdd} addText="Add User" />
        <AdminTableWrapper>
            <Table headers={['ID', 'Username', 'Email', 'Role', 'Actions']}>
                {users.map(u => (
                    <TableRow key={u.id} onEdit={() => onEdit(u)} onDelete={() => onDelete(u.id)}>
                        <td className="p-3 font-medium">{u.id}</td>
                        <td className="p-3">{u.username}</td>
                        <td className="p-3">{u.email}</td>
                        <td className="p-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${u.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{u.role}</span></td>
                    </TableRow>
                ))}
            </Table>
        </AdminTableWrapper>
    </div>
);

const CoachManagement: React.FC<{ coaches: Coach[], onEdit: (coach: Coach) => void, onAdd: () => void, onDelete: (coachId: string) => void, onToggleStatus: (coach: Coach) => void }> = ({ coaches, onEdit, onAdd, onDelete, onToggleStatus }) => (
    <div>
        <AdminHeader title="Coach Management" onAdd={onAdd} addText="Add Coach"/>
        <AdminTableWrapper>
            <Table headers={['ID', 'Name', 'Type', 'Seats', 'Status', 'Actions']}>
                {coaches.map(c => (
                    <TableRow key={c.id} onEdit={() => onEdit(c)} onDelete={() => onDelete(c.id)}>
                        <td className="p-3 font-medium">{c.id}</td><td className="p-3">{c.name}</td>
                        <td className="p-3">{c.type}</td><td className="p-3">{c.totalSeats}</td>
                        <td className="p-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={c.isActive} onChange={() => onToggleStatus(c)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className={`ml-3 text-sm font-medium ${c.isActive ? 'text-green-600' : 'text-red-600'}`}>{c.isActive ? 'Active' : 'Inactive'}</span>
                            </label>
                        </td>
                    </TableRow>
                ))}
            </Table>
        </AdminTableWrapper>
    </div>
);

const RouteManagement: React.FC<{ routes: Route[], onEdit: (route: Route) => void, onAdd: () => void, onDelete: (routeId: string) => void }> = ({ routes, onEdit, onAdd, onDelete }) => (
     <div>
        <AdminHeader title="Route Management" onAdd={onAdd} addText="Add Route"/>
        <AdminTableWrapper>
            <Table headers={['ID', 'From', 'To', 'Coach ID', 'Fare', 'Actions']}>
                {routes.map(r => (
                    <TableRow key={r.id} onEdit={() => onEdit(r)} onDelete={() => onDelete(r.id)}>
                        <td className="p-3 font-medium">{r.id}</td><td className="p-3">{r.from}</td>
                        <td className="p-3">{r.to}</td><td className="p-3">{r.coachId}</td>
                        <td className="p-3">{r.fare} BDT</td>
                    </TableRow>
                ))}
            </Table>
        </AdminTableWrapper>
    </div>
);

const TicketManagement: React.FC<{ bookings: Booking[], onCancel: (bookingId: string) => void }> = ({ bookings, onCancel }) => (
    <div>
        <AdminHeader title="Ticket Management" />
        <AdminTableWrapper>
            <Table headers={['ID', 'Passenger', 'Route', 'Seats', 'Fare', 'Status', 'Action']}>
                {bookings.map(b => (
                    <tr key={b.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{b.id}</td><td className="p-3">{b.passenger.name}</td>
                        <td className="p-3">{b.trip.from} &rarr; {b.trip.to}</td>
                        <td className="p-3">{b.seats.join(', ')}</td><td className="p-3">{b.totalFare} BDT</td>
                        <td className="p-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${b.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{b.status}</span></td>
                        <td className="p-3">
                            {b.status === 'Confirmed' && (
                                <button onClick={() => window.confirm('Cancel this ticket?') && onCancel(b.id)} className="text-red-600 hover:text-red-800 text-xs font-semibold bg-red-100 px-2 py-1 rounded-md">Cancel</button>
                            )}
                        </td>
                    </tr>
                ))}
            </Table>
        </AdminTableWrapper>
    </div>
);

const TicketCancellationLog: React.FC<{cancellations: Cancellation[], users: User[]}> = ({cancellations, users}) => (
    <div>
        <AdminHeader title="Ticket Cancellation Log" />
        <AdminTableWrapper>
            <Table headers={['Cancellation ID', 'Booking ID', 'Date', 'Refund Amount', 'Processed By']}>
                {cancellations.map(c => (
                     <tr key={c.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{c.id}</td>
                        <td className="p-3">{c.bookingId}</td>
                        <td className="p-3">{c.cancellationDate}</td>
                        <td className="p-3">{c.refundAmount.toFixed(2)} BDT</td>
                        <td className="p-3">{users.find(u => u.id === c.processedBy)?.username || 'N/A'}</td>
                    </tr>
                ))}
            </Table>
        </AdminTableWrapper>
    </div>
);

const ReportsView: React.FC<{ bookings: Booking[], routes: Route[], coaches: Coach[] }> = ({ bookings, routes, coaches }) => {
    const revenueByRoute = useMemo(() => {
        const revenueMap = new Map<string, number>();
        bookings.filter(b => b.status === 'Confirmed').forEach(b => {
            const routeName = `${b.trip.from} - ${b.trip.to}`;
            revenueMap.set(routeName, (revenueMap.get(routeName) || 0) + b.totalFare);
        });
        return Array.from(revenueMap.entries()).sort((a, b) => b[1] - a[1]);
    }, [bookings]);

    const ticketsByCoach = useMemo(() => {
        const ticketMap = new Map<string, number>();
        bookings.filter(b => b.status === 'Confirmed').forEach(b => {
             const coachName = coaches.find(c => c.id === b.trip.coachId)?.name || 'Unknown';
             ticketMap.set(coachName, (ticketMap.get(coachName) || 0) + b.seats.length);
        });
        return Array.from(ticketMap.entries()).sort((a, b) => b[1] - a[1]);
    }, [bookings, coaches]);

    const maxRevenue = Math.max(...revenueByRoute.map(r => r[1]), 0);

    return (
        <div>
            <AdminHeader title="Reports" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-brand-dark mb-4">Revenue by Route</h3>
                    <div className="space-y-3">
                        {revenueByRoute.map(([routeName, revenue]) => (
                            <div key={routeName}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-semibold text-gray-700">{routeName}</span>
                                    <span className="font-bold text-brand-primary">{revenue} BDT</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div className="bg-brand-secondary h-4 rounded-full" style={{ width: `${(revenue / maxRevenue) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-brand-dark mb-4">Tickets Sold by Coach</h3>
                    <div className="space-y-2">
                         {ticketsByCoach.map(([coachName, count]) => (
                             <div key={coachName} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                                 <span className="font-semibold text-gray-700">{coachName}</span>
                                 <span className="font-bold text-white bg-brand-primary px-3 py-1 text-xs rounded-full">{count} tickets</span>
                             </div>
                         ))}
                    </div>
                </div>
            </div>
        </div>
    )
};

const CoachCostManagement: React.FC<{ coachCosts: CoachCost[], coaches: Coach[], onSave: (cost: CoachCost) => void, onDelete: (id: string) => void }> = ({ coachCosts, coaches, onSave, onDelete }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCost, setEditingCost] = useState<CoachCost | null>(null);

    const handleEdit = (cost: CoachCost) => {
        setEditingCost(cost);
        setModalOpen(true);
    };

    const handleAdd = () => {
        setEditingCost(null);
        setModalOpen(true);
    };

    const handleSave = (cost: CoachCost) => {
        onSave(cost);
        setModalOpen(false);
    };

    return (
        <div>
            <AdminHeader title="Coach Costs" onAdd={handleAdd} addText="Add Cost Entry" />
            <AdminTableWrapper>
                <Table headers={['ID', 'Coach', 'Cost Type', 'Amount', 'Date', 'Description', 'Actions']}>
                    {coachCosts.map(c => (
                        <TableRow key={c.id} onEdit={() => handleEdit(c)} onDelete={() => onDelete(c.id)}>
                            <td className="p-3 font-medium">{c.id}</td>
                            <td className="p-3">{coaches.find(coach => coach.id === c.coachId)?.name || 'N/A'}</td>
                            <td className="p-3">{c.costType}</td>
                            <td className="p-3">{c.amount} BDT</td>
                            <td className="p-3">{c.date}</td>
                            <td className="p-3 truncate max-w-xs">{c.description}</td>
                        </TableRow>
                    ))}
                </Table>
            </AdminTableWrapper>
            {modalOpen && <CoachCostFormModal cost={editingCost} coaches={coaches} onSave={handleSave} onClose={() => setModalOpen(false)} />}
        </div>
    );
};

const CommissionManagement: React.FC<{ commissions: CommissionRule[], counters: Counter[], onSave: (commission: CommissionRule) => void, onDelete: (id: string) => void }> = ({ commissions, counters, onSave, onDelete }) => (
    <div>
        <AdminHeader title="Commission Configuration" />
        <AdminTableWrapper>
             <Table headers={['Applies To', 'Rate (%)', 'Description']}>
                {commissions.map(c => (
                    <tr key={c.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">
                            {c.appliesTo === 'ALL_COUNTERS' ? 'All Counters' : `Counter: ${counters.find(ctr => ctr.id === c.counterId)?.name || 'N/A'}`}
                        </td>
                        <td className="p-3">{c.rate}%</td>
                        <td className="p-3">{c.description}</td>
                    </tr>
                ))}
            </Table>
        </AdminTableWrapper>
    </div>
);

const NewsManagement: React.FC<{ news: NewsItem[], onSave: (item: NewsItem) => void, onDelete: (id: string) => void, currentUser: User }> = ({ news, onSave, onDelete, currentUser }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

    const handleSave = (item: NewsItem) => {
        onSave(item);
        setModalOpen(false);
    };
    
    return (
        <div>
            <AdminHeader title="News Zone" onAdd={() => { setEditingItem(null); setModalOpen(true); }} addText="Add News" />
            <AdminTableWrapper>
                <Table headers={['Title', 'Published Date', 'Author', 'Actions']}>
                    {news.map(item => (
                        <TableRow key={item.id} onEdit={() => { setEditingItem(item); setModalOpen(true); }} onDelete={() => onDelete(item.id)}>
                            <td className="p-3 font-medium">{item.title}</td>
                            <td className="p-3">{item.publishedDate}</td>
                            <td className="p-3">{item.author}</td>
                        </TableRow>
                    ))}
                </Table>
            </AdminTableWrapper>
            {modalOpen && <NewsFormModal item={editingItem} onSave={handleSave} onClose={() => setModalOpen(false)} authorName={currentUser.username} />}
        </div>
    );
};

const LotteryManagement: React.FC<{ lotteries: Lottery[], bookings: Booking[], onSave: (l: Lottery) => void, onDelete: (id: string) => void }> = ({ lotteries, bookings, onSave, onDelete }) => {
    const handleDrawWinner = (lottery: Lottery) => {
        const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');
        if (confirmedBookings.length === 0) {
            alert('No confirmed tickets to draw from!');
            return;
        }
        const winner = confirmedBookings[Math.floor(Math.random() * confirmedBookings.length)];
        onSave({ ...lottery, winningTicketId: winner.id });
        alert(`Winner is ticket ID: ${winner.id}`);
    };
    
    return(
         <div>
            <AdminHeader title="Lottery Management" />
            <AdminTableWrapper>
                <Table headers={['Name', 'Draw Date', 'Prize', 'Winning Ticket', 'Action']}>
                    {lotteries.map(l => (
                        <tr key={l.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{l.name}</td>
                            <td className="p-3">{l.drawDate}</td>
                            <td className="p-3">{l.prize}</td>
                            <td className="p-3 font-bold text-green-600">{l.winningTicketId || 'Not Drawn'}</td>
                            <td className="p-3">
                                {!l.winningTicketId && (
                                    <button onClick={() => handleDrawWinner(l)} className="text-sm bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded">
                                        Draw Winner
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </Table>
            </AdminTableWrapper>
        </div>
    );
};

const HRDManagement: React.FC<{ employees: Employee[], onSave: (e: Employee) => void, onDelete: (id: string) => void }> = ({ employees, onSave, onDelete }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Employee | null>(null);

    const handleSave = (item: Employee) => {
        onSave(item);
        setModalOpen(false);
    };
    
    return (
        <div>
            <AdminHeader title="HRD Board (Employee Mgt.)" onAdd={() => { setEditingItem(null); setModalOpen(true); }} addText="Add Employee" />
            <AdminTableWrapper>
                <Table headers={['ID', 'Name', 'Position', 'Contact', 'Salary (BDT)', 'Actions']}>
                    {employees.map(item => (
                        <TableRow key={item.id} onEdit={() => { setEditingItem(item); setModalOpen(true); }} onDelete={() => onDelete(item.id)}>
                            <td className="p-3 font-medium">{item.id}</td>
                            <td className="p-3">{item.name}</td>
                            <td className="p-3">{item.position}</td>
                            <td className="p-3">{item.contact}</td>
                            <td className="p-3">{item.salary.toLocaleString()}</td>
                        </TableRow>
                    ))}
                </Table>
            </AdminTableWrapper>
            {modalOpen && <EmployeeFormModal item={editingItem} onSave={handleSave} onClose={() => setModalOpen(false)} />}
        </div>
    );
};

const CompanyUserManagement: React.FC<{ 
    companyUsers: CompanyUser[], 
    counters: Counter[],
    onSave: (user: CompanyUser) => void, 
    onDelete: (id: string) => void 
}> = ({ companyUsers, counters, onSave, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<CompanyUser | null>(null);
    const itemsPerPage = 10;

    const filteredUsers = companyUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleEdit = (user: CompanyUser) => {
        setEditingUser(user);
        setModalOpen(true);
    };

    const handleAdd = () => {
        setEditingUser(null);
        setModalOpen(true);
    };
    
    const handleSave = (user: CompanyUser) => {
        onSave(user);
        setModalOpen(false);
    };

    return (
        <div>
            <AdminHeader title="Company User List" onAdd={handleAdd} addText="Add New Company User" />
            
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages} pages | View {itemsPerPage} per page | Total {filteredUsers.length} records found
                    </div>
                    <div className="flex items-center gap-2">
                         <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md text-sm">
                            PDF Report
                        </button>
                        <input
                            type="text"
                            placeholder="Search by User Name..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md text-sm"
                        />
                    </div>
                </div>
            </div>

            <AdminTableWrapper>
                <Table headers={['User Name', 'Contact', 'Picture', 'Role/User Groups', 'Counter', 'Type', 'Status', 'Action']}>
                    {paginatedUsers.map(user => (
                        <TableRow key={user.id} onEdit={() => handleEdit(user)} onDelete={() => onDelete(user.id)}>
                            <td className="p-3">
                                <a href="#" onClick={(e) => { e.preventDefault(); handleEdit(user); }} className="text-brand-primary hover:underline font-semibold">
                                    {user.username}
                                </a>
                            </td>
                            <td className="p-3">{user.contact}</td>
                            <td className="p-3">
                                <img src={user.pictureUrl} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                            </td>
                            <td className="p-3">{user.roleGroup}</td>
                            <td className="p-3">{counters.find(c => c.id === user.counterId)?.name || 'N/A'}</td>
                            <td className="p-3 capitalize">{user.type}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {user.status}
                                </span>
                            </td>
                        </TableRow>
                    ))}
                </Table>
            </AdminTableWrapper>
            
             {/* Pagination */}
            <div className="flex justify-center mt-6">
                <nav className="flex rounded-md shadow">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                        Previous
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        {currentPage}
                    </span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                        Next
                    </button>
                </nav>
            </div>
            {modalOpen && <CompanyUserFormModal user={editingUser} counters={counters} onSave={handleSave} onClose={() => setModalOpen(false)} />}
        </div>
    );
};


const PlaceholderView: React.FC<{title: string}> = ({title}) => (
    <div>
        <AdminHeader title={title} />
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-lg">This feature is under construction.</p>
            <p className="text-sm text-gray-400 mt-2">The UI is ready, and backend integration will be available soon.</p>
        </div>
    </div>
);


// --- Admin Modal Forms ---

const ModalWrapper: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md m-4 relative">
            <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"><XIcon /></button>
            <h2 className="text-2xl font-bold text-center text-brand-dark mb-6">{title}</h2>
            {children}
        </div>
    </div>
);

const UserFormModal: React.FC<{ user?: User | null, onSave: (user: User) => void, onClose: () => void }> = ({ user, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<User, 'id'>>({ username: '', email: '', password: '', role: 'CUSTOMER' });
    
    useEffect(() => {
        if (user) setFormData({ username: user.username, email: user.email, password: user.password, role: user.role });
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: user?.id || `U${Date.now()}`, ...formData });
    };

    return (
         <ModalWrapper title={`${user ? 'Edit' : 'Add'} User`} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="w-full p-2 border rounded"/>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded"/>
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required={!user} className="w-full p-2 border rounded"/>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded"><option value="CUSTOMER">CUSTOMER</option><option value="ADMIN">ADMIN</option></select>
                <button type="submit" className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-4 rounded-md transition-colors">Save User</button>
            </form>
         </ModalWrapper>
    );
};

const CompanyUserFormModal: React.FC<{ user?: CompanyUser | null, counters: Counter[], onSave: (user: CompanyUser) => void, onClose: () => void }> = ({ user, counters, onSave, onClose }) => {
    const [formData, setFormData] = useState({ 
        username: '', 
        contact: '',
        roleGroup: 'Counter Master' as CompanyUser['roleGroup'],
        counterId: counters[0]?.id || '',
        type: 'Postpaid' as CompanyUser['type'],
        status: 'active' as CompanyUser['status'],
    });
    
    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                contact: user.contact,
                roleGroup: user.roleGroup,
                counterId: user.counterId,
                type: user.type,
                status: user.status,
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newOrUpdatedUser: CompanyUser = {
            id: user?.id || `CU${Date.now()}`,
            username: formData.username,
            contact: formData.contact,
            roleGroup: formData.roleGroup,
            counterId: formData.counterId,
            type: formData.type,
            status: formData.status,
            pictureUrl: user?.pictureUrl || `https://i.pravatar.cc/150?u=${formData.username}`,
        };
        onSave(newOrUpdatedUser);
    };

    return (
         <ModalWrapper title={`${user ? 'Edit' : 'Add'} Company User`} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="w-full p-2 border rounded"/>
                <input type="text" name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} required className="w-full p-2 border rounded"/>
                <select name="roleGroup" value={formData.roleGroup} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="Counter Master">Counter Master</option>
                    <option value="Company Administrator">Company Administrator</option>
                    <option value="Call Center">Call Center</option>
                </select>
                <select name="counterId" value={formData.counterId} onChange={handleChange} required className="w-full p-2 border rounded">
                    {counters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="Postpaid">Postpaid</option>
                    <option value="own">Own</option>
                </select>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <button type="submit" className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-4 rounded-md transition-colors">Save User</button>
            </form>
         </ModalWrapper>
    );
};

const CoachFormModal: React.FC<{ coach?: Coach | null, onSave: (coach: Coach) => void, onClose: () => void }> = ({ coach, onSave, onClose }) => {
    const [formData, setFormData] = useState({ name: '', type: 'AC' as CoachType, totalSeats: 40, facilities: 'WiFi, Charging Port', isActive: true });

    useEffect(() => {
        if (coach) setFormData({ name: coach.name, type: coach.type, totalSeats: coach.totalSeats, facilities: coach.facilities.join(', '), isActive: coach.isActive });
    }, [coach]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: name === 'totalSeats' ? parseInt(value) : value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const defaultLayout = Array(10).fill(0).map((_, r) => [`${String.fromCharCode(65 + r)}1`, `${String.fromCharCode(65 + r)}2`, '', `${String.fromCharCode(65 + r)}3`, `${String.fromCharCode(65 + r)}4`]);
        onSave({
            id: coach?.id || `COACH${Date.now()}`,
            name: formData.name,
            type: formData.type,
            totalSeats: formData.totalSeats,
            facilities: formData.facilities.split(',').map(f => f.trim()),
            image: `https://picsum.photos/seed/${formData.name.split(' ')[0]}/400/200`,
            seatLayout: defaultLayout, // Using a default layout for simplicity
            isActive: formData.isActive
        });
    };
    
    return (
        <ModalWrapper title={`${coach ? 'Edit' : 'Add'} Coach`} onClose={onClose}>
           <form onSubmit={handleSubmit} className="space-y-4">
               <input type="text" name="name" placeholder="Coach Name / Operator" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded"/>
               <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded"><option>AC</option><option>Non-AC</option><option>Sleeper</option></select>
               <input type="number" name="totalSeats" placeholder="Total Seats" value={formData.totalSeats} onChange={handleChange} required className="w-full p-2 border rounded"/>
               <input type="text" name="facilities" placeholder="Facilities (comma-separated)" value={formData.facilities} onChange={handleChange} required className="w-full p-2 border rounded"/>
               <label className="flex items-center"><input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-secondary" /><span className="ml-2 text-gray-600">Is Active</span></label>
               <button type="submit" className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-4 rounded-md transition-colors">Save Coach</button>
           </form>
        </ModalWrapper>
   );
};

const RouteFormModal: React.FC<{ route?: Route | null, coaches: Coach[], onSave: (route: Route) => void, onClose: () => void }> = ({ route, coaches, onSave, onClose }) => {
    const [formData, setFormData] = useState({ from: 'Dhaka', to: 'Rajshahi', departureTime: '08:00 AM', arrivalTime: '01:00 PM', coachId: coaches[0]?.id || '', availableSeats: 40, fare: 800 });

    useEffect(() => {
        if (route) setFormData({from: route.from, to: route.to, departureTime: route.departureTime, arrivalTime: route.arrivalTime, coachId: route.coachId, availableSeats: route.availableSeats, fare: route.fare });
    }, [route]);

     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'fare' || name === 'availableSeats' ? parseInt(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: route?.id || `RT${Date.now()}`, ...formData });
    };

    return (
        <ModalWrapper title={`${route ? 'Edit' : 'Add'} Route`} onClose={onClose}>
           <form onSubmit={handleSubmit} className="space-y-4">
               <select name="from" value={formData.from} onChange={handleChange} className="w-full p-2 border rounded">{CITIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
               <select name="to" value={formData.to} onChange={handleChange} className="w-full p-2 border rounded">{CITIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
               <input type="text" name="departureTime" placeholder="Departure Time (e.g., 08:00 AM)" value={formData.departureTime} onChange={handleChange} required className="w-full p-2 border rounded"/>
               <input type="text" name="arrivalTime" placeholder="Arrival Time (e.g., 01:00 PM)" value={formData.arrivalTime} onChange={handleChange} required className="w-full p-2 border rounded"/>
               <select name="coachId" value={formData.coachId} onChange={handleChange} required className="w-full p-2 border rounded">{coaches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.id})</option>)}</select>
               <input type="number" name="fare" placeholder="Fare" value={formData.fare} onChange={handleChange} required className="w-full p-2 border rounded"/>
               <button type="submit" className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-4 rounded-md transition-colors">Save Route</button>
           </form>
        </ModalWrapper>
    );
};

const CoachCostFormModal: React.FC<{ cost?: CoachCost | null, coaches: Coach[], onSave: (cost: CoachCost) => void, onClose: () => void }> = ({ cost, coaches, onSave, onClose }) => {
    const [formData, setFormData] = useState({ coachId: coaches[0]?.id || '', costType: 'Maintenance' as CoachCost['costType'], amount: 0, date: new Date().toISOString().split('T')[0], description: '' });

    useEffect(() => {
        if (cost) setFormData(cost);
    }, [cost]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: cost?.id || `CST${Date.now()}` });
    };

    return (
        <ModalWrapper title={`${cost ? 'Edit' : 'Add'} Coach Cost`} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <select name="coachId" value={formData.coachId} onChange={handleChange} required className="w-full p-2 border rounded">{coaches.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <select name="costType" value={formData.costType} onChange={handleChange} required className="w-full p-2 border rounded">
                    <option>Maintenance</option><option>Fuel</option><option>Driver Salary</option><option>Other</option>
                </select>
                <input type="number" name="amount" placeholder="Amount (BDT)" value={formData.amount} onChange={handleChange} required className="w-full p-2 border rounded"/>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full p-2 border rounded"/>
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="w-full p-2 border rounded h-24"/>
                <button type="submit" className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-4 rounded-md transition-colors">Save Cost</button>
            </form>
        </ModalWrapper>
    );
};

const NewsFormModal: React.FC<{ item?: NewsItem | null, onSave: (item: NewsItem) => void, onClose: () => void, authorName: string }> = ({ item, onSave, onClose, authorName }) => {
    const [formData, setFormData] = useState({ title: '', content: '' });

    useEffect(() => {
        if (item) setFormData({ title: item.title, content: item.content });
    }, [item]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: item?.id || `NWS${Date.now()}`, publishedDate: new Date().toISOString().split('T')[0], author: authorName });
    };

    return (
        <ModalWrapper title={`${item ? 'Edit' : 'Add'} News`} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="w-full p-2 border rounded"/>
                <textarea name="content" placeholder="Content" value={formData.content} onChange={handleChange} required className="w-full p-2 border rounded h-32"/>
                <button type="submit" className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-4 rounded-md transition-colors">Save News</button>
            </form>
        </ModalWrapper>
    );
};

const EmployeeFormModal: React.FC<{ item?: Employee | null, onSave: (item: Employee) => void, onClose: () => void }> = ({ item, onSave, onClose }) => {
    const [formData, setFormData] = useState({ name: '', position: '', contact: '', salary: 0 });

    useEffect(() => {
        if (item) setFormData(item);
    }, [item]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'salary' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: item?.id || `EMP${Date.now()}` });
    };
    
    return (
        <ModalWrapper title={`${item ? 'Edit' : 'Add'} Employee`} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded"/>
                <input type="text" name="position" placeholder="Position" value={formData.position} onChange={handleChange} required className="w-full p-2 border rounded"/>
                <input type="text" name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} required className="w-full p-2 border rounded"/>
                <input type="number" name="salary" placeholder="Salary (BDT)" value={formData.salary} onChange={handleChange} required className="w-full p-2 border rounded"/>
                <button type="submit" className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-4 rounded-md transition-colors">Save Employee</button>
            </form>
        </ModalWrapper>
    );
};


const AdminPanel: React.FC<{
    currentUser: User; onLogout: () => void;
    users: User[]; onSaveUser: (u: User) => void; onDeleteUser: (id: string) => void;
    coaches: Coach[]; onSaveCoach: (c: Coach) => void; onDeleteCoach: (id: string) => void; onToggleCoachStatus: (c: Coach) => void;
    routes: Route[]; onSaveRoute: (r: Route) => void; onDeleteRoute: (id: string) => void;
    bookings: Booking[]; onCancelBooking: (id: string) => void;
    counters: Counter[];
    discounts: Discount[];
    cancellations: Cancellation[];
    coachCosts: CoachCost[]; onSaveCoachCost: (cc: CoachCost) => void; onDeleteCoachCost: (id: string) => void;
    commissions: CommissionRule[]; onSaveCommission: (cr: CommissionRule) => void; onDeleteCommission: (id: string) => void;
    news: NewsItem[]; onSaveNews: (ni: NewsItem) => void; onDeleteNews: (id: string) => void;
    broadcasts: BroadcastMessage[];
    lotteries: Lottery[]; onSaveLottery: (l: Lottery) => void; onDeleteLottery: (id: string) => void;
    quotas: CounterQuota[];
    employees: Employee[]; onSaveEmployee: (e: Employee) => void; onDeleteEmployee: (id: string) => void;
    companyUsers: CompanyUser[]; onSaveCompanyUser: (cu: CompanyUser) => void; onDeleteCompanyUser: (id: string) => void;
}> = (props) => {
    const [adminView, setAdminView] = useState<AdminView>('DASHBOARD');
    const [modalType, setModalType] = useState<ModalType>(null);
    const [editingItem, setEditingItem] = useState<any>(null);

    const openModal = (type: ModalType, item: any = null) => {
        setModalType(type);
        setEditingItem(item);
    };
    const closeModal = () => {
        setModalType(null);
        setEditingItem(null);
    };
    
    const renderModal = () => {
        if (!modalType) return null;
        switch (modalType) {
            case 'USER': return <UserFormModal user={editingItem} onSave={(user) => { props.onSaveUser(user); closeModal(); }} onClose={closeModal} />;
            case 'COMPANY_USER': return <CompanyUserFormModal user={editingItem} counters={props.counters} onSave={(user) => { props.onSaveCompanyUser(user); closeModal(); }} onClose={closeModal} />;
            case 'COACH': return <CoachFormModal coach={editingItem} onSave={(coach) => { props.onSaveCoach(coach); closeModal(); }} onClose={closeModal} />;
            case 'ROUTE': return <RouteFormModal route={editingItem} coaches={props.coaches} onSave={(route) => { props.onSaveRoute(route); closeModal(); }} onClose={closeModal} />;
            default: return null;
        }
    }

    const renderAdminView = () => {
        switch (adminView) {
            case 'USER_MANAGEMENT': return <UserManagement users={props.users} onEdit={(user) => openModal('USER', user)} onAdd={() => openModal('USER')} onDelete={props.onDeleteUser} />;
            case 'COMPANY_USER_LIST': return <CompanyUserManagement companyUsers={props.companyUsers} counters={props.counters} onSave={props.onSaveCompanyUser} onDelete={props.onDeleteCompanyUser} />;
            case 'COACHES': return <CoachManagement coaches={props.coaches} onEdit={(coach) => openModal('COACH', coach)} onAdd={() => openModal('COACH')} onDelete={props.onDeleteCoach} onToggleStatus={props.onToggleCoachStatus} />;
            case 'ROUTES': return <RouteManagement routes={props.routes} onEdit={(route) => openModal('ROUTE', route)} onAdd={() => openModal('ROUTE')} onDelete={props.onDeleteRoute} />;
            case 'TICKET_MANAGEMENT': return <TicketManagement bookings={props.bookings} onCancel={props.onCancelBooking} />;
            case 'TICKET_CANCELLATION': return <TicketCancellationLog cancellations={props.cancellations} users={props.users} />;
            case 'REPORTS': return <ReportsView bookings={props.bookings} routes={props.routes} coaches={props.coaches} />;
            case 'COACH_COST': return <CoachCostManagement coachCosts={props.coachCosts} coaches={props.coaches} onSave={props.onSaveCoachCost} onDelete={props.onDeleteCoachCost} />;
            case 'COMMISSION_CONFIG': return <CommissionManagement commissions={props.commissions} counters={props.counters} onSave={props.onSaveCommission} onDelete={props.onDeleteCommission} />;
            case 'NEWS': return <NewsManagement news={props.news} onSave={props.onSaveNews} onDelete={props.onDeleteNews} currentUser={props.currentUser} />;
            case 'LOTTERY': return <LotteryManagement lotteries={props.lotteries} bookings={props.bookings} onSave={props.onSaveLottery} onDelete={props.onDeleteLottery} />;
            case 'HRD_BOARD': return <HRDManagement employees={props.employees} onSave={props.onSaveEmployee} onDelete={props.onDeleteEmployee} />;
            case 'COUNTERS': return <PlaceholderView title="Counter Management" />;
            case 'FARE_MANAGEMENT': return <PlaceholderView title="Fare Management" />;
            case 'FUND_MANAGEMENT': return <PlaceholderView title="Fund Management" />;
            case 'DISCOUNTS': return <PlaceholderView title="Discount Management" />;
            case 'BROADCAST': return <PlaceholderView title="Broadcast Message" />;
            case 'COUNTER_QUOTAS': return <PlaceholderView title="Counter Quotas" />;
            case 'SYSTEM_SETTINGS': return <PlaceholderView title="System Settings" />;
            case 'TWO_FACTOR_AUTH': return <PlaceholderView title="Two-Factor Authentication" />;
            case 'CMS_MIGRATION': return <PlaceholderView title="CMS Migration" />;
            case 'DASHBOARD':
            default: return <AdminDashboard bookings={props.bookings} coaches={props.coaches} routes={props.routes} />;
        }
    };
    
    const NavLink: React.FC<{ view: AdminView; icon: React.ReactNode; children: React.ReactNode }> = ({ view, icon, children }) => (
         <a href="#" onClick={(e) => { e.preventDefault(); setAdminView(view);}}
           className={`flex items-center px-4 py-3 rounded-md transition-colors text-sm ${adminView === view ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-brand-dark hover:text-white'}`}>
            {icon}{children}
        </a>
    );

    const NavGroup: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
        <div>
            <h3 className="px-4 mt-4 mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">{title}</h3>
            {children}
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {renderModal()}
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 shrink-0">
                 <div className="flex items-center space-x-3 p-4 border-b border-gray-700">
                    <CoachIcon className="h-8 w-8 text-brand-accent"/>
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                </div>
                <nav className="flex-grow mt-4 space-y-2 overflow-y-auto">
                    <NavLink view="DASHBOARD" icon={<DashboardIcon />}>Dashboard</NavLink>
                    
                    <NavGroup title="Operations">
                        <NavLink view="COMPANY_USER_LIST" icon={<CompanyIcon />}>Company Profile</NavLink>
                        <NavLink view="COACHES" icon={<CoachIcon className="h-5 w-5 mr-3" />}>Coaches</NavLink>
                        <NavLink view="ROUTES" icon={<RouteIcon />}>Routes & Schedules</NavLink>
                        <NavLink view="COUNTERS" icon={<MapPinIcon />}>Counters</NavLink>
                        <NavLink view="TICKET_MANAGEMENT" icon={<TicketIcon className="mr-3"/>}>Ticket Management</NavLink>
                        <NavLink view="TICKET_CANCELLATION" icon={<TicketXIcon />}>Ticket Cancellation</NavLink>
                    </NavGroup>

                    <NavGroup title="Finance">
                         <NavLink view="REPORTS" icon={<ChartIcon />}>Reports</NavLink>
                         <NavLink view="FARE_MANAGEMENT" icon={<DollarSignIcon />}>Fare Management</NavLink>
                         <NavLink view="COACH_COST" icon={<DollarSignIcon />}>Coach Costs</NavLink>
                         <NavLink view="FUND_MANAGEMENT" icon={<DollarSignIcon />}>Fund Management</NavLink>
                         <NavLink view="COMMISSION_CONFIG" icon={<DollarSignIcon />}>Commission Config</NavLink>
                    </NavGroup>

                    <NavGroup title="Marketing">
                        <NavLink view="DISCOUNTS" icon={<TagIcon />}>Discounts</NavLink>
                        <NavLink view="LOTTERY" icon={<TicketIcon className="mr-3"/>}>Lottery</NavLink>
                        <NavLink view="BROADCAST" icon={<SpeakerIcon />}>Broadcast Message</NavLink>
                        <NavLink view="NEWS" icon={<NewspaperIcon />}>News Zone</NavLink>
                    </NavGroup>

                    <NavGroup title="Administration">
                        <NavLink view="USER_MANAGEMENT" icon={<UsersIcon />}>User Management</NavLink>
                        <NavLink view="COUNTER_QUOTAS" icon={<TicketIcon className="mr-3"/>}>Counter Quotas</NavLink>
                        <NavLink view="HRD_BOARD" icon={<UsersIcon />}>HRD Board</NavLink>
                    </NavGroup>

                    <NavGroup title="System">
                        <NavLink view="SYSTEM_SETTINGS" icon={<SettingsIcon />}>System Settings</NavLink>
                        <NavLink view="TWO_FACTOR_AUTH" icon={<ShieldIcon />}>Two-Factor Auth</NavLink>
                        <NavLink view="CMS_MIGRATION" icon={<SettingsIcon />}>CMS Migration</NavLink>
                    </NavGroup>
                </nav>
                 <div className="mt-auto shrink-0">
                    <div className="flex items-center space-x-2 text-brand-light p-2 rounded-md bg-brand-dark mb-2">
                        <UserIcon className="w-5 h-5"/><span>{props.currentUser.username}</span>
                    </div>
                    <button onClick={props.onLogout} className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-md transition-colors">
                        <LogoutIcon className="mr-2"/> Logout
                    </button>
                 </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-6 md:p-10 overflow-y-auto">
                {renderAdminView()}
            </main>
        </div>
    );
};


// --- Main App Component ---

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const [postLoginAction, setPostLoginAction] = useState<(() => void) | null>(null);

  // Centralized state for all data
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [coaches, setCoaches] = useState<Coach[]>(INITIAL_COACHES);
  const [routes, setRoutes] = useState<Route[]>(INITIAL_ROUTES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [counters, setCounters] = useState<Counter[]>(INITIAL_COUNTERS);
  const [discounts, setDiscounts] = useState<Discount[]>(INITIAL_DISCOUNTS);
  const [cancellations, setCancellations] = useState<Cancellation[]>([]);
  const [coachCosts, setCoachCosts] = useState<CoachCost[]>(INITIAL_COACH_COSTS);
  const [commissions, setCommissions] = useState<CommissionRule[]>(INITIAL_COMMISSIONS);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>(INITIAL_BROADCASTS);
  const [lotteries, setLotteries] = useState<Lottery[]>(INITIAL_LOTTERIES);
  const [quotas, setQuotas] = useState<CounterQuota[]>(INITIAL_QUOTAS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [companyUsers, setCompanyUsers] = useState<CompanyUser[]>(INITIAL_COMPANY_USERS);


  const handleLogin = (username: string, password: string) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        setCurrentUser(user);
        setIsLoginModalOpen(false);
        setLoginError('');
        if (postLoginAction) {
            postLoginAction();
            setPostLoginAction(null);
        }
    } else {
        setLoginError('Invalid username or password.');
    }
  };

  const handleRegister = (username: string, email: string, password: string) => {
      if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
          setRegistrationError('Username already exists.');
          return;
      }
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          setRegistrationError('An account with this email already exists.');
          return;
      }

      const newUser: User = {
          id: `U${Date.now()}`,
          username,
          email,
          password,
          role: 'CUSTOMER',
      };
      
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setIsRegistrationModalOpen(false);
      setRegistrationError('');
      if (postLoginAction) {
          postLoginAction();
          setPostLoginAction(null);
      }
  };

  const handleLogout = () => {
      setCurrentUser(null);
  };
  
  const handleNewBooking = (booking: Booking) => {
      setBookings(prev => [...prev, booking]);
  };

  const handleCancelBooking = (bookingId: string) => {
      setBookings(prev => prev.map(b => b.id === bookingId ? {...b, status: 'Cancelled'} : b));
      const booking = bookings.find(b => b.id === bookingId);
      if(booking && currentUser) {
          const newCancellation: Cancellation = {
              id: `CAN${Date.now()}`,
              bookingId: booking.id,
              cancellationDate: new Date().toISOString().split('T')[0],
              refundAmount: booking.totalFare * 0.8, // Simulate 80% refund
              processedBy: currentUser.id,
          };
          setCancellations(prev => [...prev, newCancellation]);
      }
  };
  
  // --- Generic CRUD Handlers ---
  const createSaveHandler = <T extends {id: string}>(setter: React.Dispatch<React.SetStateAction<T[]>>) => (item: T) => {
      setter(prev => {
          const exists = prev.some(i => i.id === item.id);
          if (exists) return prev.map(i => i.id === item.id ? item : i);
          return [...prev, item];
      });
  };

  const createDeleteHandler = <T extends {id: string}>(setter: React.Dispatch<React.SetStateAction<T[]>>) => (id: string) => {
      setter(prev => prev.filter(i => i.id !== id));
  };
  
  const handleSaveUser = createSaveHandler(setUsers);
  const handleDeleteUser = createDeleteHandler(setUsers);
  const handleSaveCoach = createSaveHandler(setCoaches);
  const handleDeleteCoach = createDeleteHandler(setCoaches);
  const handleSaveRoute = createSaveHandler(setRoutes);
  const handleDeleteRoute = createDeleteHandler(setRoutes);
  const handleSaveCoachCost = createSaveHandler(setCoachCosts);
  const handleDeleteCoachCost = createDeleteHandler(setCoachCosts);
  const handleSaveCommission = createSaveHandler(setCommissions);
  const handleDeleteCommission = createDeleteHandler(setCommissions);
  const handleSaveNews = createSaveHandler(setNews);
  const handleDeleteNews = createDeleteHandler(setNews);
  const handleSaveLottery = createSaveHandler(setLotteries);
  const handleDeleteLottery = createDeleteHandler(setLotteries);
  const handleSaveEmployee = createSaveHandler(setEmployees);
  const handleDeleteEmployee = createDeleteHandler(setEmployees);
  const handleSaveCompanyUser = createSaveHandler(setCompanyUsers);
  const handleDeleteCompanyUser = createDeleteHandler(setCompanyUsers);

  const handleToggleCoachStatus = (coach: Coach) => {
      setCoaches(prev => prev.map(c => c.id === coach.id ? {...c, isActive: !c.isActive} : c));
  };
  
  const showLogin = () => {
      setLoginError('');
      setIsRegistrationModalOpen(false);
      setIsLoginModalOpen(true);
  };

  const requireLoginAndExecute = (action: () => void) => {
    setPostLoginAction(() => action);
    showLogin();
  };

  const showRegistration = () => {
      setRegistrationError('');
      setIsLoginModalOpen(false);
      setIsRegistrationModalOpen(true);
  };

  const closeModals = () => {
      setIsLoginModalOpen(false);
      setIsRegistrationModalOpen(false);
  }

  return (
    <>
      <LoginModal 
        isOpen={isLoginModalOpen && !currentUser}
        onClose={closeModals}
        onLogin={handleLogin}
        onSwitchToRegister={showRegistration}
        error={loginError}
       />
       <RegistrationModal
        isOpen={isRegistrationModalOpen && !currentUser}
        onClose={closeModals}
        onRegister={handleRegister}
        onSwitchToLogin={showLogin}
        error={registrationError}
       />
       { currentUser?.role === 'ADMIN' ? (
            <AdminPanel 
                currentUser={currentUser} 
                onLogout={handleLogout}
                users={users} onSaveUser={handleSaveUser} onDeleteUser={handleDeleteUser}
                coaches={coaches} onSaveCoach={handleSaveCoach} onDeleteCoach={handleDeleteCoach} onToggleCoachStatus={handleToggleCoachStatus}
                routes={routes} onSaveRoute={handleSaveRoute} onDeleteRoute={handleDeleteRoute}
                bookings={bookings} onCancelBooking={handleCancelBooking}
                counters={counters}
                discounts={discounts}
                cancellations={cancellations}
                coachCosts={coachCosts} onSaveCoachCost={handleSaveCoachCost} onDeleteCoachCost={handleDeleteCoachCost}
                commissions={commissions} onSaveCommission={handleSaveCommission} onDeleteCommission={handleDeleteCommission}
                news={news} onSaveNews={handleSaveNews} onDeleteNews={handleDeleteNews}
                broadcasts={broadcasts}
                lotteries={lotteries} onSaveLottery={handleSaveLottery} onDeleteLottery={handleDeleteLottery}
                quotas={quotas}
                employees={employees} onSaveEmployee={handleSaveEmployee} onDeleteEmployee={handleDeleteEmployee}
                companyUsers={companyUsers} onSaveCompanyUser={handleSaveCompanyUser} onDeleteCompanyUser={handleDeleteCompanyUser}
            />
       ) : (
            <UserPanel 
                currentUser={currentUser}
                bookings={bookings}
                routes={routes}
                coaches={coaches}
                onLogout={handleLogout}
                onShowLogin={showLogin}
                onShowRegistration={showRegistration}
                onNewBooking={handleNewBooking}
                onRequireLogin={requireLoginAndExecute}
            />
       )}
    </>
  );
};

export default App;
