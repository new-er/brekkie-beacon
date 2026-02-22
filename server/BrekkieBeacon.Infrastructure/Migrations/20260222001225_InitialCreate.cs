using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BrekkieBeacon.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FeedingTimes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Time = table.Column<TimeOnly>(type: "TEXT", nullable: false),
                    MotorInstructions_Steps = table.Column<uint>(type: "INTEGER", nullable: false),
                    MotorInstructions_WaitBetweenSteps = table.Column<TimeSpan>(type: "TEXT", nullable: false),
                    MotorInstructions_NegateDirection = table.Column<bool>(type: "INTEGER", nullable: false),
                    LEDInstructions_Brightness = table.Column<float>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeedingTimes", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "FeedingTimes",
                columns: new[] { "Id", "Name", "Time", "LEDInstructions_Brightness", "MotorInstructions_NegateDirection", "MotorInstructions_Steps", "MotorInstructions_WaitBetweenSteps" },
                values: new object[,]
                {
                    { new Guid("79809983-9993-4b93-941e-32363198084b"), "🌅 Morning Morsel", new TimeOnly(5, 0, 0), 1f, false, 1450u, new TimeSpan(0, 0, 0, 0, 5) },
                    { new Guid("79809983-9993-4b93-941e-32363198084e"), "☀️ Breakfast Banquet", new TimeOnly(5, 15, 0), 1f, false, 1450u, new TimeSpan(0, 0, 0, 0, 5) },
                    { new Guid("a392764b-d291-4940-9e11-22964177013c"), "🌇 Sunset Snack", new TimeOnly(17, 0, 0), 1f, false, 1450u, new TimeSpan(0, 0, 0, 0, 5) },
                    { new Guid("a392764b-d291-4940-9e11-22964177013d"), "🌙 Dinner Delight", new TimeOnly(17, 15, 0), 1f, false, 1450u, new TimeSpan(0, 0, 0, 0, 5) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FeedingTimes");
        }
    }
}
