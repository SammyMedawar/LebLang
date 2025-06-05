using System.Text.Json.Serialization;

namespace LebLang.Models
{
    public class Score
    {
        [JsonPropertyName("totalScore")]
        public int TotalScore { get; set; }

        [JsonPropertyName("lessonsCompleted")]
        public List<int> LessonsCompleted { get; set; } = new();

        [JsonPropertyName("lessonScores")]
        public Dictionary<string, int> LessonScores { get; set; } = new();

        [JsonPropertyName("categoryProgress")]
        public Dictionary<int, CategoryProgress> CategoryProgress { get; set; } = new();

        [JsonPropertyName("achievements")]
        public List<string> Achievements { get; set; } = new();

        [JsonPropertyName("streakDays")]
        public int StreakDays { get; set; }

        [JsonPropertyName("lastPlayedDate")]
        public DateTime? LastPlayedDate { get; set; }
    }

    public class CategoryProgress
    {
        [JsonPropertyName("completed")]
        public int Completed { get; set; }

        [JsonPropertyName("total")]
        public int Total { get; set; }

        [JsonPropertyName("score")]
        public int Score { get; set; }
    }
}
