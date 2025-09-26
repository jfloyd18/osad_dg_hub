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
        Schema::create('warning_slips', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('student_id', 50);
            $table->string('section', 50);
            $table->text('current_address');
            $table->text('home_address');
            $table->string('mobile_no', 20);
            $table->text('details'); // This matches your frontend field name
            $table->string('status')->default('pending'); // pending, resolved, dismissed
            $table->string('violation_type', 100);
            $table->date('date_of_violation');
            $table->timestamps();

            // Add indexes for better performance
            $table->index('student_id');
            $table->index('status');
            $table->index('date_of_violation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('warning_slips');
    }
};