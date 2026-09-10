package com.applypilot.tracker.dto;

import com.applypilot.tracker.entity.ApplicationStatus;
import java.util.Map;

public class JobApplicationStatsDto {
    private long totalApplications;
    private long activeInterviews;
    private long offersCount;
    private long rejectionsCount;
    private double responseRatePercentage;
    private Map<ApplicationStatus, Long> statusCounts;

    public JobApplicationStatsDto() {}

    public JobApplicationStatsDto(long totalApplications, long activeInterviews, long offersCount, long rejectionsCount, double responseRatePercentage, Map<ApplicationStatus, Long> statusCounts) {
        this.totalApplications = totalApplications;
        this.activeInterviews = activeInterviews;
        this.offersCount = offersCount;
        this.rejectionsCount = rejectionsCount;
        this.responseRatePercentage = responseRatePercentage;
        this.statusCounts = statusCounts;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getActiveInterviews() {
        return activeInterviews;
    }

    public void setActiveInterviews(long activeInterviews) {
        this.activeInterviews = activeInterviews;
    }

    public long getOffersCount() {
        return offersCount;
    }

    public void setOffersCount(long offersCount) {
        this.offersCount = offersCount;
    }

    public long getRejectionsCount() {
        return rejectionsCount;
    }

    public void setRejectionsCount(long rejectionsCount) {
        this.rejectionsCount = rejectionsCount;
    }

    public double getResponseRatePercentage() {
        return responseRatePercentage;
    }

    public void setResponseRatePercentage(double responseRatePercentage) {
        this.responseRatePercentage = responseRatePercentage;
    }

    public Map<ApplicationStatus, Long> getStatusCounts() {
        return statusCounts;
    }

    public void setStatusCounts(Map<ApplicationStatus, Long> statusCounts) {
        this.statusCounts = statusCounts;
    }
}
