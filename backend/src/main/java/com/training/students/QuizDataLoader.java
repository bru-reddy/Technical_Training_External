package com.training.students;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class QuizDataLoader implements CommandLineRunner {
    private final QuestionRepository repository;

    public QuizDataLoader(QuestionRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;

        repository.save(new Question(
            "Which keyword is used to inherit a class in Java?",
            "implements", "extends", "inherits", "super", "B"
        ));
        repository.save(new Question(
            "Which data structure follows the FIFO principle?",
            "Stack", "Tree", "Queue", "Graph", "C"
        ));
        repository.save(new Question(
            "Which method is the entry point of a standard Java application?",
            "start()", "run()", "main()", "init()", "C"
        ));
        repository.save(new Question(
            "Which HTTP method is commonly used to retrieve data?",
            "POST", "GET", "PATCH", "DELETE", "B"
        ));
        repository.save(new Question(
            "Which of these is a relational database?",
            "MongoDB", "Redis", "MySQL", "Neo4j", "C"
        ));
    }
}
