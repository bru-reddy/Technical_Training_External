package com.training.students;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;
import org.springframework.validation.annotation.Validated;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
@Validated
public class StudentController {
    private final StudentRepository repository;

    public StudentController(StudentRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Student getStudent(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
    }

    @PostMapping
    public ResponseEntity<?> addStudent(@Valid @RequestBody Student student) {
        if (repository.findByRollNumberIgnoreCase(student.getRollNumber().trim()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Roll number already exists"));
        }
        student.setName(student.getName().trim());
        student.setRollNumber(student.getRollNumber().trim());
        student.setBranch(student.getBranch().trim());
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(student));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @Valid @RequestBody Student updated) {
        Student student = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

        var existing = repository.findByRollNumberIgnoreCase(updated.getRollNumber().trim());
        if (existing.isPresent() && !existing.get().getId().equals(id)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Roll number already exists"));
        }

        student.setName(updated.getName().trim());
        student.setRollNumber(updated.getRollNumber().trim());
        student.setBranch(updated.getBranch().trim());
        student.setMarks(updated.getMarks());
        return ResponseEntity.ok(repository.save(student));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found");
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
