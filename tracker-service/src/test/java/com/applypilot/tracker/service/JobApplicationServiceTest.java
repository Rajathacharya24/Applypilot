package com.applypilot.tracker.service;

import com.applypilot.tracker.dto.CreateJobApplicationRequest;
import com.applypilot.tracker.dto.JobApplicationDto;
import com.applypilot.tracker.entity.ApplicationStatus;
import com.applypilot.tracker.entity.JobApplication;
import com.applypilot.tracker.repository.JobApplicationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class JobApplicationServiceTest {

    @Mock
    private JobApplicationRepository repository;

    @InjectMocks
    private JobApplicationService service;

    private final UUID userId = UUID.randomUUID();
    private final UUID appId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateApplication() {
        CreateJobApplicationRequest request = new CreateJobApplicationRequest();
        request.setCompanyName("Google");
        request.setRoleTitle("Software Engineer");

        JobApplication savedApp = new JobApplication();
        savedApp.setId(appId);
        savedApp.setUserId(userId);
        savedApp.setCompanyName("Google");
        savedApp.setRoleTitle("Software Engineer");
        savedApp.setStatus(ApplicationStatus.NEW);
        
        when(repository.save(any(JobApplication.class))).thenReturn(savedApp);

        JobApplicationDto dto = service.createApplication(request, userId);

        assertNotNull(dto);
        assertEquals("Google", dto.getCompanyName());
        assertEquals(ApplicationStatus.NEW, dto.getStatus());
        verify(repository, times(1)).save(any(JobApplication.class));
    }

    @Test
    void testGetApplicationById() {
        JobApplication app = new JobApplication();
        app.setId(appId);
        app.setUserId(userId);
        app.setCompanyName("Meta");
        
        when(repository.findByIdAndUserId(appId, userId)).thenReturn(Optional.of(app));
        
        JobApplicationDto dto = service.getApplicationById(appId, userId);
        
        assertNotNull(dto);
        assertEquals("Meta", dto.getCompanyName());
    }
    
    @Test
    void testGetApplicationByIdNotFound() {
        when(repository.findByIdAndUserId(appId, userId)).thenReturn(Optional.empty());
        
        assertThrows(IllegalArgumentException.class, () -> {
            service.getApplicationById(appId, userId);
        });
    }

    @Test
    void testUpdateStatus() {
        JobApplication app = new JobApplication();
        app.setId(appId);
        app.setUserId(userId);
        app.setStatus(ApplicationStatus.NEW);

        when(repository.findByIdAndUserId(appId, userId)).thenReturn(Optional.of(app));
        when(repository.save(any(JobApplication.class))).thenReturn(app);

        JobApplicationDto updated = service.updateStatus(appId, userId, ApplicationStatus.INTERVIEW);

        assertEquals(ApplicationStatus.INTERVIEW, updated.getStatus());
        assertEquals(ApplicationStatus.INTERVIEW, app.getStatus());
        verify(repository, times(1)).save(app);
    }
}
