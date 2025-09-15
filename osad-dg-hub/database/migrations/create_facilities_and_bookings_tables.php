<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create the 'facilities' table
        Schema::create('facilities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('capacity')->nullable();
            $table->string('location')->nullable();
            $table->timestamps();
        });

        // Create the 'booking_requests' table
        Schema::create('booking_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade'); // Assumes a 'users' table
            $table->string('department')->nullable();
            $table->string('organization')->nullable();
            $table->string('contact_no')->nullable();
            $table->string('event_name');
            
            // Link to the facilities table
            $table->foreignId('facility_id')->nullable()->constrained()->onDelete('set null');
            $table->string('facility_name'); // Denormalized for convenience

            $table->integer('estimated_people');
            $table->dateTime('event_start');
            $table->dateTime('event_end');
            $table->text('purpose');
            $table->enum('status', ['Pending', 'Approved', 'Revisions', 'Rejected'])->default('Pending');
            $table->text('feedback')->nullable();
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps(); // for created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_requests');
        Schema::dropIfExists('facilities');
    }
};