using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FelineFeeder.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddInstructions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "LEDInstructions_Brightness",
                table: "FeedingTimes",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<uint>(
                name: "MotorInstructions_Steps",
                table: "FeedingTimes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "MotorInstructions_WaitBetweenSteps",
                table: "FeedingTimes",
                type: "TEXT",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LEDInstructions_Brightness",
                table: "FeedingTimes");

            migrationBuilder.DropColumn(
                name: "MotorInstructions_Steps",
                table: "FeedingTimes");

            migrationBuilder.DropColumn(
                name: "MotorInstructions_WaitBetweenSteps",
                table: "FeedingTimes");
        }
    }
}
