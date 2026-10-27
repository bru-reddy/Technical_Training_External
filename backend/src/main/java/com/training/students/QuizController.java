package com.training.students;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class QuizController {
    private final QuestionRepository repository;

    public QuizController(QuestionRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/questions")
    public List<QuestionView> getQuestions() {
        return repository.findAll().stream().map(question -> new QuestionView(
            question.getId(),
            question.getText(),
            List.of(
                new OptionView("A", question.getOptionA()),
                new OptionView("B", question.getOptionB()),
                new OptionView("C", question.getOptionC()),
                new OptionView("D", question.getOptionD())
            )
        )).toList();
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitQuiz(@RequestBody SubmitRequest request) {
        if (request == null || request.answers() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Answers are required"));
        }

        List<Question> questions = repository.findAll();
        int score = 0;
        List<ReviewView> review = new ArrayList<>();

        for (Question question : questions) {
            String selected = request.answers().get(String.valueOf(question.getId()));
            String correct = question.getCorrectAnswer();
            boolean isCorrect = correct.equalsIgnoreCase(selected == null ? "" : selected);
            if (isCorrect) score++;

            String selectedText = optionText(question, selected);
            String correctText = optionText(question, correct);

            review.add(new ReviewView(
                question.getId(),
                question.getText(),
                selected,
                selectedText,
                correct,
                correctText,
                isCorrect
            ));
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("score", score);
        response.put("total", questions.size());
        response.put("review", review);
        return ResponseEntity.ok(response);
    }

    private String optionText(Question question, String key) {
        if (key == null) return "";
        return switch (key.toUpperCase()) {
            case "A" -> question.getOptionA();
            case "B" -> question.getOptionB();
            case "C" -> question.getOptionC();
            case "D" -> question.getOptionD();
            default -> "";
        };
    }

    public record OptionView(String key, String text) {}
    public record QuestionView(Long id, String text, List<OptionView> options) {}
    public record SubmitRequest(Map<String, String> answers) {}
    public record ReviewView(
        Long questionId,
        String question,
        String selectedAnswer,
        String selectedText,
        String correctAnswer,
        String correctText,
        boolean correct
    ) {}
}
