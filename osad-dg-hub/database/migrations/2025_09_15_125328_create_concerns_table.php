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
        Schema::create('concerns', function (Blueprint $table) {
            $table->id();
            $table->string('incident_title');
            $table->text('details')->nullable();
            $table->string('student_id')->nullable();
            $table->string('reported_by')->nullable();
            $table->enum('status', ['Pending', 'Approved', 'Revisions', 'Rejected'])->default('Pending');
            $table->text('feedback')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('concerns');
    }
};