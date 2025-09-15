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
            $table->string('student_id');
            $table->string('section');
            $table->string('current_address');
            $table->string('home_address');
            $table->string('mobile_no');
            $table->text('details');
            $table->enum('status', ['Pending', 'Approved', 'Rejected'])->default('Pending');
            $table->string('violation_type');
            $table->date('date_of_violation');
            $table->timestamps();
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