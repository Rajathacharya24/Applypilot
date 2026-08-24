package com.applypilot.tracker.dto;

import com.applypilot.tracker.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateStatusRequest {
    
    @NotNull(message = "Status is required")
    private ApplicationStatus status;
    
    public UpdateStatusRequest() {}
    
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
}
