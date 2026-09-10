package com.applypilot.tracker.service;

import com.applypilot.tracker.dto.CreateJobApplicationRequest;
import com.applypilot.tracker.dto.JobApplicationDto;
import com.applypilot.tracker.dto.JobApplicationStatsDto;
import com.applypilot.tracker.dto.UpdateJobApplicationRequest;
import com.applypilot.tracker.entity.ApplicationStatus;
import com.applypilot.tracker.entity.JobApplication;
import com.applypilot.tracker.repository.JobApplicationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class JobApplicationService {

    private final JobApplicationRepository repository;

    public JobApplicationService(JobApplicationRepository repository) {
        this.repository = repository;
    }

    public List<JobApplicationDto> getAllApplications(UUID userId, ApplicationStatus status, String search) {
        List<JobApplication> applications;
        if (search != null && !search.trim().isEmpty()) {
            applications = repository.searchApplications(userId, search.trim());
            if (status != null) {
                applications = applications.stream()
                        .filter(app -> app.getStatus() == status)
                        .collect(Collectors.toList());
            }
        } else if (status != null) {
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

    public JobApplicationDto updateApplication(UUID id, UUID userId, UpdateJobApplicationRequest request) {
        JobApplication app = repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        app.setCompanyName(request.getCompanyName());
        app.setRoleTitle(request.getRoleTitle());
        app.setSource(request.getSource() != null ? request.getSource() : app.getSource());
        app.setJobUrl(request.getJobUrl());
        app.setOutreachMessage(request.getOutreachMessage());
        
        if (request.getStatus() != null && app.getStatus() != request.getStatus()) {
            app.setStatus(request.getStatus());
            if (request.getStatus() == ApplicationStatus.MESSAGED && app.getMessagedAt() == null) {
                app.setMessagedAt(LocalDateTime.now());
            }
        }

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

    public JobApplicationStatsDto getApplicationStats(UUID userId) {
        List<JobApplication> apps = repository.findByUserId(userId);
        long total = apps.size();
        
        Map<ApplicationStatus, Long> counts = new EnumMap<>(ApplicationStatus.class);
        for (ApplicationStatus status : ApplicationStatus.values()) {
            counts.put(status, 0L);
        }
        
        for (JobApplication app : apps) {
            if (app.getStatus() != null) {
                counts.put(app.getStatus(), counts.getOrDefault(app.getStatus(), 0L) + 1);
            }
        }

        long activeInterviews = counts.getOrDefault(ApplicationStatus.INTERVIEW, 0L);
        long offers = counts.getOrDefault(ApplicationStatus.OFFER, 0L);
        long rejections = counts.getOrDefault(ApplicationStatus.REJECTED, 0L);
        
        // Response rate: percentage of applications that progressed past NEW/APPLIED
        long responded = activeInterviews + offers + rejections + counts.getOrDefault(ApplicationStatus.MESSAGED, 0L);
        double responseRate = total > 0 ? (double) responded / total * 100.0 : 0.0;

        return new JobApplicationStatsDto(total, activeInterviews, offers, rejections, Math.round(responseRate * 10.0) / 10.0, counts);
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
