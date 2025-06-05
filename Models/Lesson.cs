using System.Text.Json.Serialization;

namespace LebLang.Models
{
    public class Lesson
    {
        public required int Id { get; set; }
        
        [JsonPropertyName("categoryId")]
        public required int CategoryId { get; set; }
        
        [JsonIgnore]
        public Category? Category { get; set; }
        
        public required string Title { get; set; }
        public required string TitleArabic { get; set; }
        public required string Description { get; set; }
        
        [JsonPropertyName("questions")]
        public List<int> QuestionIds { get; set; } = new();
        
        [JsonIgnore]
        public List<Question> Questions { get; set; } = new();
    }
}
