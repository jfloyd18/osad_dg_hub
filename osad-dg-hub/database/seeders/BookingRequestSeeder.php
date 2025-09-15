<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BookingRequest;

class BookingRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        BookingRequest::create([
            'event_name' => 'Annual Tech Summit',
            'facility_name' => 'Auditorium',
            'purpose' => 'A summit for all tech students.',
            'status' => 'Approved',
            'submitted_at' => now()->subDays(5),
            'event_start' => now()->addDays(10),
            'event_end' => now()->addDays(10)->addHours(4),
            'estimated_people' => 150,
        ]);

        BookingRequest::create([
            'event_name' => 'Basketball Practice',
            'facility_name' => 'Gymnasium',
            'purpose' => 'Team practice for the upcoming tournament.',
            'status' => 'Pending',
            'submitted_at' => now()->subDays(2),
            'event_start' => now()->addDays(5),
            'event_end' => now()->addDays(5)->addHours(2),
            'estimated_people' => 25,
        ]);

        BookingRequest::create([
            'event_name' => 'Thesis Defense Panel',
            'facility_name' => 'Conference Room',
            'purpose' => 'Final defense for graduating students.',
            'status' => 'Approved',
            'submitted_at' => now()->subDays(10),
            'event_start' => now()->addDays(2),
            'event_end' => now()->addDays(2)->addHours(6),
            'estimated_people' => 20,
        ]);

         BookingRequest::create([
            'event_name' => 'Study Group Session',
            'facility_name' => 'Room 305',
            'purpose' => 'Review session for final exams.',
            'status' => 'Rejected',
            'feedback' => 'Bookings are not allowed during exam week.',
            'submitted_at' => now()->subDay(),
            'event_start' => now()->addDays(4),
            'event_end' => now()->addDays(4)->addHours(3),
            'estimated_people' => 10,
        ]);
    }
}