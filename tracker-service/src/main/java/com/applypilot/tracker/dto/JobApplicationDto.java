package com.applypilot.tracker.dto;

import com.applypilot.tracker.entity.ApplicationStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public class JobApplicationDto {
    private UUID id;
    private String companyName;
    private String roleTitle;
    private String source;
    private String jobUrl;
    private ApplicationStatus status;
    private String outreachMessage;
    private LocalDateTime messagedAt;
    private LocalDateTime createdAt;
    private LocalDateTime lastUpdated;

    public JobApplicationDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getRoleTitle() { return roleTitle; }
    public void setRoleTitle(String roleTitle) { this.roleTitle = roleTitle; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getJobUrl() { return jobUrl; }
    public void setJobUrl(String jobUrl) { this.jobUrl = jobUrl; }
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public String getOutreachMessage() { return outreachMessage; }
    public void setOutreachMessage(String outreachMessage) { this.outreachMessage = outreachMessage; }
    public LocalDateTime getMessagedAt() { return messagedAt; }
    public void setMessagedAt(LocalDateTime messagedAt) { this.messagedAt = messagedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}
