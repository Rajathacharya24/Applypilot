package com.applypilot.tracker.dto;

import com.applypilot.tracker.entity.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UpdateJobApplicationRequest {

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Role title is required")
    private String roleTitle;

    private String source;
    private String jobUrl;
    private String outreachMessage;

    @NotNull(message = "Status is required")
    private ApplicationStatus status;

    public UpdateJobApplicationRequest() {}

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getRoleTitle() {
        return roleTitle;
    }

    public void setRoleTitle(String roleTitle) {
        this.roleTitle = roleTitle;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getJobUrl() {
        return jobUrl;
    }

    public void setJobUrl(String jobUrl) {
        this.jobUrl = jobUrl;
    }

    public String getOutreachMessage() {
        return outreachMessage;
    }

    public void setOutreachMessage(String outreachMessage) {
        this.outreachMessage = outreachMessage;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
}
