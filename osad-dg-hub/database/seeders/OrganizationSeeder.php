<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Organization;

class OrganizationSeeder extends Seeder
{
    public function run(): void
    {
        $organizations = [
            ['name' => 'IPES'],
            ['name' => 'VIBE'],
            ['name' => 'FACES'],
            ['name' => 'GDGOC'],
        ];

        foreach ($organizations as $org) {
            Organization::create($org);
        }
    }
}