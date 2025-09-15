<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // This keeps your original test user creation
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // This adds the calls to our new seeders
        $this->call([
            FacilitySeeder::class,
            BookingRequestSeeder::class,
        ]);
    }
}