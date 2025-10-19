import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { X, Calendar, Clock, Users, MapPin } from 'lucide-react';

// --- Helper Types ---
type RoomStatus = 'Available' | 'Occupied' | 'Maintenance';

interface Booking {
    id: number;
    event_name: string;
    start_time: string;
    end_time: string;
    organization: string;
    department: string;
    estimated_people: number;
    purpose: string;
    status: string;
}

interface Room {
    id: number | null;
    room_number: string;
    floor: number;
    status: RoomStatus;
    current_booking?: {
        event_name: string;
        start_time: string;
        end_time: string;
    } | null;
    upcoming_bookings?: Booking[];
}

interface Venue {
    id: number | null;
    name: string;
    status: RoomStatus;
    capacity: number;
    current_booking?: {
        event_name: string;
        start_time: string;
        end_time: string;
    } | null;
    upcoming_bookings?: Booking[];
}

interface PageProps {
    rooms: Room[];
    venues: Venue[];
}

// --- Booking Details Modal ---
const BookingDetailsModal = ({ 
    isOpen, 
    onClose, 
    facility, 
    type 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    facility: Room | Venue | null;
    type: 'room' | 'venue';
}) => {
    if (!isOpen || !facility) return null;

    const facilityName = type === 'room' 
        ? `Room ${(facility as Room).room_number}` 
        : (facility as Venue).name;

    const upcomingBookings = facility.upcoming_bookings || [];

    const formatDateTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        };
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-[#A13A3A] text-white px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">{facilityName}</h2>
                        <p className="text-red-100 text-sm">
                            {type === 'room' 
                                ? `Floor ${(facility as Room).floor}` 
                                : `Capacity: ${(facility as Venue).capacity} people`}
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="hover:bg-red-700 rounded-full p-2 transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Upcoming Bookings ({upcomingBookings.length})
                    </h3>

                    {upcomingBookings.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Calendar className="mx-auto mb-3 text-gray-300" size={48} />
                            <p>No upcoming bookings for this facility</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {upcomingBookings.map((booking) => {
                                const start = formatDateTime(booking.start_time);
                                const end = formatDateTime(booking.end_time);
                                
                                return (
                                    <div 
                                        key={booking.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="text-lg font-semibold text-gray-900">
                                                {booking.event_name}
                                            </h4>
                                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                Approved
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-3">
                                            <div className="flex items-start text-sm text-gray-600">
                                                <Calendar className="mr-2 mt-0.5 flex-shrink-0" size={16} />
                                                <div>
                                                    <p className="font-medium">Date</p>
                                                    <p>{start.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start text-sm text-gray-600">
                                                <Clock className="mr-2 mt-0.5 flex-shrink-0" size={16} />
                                                <div>
                                                    <p className="font-medium">Time</p>
                                                    <p>{start.time} - {end.time}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start text-sm text-gray-600">
                                                <Users className="mr-2 mt-0.5 flex-shrink-0" size={16} />
                                                <div>
                                                    <p className="font-medium">Attendees</p>
                                                    <p>{booking.estimated_people} people</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start text-sm text-gray-600">
                                                <MapPin className="mr-2 mt-0.5 flex-shrink-0" size={16} />
                                                <div>
                                                    <p className="font-medium">Organization</p>
                                                    <p className="truncate">{booking.organization}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-gray-200">
                                            <p className="text-xs text-gray-500 mb-1">Purpose:</p>
                                            <p className="text-sm text-gray-700">{booking.purpose}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Status Badge ---
const StatusBadge = ({ status }: { status: RoomStatus }) => {
    const styles = {
        Available: 'bg-green-100 text-green-800 border-green-200',
        Occupied: 'bg-red-100 text-red-800 border-red-200',
        Maintenance: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}>
            {status}
        </span>
    );
};

// --- Clickable Room Card ---
const RoomCard = ({ room, onClick }: { room: Room; onClick: () => void }) => {
    const borderColor = {
        Available: 'border-green-300',
        Occupied: 'border-red-300',
        Maintenance: 'border-orange-300',
    };

    const isClickable = room.id !== null;

    return (
        <div 
            onClick={isClickable ? onClick : undefined}
            className={`bg-white rounded-lg shadow-sm border-2 ${borderColor[room.status]} p-4 transition-all ${
                isClickable ? 'cursor-pointer hover:shadow-lg transform hover:scale-105' : 'opacity-60 cursor-not-allowed'
            }`}
        >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Room {room.room_number}</h3>
                    <p className="text-xs text-gray-500">Floor {room.floor}</p>
                </div>
                <StatusBadge status={room.status} />
            </div>
            {room.current_booking && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Current:</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{room.current_booking.event_name}</p>
                </div>
            )}
            {isClickable && (
                <div className="mt-2 text-xs text-blue-600 font-medium">
                    {room.upcoming_bookings && room.upcoming_bookings.length > 0 
                        ? `${room.upcoming_bookings.length} upcoming` 
                        : 'No bookings'}
                </div>
            )}
        </div>
    );
};

// --- Clickable Venue Card ---
const VenueCard = ({ venue, onClick }: { venue: Venue; onClick: () => void }) => {
    const borderColor = {
        Available: 'border-green-300',
        Occupied: 'border-red-300',
        Maintenance: 'border-orange-300',
    };

    const isClickable = venue.id !== null;

    return (
        <div 
            onClick={isClickable ? onClick : undefined}
            className={`bg-white rounded-lg shadow-sm border-2 ${borderColor[venue.status]} p-5 transition-all ${
                isClickable ? 'cursor-pointer hover:shadow-lg transform hover:scale-105' : 'opacity-60 cursor-not-allowed'
            }`}
        >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{venue.name}</h3>
                    <p className="text-xs text-gray-500">Capacity: {venue.capacity} people</p>
                </div>
                <StatusBadge status={venue.status} />
            </div>
            {venue.current_booking && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Current:</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{venue.current_booking.event_name}</p>
                </div>
            )}
            {isClickable && (
                <div className="mt-2 text-xs text-blue-600 font-medium">
                    {venue.upcoming_bookings && venue.upcoming_bookings.length > 0 
                        ? `${venue.upcoming_bookings.length} upcoming` 
                        : 'No bookings'}
                </div>
            )}
        </div>
    );
};

// --- Main Component ---
const AdminRoomManagement = ({ rooms, venues }: PageProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFacility, setSelectedFacility] = useState<Room | Venue | null>(null);
    const [facilityType, setFacilityType] = useState<'room' | 'venue'>('room');

    const handleRoomClick = (room: Room) => {
        if (room.id === null) return;
        setSelectedFacility(room);
        setFacilityType('room');
        setModalOpen(true);
    };

    const handleVenueClick = (venue: Venue) => {
        if (venue.id === null) return;
        setSelectedFacility(venue);
        setFacilityType('venue');
        setModalOpen(true);
    };

    // Group rooms by floor
    const roomsByFloor = rooms.reduce((acc, room) => {
        if (!acc[room.floor]) acc[room.floor] = [];
        acc[room.floor].push(room);
        return acc;
    }, {} as Record<number, Room[]>);

    // Filter function
    const filterItems = <T extends Room | Venue>(items: T[], query: string): T[] => {
        if (!query.trim()) return items;
        const lowerQuery = query.toLowerCase();

        return items.filter(item => {
            if ('room_number' in item) {
                return item.room_number.toLowerCase().includes(lowerQuery) || 
                       item.status.toLowerCase().includes(lowerQuery);
            } else {
                return item.name.toLowerCase().includes(lowerQuery) || 
                       item.status.toLowerCase().includes(lowerQuery);
            }
        });
    };

    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(r => r.status === 'Available').length;
    const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
    const maintenanceRooms = rooms.filter(r => r.status === 'Maintenance').length;

    const availableVenues = venues.filter(v => v.status === 'Available').length;
    const occupiedVenues = venues.filter(v => v.status === 'Occupied').length;
    const maintenanceVenues = venues.filter(v => v.status === 'Maintenance').length;

    return (
        <AuthenticatedLayout>
            <Head title="Room & Venue Management" />

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Room & Venue Management</h1>
                <p className="text-gray-500 mt-1">Click on any room or venue to view booking details</p>
            </header>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="Search by room number, venue name, or status..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A13A3A] focus:border-transparent"
                    />
                    <svg 
                        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Main Campus Section */}
            <div className="mb-8">
                <div className="flex items-center mb-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <h2 className="px-4 text-2xl font-bold text-gray-800">MAIN CAMPUS</h2>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                        <p className="text-xs text-gray-600 mb-1">Total Rooms</p>
                        <p className="text-2xl font-bold text-gray-900">{totalRooms}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                        <p className="text-xs text-gray-600 mb-1">Available</p>
                        <p className="text-2xl font-bold text-gray-900">{availableRooms + availableVenues}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
                        <p className="text-xs text-gray-600 mb-1">Occupied</p>
                        <p className="text-2xl font-bold text-gray-900">{occupiedRooms + occupiedVenues}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
                        <p className="text-xs text-gray-600 mb-1">Maintenance</p>
                        <p className="text-2xl font-bold text-gray-900">{maintenanceRooms + maintenanceVenues}</p>
                    </div>
                </div>

                {/* Venues Section */}
                <section className="mb-10">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                        <span className="bg-[#A13A3A] text-white px-3 py-1 rounded-md mr-3">Venues</span>
                        <span className="text-sm text-gray-500 font-normal">({venues.length} total)</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filterItems(venues, searchQuery).length > 0 ? (
                            filterItems(venues, searchQuery).map((venue) => (
                                <VenueCard key={venue.id || venue.name} venue={venue} onClick={() => handleVenueClick(venue)} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8 text-gray-500">
                                No venues found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                </section>

                {/* Rooms by Floor */}
                {[5, 4, 3].map((floor) => {
                    const floorRooms = roomsByFloor[floor] || [];
                    const filteredRooms = filterItems(floorRooms, searchQuery);
                    
                    return (
                        <section key={floor} className="mb-10">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                                <span className="bg-[#A13A3A] text-white px-3 py-1 rounded-md mr-3">
                                    {floor === 3 ? '3rd' : floor === 4 ? '4th' : '5th'} Floor
                                </span>
                                <span className="text-sm text-gray-500 font-normal">
                                    ({floorRooms.filter(r => r.status === 'Available').length} available / {floorRooms.length} total)
                                </span>
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                                {filteredRooms.length > 0 ? (
                                    filteredRooms.map((room) => (
                                        <RoomCard key={room.id || room.room_number} room={room} onClick={() => handleRoomClick(room)} />
                                    ))
                                ) : searchQuery ? (
                                    <div className="col-span-full text-center py-8 text-gray-500">
                                        No rooms found on this floor matching "{searchQuery}"
                                    </div>
                                ) : null}
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* Bonifacio Campus - Placeholder */}
            <div className="mb-8">
                <div className="flex items-center mb-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <h2 className="px-4 text-2xl font-bold text-gray-400">BONIFACIO CAMPUS</h2>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Coming Soon</h3>
                    <p className="text-sm text-gray-500">Bonifacio Campus facilities will be available here.</p>
                </div>
            </div>

            {/* Booking Details Modal */}
            <BookingDetailsModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                facility={selectedFacility}
                type={facilityType}
            />
        </AuthenticatedLayout>
    );
};

export default AdminRoomManagement;