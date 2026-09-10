package com.applypilot.tracker.controller;

import com.applypilot.tracker.dto.CreateJobApplicationRequest;
import com.applypilot.tracker.dto.JobApplicationDto;
import com.applypilot.tracker.dto.JobApplicationStatsDto;
import com.applypilot.tracker.dto.UpdateJobApplicationRequest;
import com.applypilot.tracker.dto.UpdateStatusRequest;
import com.applypilot.tracker.entity.ApplicationStatus;
import com.applypilot.tracker.service.JobApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/applications")
public class JobApplicationController {

    private final JobApplicationService service;

    public JobApplicationController(JobApplicationService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<JobApplicationDto>> getAll(
            @AuthenticationPrincipal String userId,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(service.getAllApplications(UUID.fromString(userId), status, search));
    }

    @GetMapping("/stats")
    public ResponseEntity<JobApplicationStatsDto> getStats(
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(service.getApplicationStats(UUID.fromString(userId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationDto> getById(
            @PathVariable UUID id,
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(service.getApplicationById(id, UUID.fromString(userId)));
    }

    @PostMapping
    public ResponseEntity<JobApplicationDto> create(
            @Valid @RequestBody CreateJobApplicationRequest request,
            @AuthenticationPrincipal String userId) {
        return new ResponseEntity<>(service.createApplication(request, UUID.fromString(userId)), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobApplicationDto> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateJobApplicationRequest request,
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(service.updateApplication(id, UUID.fromString(userId), request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<JobApplicationDto> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateStatusRequest request,
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(service.updateStatus(id, UUID.fromString(userId), request.getStatus()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id,
            @AuthenticationPrincipal String userId) {
        service.deleteApplication(id, UUID.fromString(userId));
        return ResponseEntity.noContent().build();
    }
}
