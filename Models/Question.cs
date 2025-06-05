using System.Text.Json.Serialization;

namespace LebLang.Models
{
    public class Question
    {
        public required int Id { get; set; }
        
        [JsonPropertyName("lessonId")]
        public required int LessonId { get; set; }
        
        [JsonIgnore]
        public Lesson? Lesson { get; set; }
        
        [JsonPropertyName("type")]
        public required string Type { get; set; }
        
        [JsonPropertyName("question")]
        public required string QuestionText { get; set; }
        
        [JsonPropertyName("questionArabic")]
        public required string QuestionTextArabic { get; set; }
        
        public List<string>? Options { get; set; }
        public List<string>? OptionsArabic { get; set; }
        public List<string>? OptionsLatin { get; set; }
        
        [JsonPropertyName("correctAnswer")]
        public object? CorrectAnswer { get; set; } // Can be int for multiple choice or string for other types
        
        [JsonPropertyName("correctAnswerLatin")]
        public string? CorrectAnswerLatin { get; set; }
        
        [JsonPropertyName("acceptedAnswers")]
        public List<string>? AcceptedAnswers { get; set; }
        
        public string? Explanation { get; set; }
        public string? ExplanationArabic { get; set; }
        
        public List<MatchingPair>? Pairs { get; set; }
    }

    public class MatchingPair
    {
        [JsonPropertyName("arabic")]
        public required string Arabic { get; set; }
        
        [JsonPropertyName("latin")]
        public required string Latin { get; set; }
        
        [JsonPropertyName("english")]
        public required string English { get; set; }
    }
}
