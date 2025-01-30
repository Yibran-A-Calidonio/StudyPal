using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyPalAPI.Models
{
    public class Quote
    {
        [Key]
        public short Id { get; set; }  // Primary Key

        [Required]
        public string Category { get; set; } = null!;// Category of the quote (e.g., Motivation, Focus)

        [Column("Quote")]
        public string QuoteText { get; set; } = null!;// The actual quote
    }
}