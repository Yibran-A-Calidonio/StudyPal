using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyPalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddCheckedInToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "CheckedIn",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastStudyDate",
                table: "Users",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Streak",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CheckedIn",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LastStudyDate",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Streak",
                table: "Users");
        }
    }
}
