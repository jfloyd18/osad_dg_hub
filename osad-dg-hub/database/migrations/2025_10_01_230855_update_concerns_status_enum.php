<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Change the enum values for the status column
        DB::statement("ALTER TABLE concerns MODIFY COLUMN status ENUM('Pending', 'On Progress', 'Resolved', 'Rejected') DEFAULT 'Pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to original enum values
        DB::statement("ALTER TABLE concerns MODIFY COLUMN status ENUM('Pending', 'Approved', 'Revisions', 'Rejected') DEFAULT 'Pending'");
    }
};