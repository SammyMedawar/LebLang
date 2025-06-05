using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LebLang.Models
{
    public class Category
    {
        public required int Id { get; set; }
        public required string Name { get; set; }
        public required string NameArabic { get; set; }
        public required string Description { get; set; }
        public required string DescriptionArabic { get; set; }
        public required string Icon { get; set; }
        public required string Color { get; set; }
        
        [JsonPropertyName("lessons")]
        public List<int> LessonIds { get; set; } = new();
        
        [JsonIgnore] // Ignore this property when serializing to JSON
        public List<Lesson> Lessons { get; set; } = new(); // For EF Core navigation
    }
}
