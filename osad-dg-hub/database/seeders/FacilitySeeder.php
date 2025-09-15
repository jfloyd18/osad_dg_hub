<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Facility; // Import the Facility model

class FacilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Use the Facility model to insert data
        Facility::create(['name' => 'Auditorium']);
        Facility::create(['name' => 'Gymnasium']);
        Facility::create(['name' => 'Conference Room A']);
        Facility::create(['name' => 'Conference Room B']);
        Facility::create(['name' => 'Open Grounds']);
        
        // Add as many other facilities as you need
    }
}