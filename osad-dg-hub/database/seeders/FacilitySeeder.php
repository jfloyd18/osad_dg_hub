<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Facility;

class FacilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ========================================
        // EXISTING VENUES (Keep your current ones)
        // ========================================
        $existingVenues = [
            ['name' => 'Auditorium', 'capacity' => 500, 'location' => 'Ground Floor, Main Campus'],
            ['name' => 'Gymnasium', 'capacity' => 300, 'location' => 'Sports Complex, Main Campus'],
            ['name' => 'Conference Room A', 'capacity' => 50, 'location' => '2nd Floor, Main Campus'],
            ['name' => 'Conference Room B', 'capacity' => 30, 'location' => '2nd Floor, Main Campus'],
            ['name' => 'Open Grounds', 'capacity' => 1500, 'location' => 'Outdoor, Main Campus'],
        ];

        // ========================================
        // NEW VENUES FOR ROOM MANAGEMENT
        // ========================================
        $newVenues = [
            ['name' => 'Lobby', 'capacity' => 100, 'location' => 'Ground Floor, Main Campus'],
            ['name' => 'Quadrangle', 'capacity' => 1000, 'location' => 'Outdoor, Main Campus'],
        ];

        // Insert existing and new venues
        foreach (array_merge($existingVenues, $newVenues) as $venue) {
            Facility::updateOrCreate(
                ['name' => $venue['name']],
                $venue
            );
        }

        // ========================================
        // ROOMS - 3rd Floor (301-307)
        // ========================================
        for ($room = 301; $room <= 307; $room++) {
            Facility::updateOrCreate(
                ['name' => (string)$room],
                [
                    'capacity' => 30,
                    'location' => '3rd Floor, Main Campus',
                ]
            );
        }

        // ========================================
        // ROOMS - 4th Floor (401-407)
        // ========================================
        for ($room = 401; $room <= 407; $room++) {
            Facility::updateOrCreate(
                ['name' => (string)$room],
                [
                    'capacity' => 30,
                    'location' => '4th Floor, Main Campus',
                ]
            );
        }

        // ========================================
        // ROOMS - 5th Floor (501-507)
        // ========================================
        for ($room = 501; $room <= 507; $room++) {
            Facility::updateOrCreate(
                ['name' => (string)$room],
                [
                    'capacity' => 30,
                    'location' => '5th Floor, Main Campus',
                ]
            );
        }

        // Output summary
        $this->command->info('✓ Facilities seeded successfully!');
        $this->command->info('📊 Summary:');
        $this->command->info('  - Total Facilities: ' . Facility::count());
        $this->command->info('  - Venues: ' . Facility::whereIn('name', ['Auditorium', 'Gymnasium', 'Conference Room A', 'Conference Room B', 'Open Grounds', 'Lobby', 'Quadrangle'])->count());
        $this->command->info('  - Rooms (3rd Floor): ' . Facility::where('location', 'like', '%3rd Floor%')->count());
        $this->command->info('  - Rooms (4th Floor): ' . Facility::where('location', 'like', '%4th Floor%')->count());
        $this->command->info('  - Rooms (5th Floor): ' . Facility::where('location', 'like', '%5th Floor%')->count());
    }
}