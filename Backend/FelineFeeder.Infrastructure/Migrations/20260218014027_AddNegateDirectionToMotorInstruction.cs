using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FelineFeeder.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNegateDirectionToMotorInstruction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "MotorInstructions_NegateDirection",
                table: "FeedingTimes",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MotorInstructions_NegateDirection",
                table: "FeedingTimes");
        }
    }
}
