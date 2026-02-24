using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BrekkieBeacon.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFeedingTimeIsEnabled : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsEnabled",
                table: "FeedingTimes",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "FeedingTimes",
                keyColumn: "Id",
                keyValue: new Guid("79809983-9993-4b93-941e-32363198084b"),
                column: "IsEnabled",
                value: true);

            migrationBuilder.UpdateData(
                table: "FeedingTimes",
                keyColumn: "Id",
                keyValue: new Guid("79809983-9993-4b93-941e-32363198084e"),
                column: "IsEnabled",
                value: true);

            migrationBuilder.UpdateData(
                table: "FeedingTimes",
                keyColumn: "Id",
                keyValue: new Guid("a392764b-d291-4940-9e11-22964177013c"),
                column: "IsEnabled",
                value: true);

            migrationBuilder.UpdateData(
                table: "FeedingTimes",
                keyColumn: "Id",
                keyValue: new Guid("a392764b-d291-4940-9e11-22964177013d"),
                column: "IsEnabled",
                value: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsEnabled",
                table: "FeedingTimes");
        }
    }
}
