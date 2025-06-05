using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace LebLang.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum QuestionType
    {
        [EnumMember(Value = "multiple_choice")]
        MultipleChoice,

        [EnumMember(Value = "translation")]
        Translation,

        [EnumMember(Value = "fill_blank")]
        FillBlank,

        [EnumMember(Value = "matching")]
        Matching
    }
}
