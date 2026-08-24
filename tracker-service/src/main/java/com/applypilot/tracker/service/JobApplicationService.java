package com.applypilot.tracker.service;

import com.applypilot.tracker.dto.CreateJobApplicationRequest;
import com.applypilot.tracker.dto.JobApplicationDto;
import com.applypilot.tracker.entity.ApplicationStatus;
import com.applypilot.tracker.entity.JobApplication;
import com.applypilot.tracker.repository.JobApplicationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class JobApplicationService {

    private final JobApplicationRepository repository;

    public JobApplicationService(JobApplicationRepository repository) {
        this.repository = repository;
    }

    public List<JobApplicationDto> getAllApplications(UUID userId, ApplicationStatus status) {
        List<JobApplication> applications;
        if (status != null) {
            applications = repository.findByUserIdAndStatus(userId, status);
        } else {
            applications = repository.findByUserId(userId);
        }
        return applications.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public JobApplicationDto getApplicationById(UUID id, UUID userId) {
        JobApplication app = repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));
        return mapToDto(app);
    }

    public JobApplicationDto createApplication(CreateJobApplicationRequest request, UUID userId) {
        JobApplication app = new JobApplication();
        app.setUserId(userId);
        app.setCompanyName(request.getCompanyName());
        app.setRoleTitle(request.getRoleTitle());
        app.setSource(request.getSource() != null ? request.getSource() : "manual");
        app.setJobUrl(request.getJobUrl());
        app.setOutreachMessage(request.getOutreachMessage());
        
        JobApplication saved = repository.save(app);
        return mapToDto(saved);
    }

    public JobApplicationDto updateStatus(UUID id, UUID userId, ApplicationStatus newStatus) {
        JobApplication app = repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));
        
        app.setStatus(newStatus);
        if (newStatus == ApplicationStatus.MESSAGED && app.getMessagedAt() == null) {
            app.setMessagedAt(LocalDateTime.now());
        }
        
        JobApplication saved = repository.save(app);
        return mapToDto(saved);
    }

    public void deleteApplication(UUID id, UUID userId) {
        JobApplication app = repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));
        repository.delete(app);
    }

    private JobApplicationDto mapToDto(JobApplication app) {
        JobApplicationDto dto = new JobApplicationDto();
        dto.setId(app.getId());
        dto.setCompanyName(app.getCompanyName());
        dto.setRoleTitle(app.getRoleTitle());
        dto.setSource(app.getSource());
        dto.setJobUrl(app.getJobUrl());
        dto.setStatus(app.getStatus());
        dto.setOutreachMessage(app.getOutreachMessage());
        dto.setMessagedAt(app.getMessagedAt());
        dto.setCreatedAt(app.getCreatedAt());
        dto.setLastUpdated(app.getLastUpdated());
        return dto;
    }
}
