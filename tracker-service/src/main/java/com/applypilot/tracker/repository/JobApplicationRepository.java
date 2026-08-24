package com.applypilot.tracker.repository;

import com.applypilot.tracker.entity.ApplicationStatus;
import com.applypilot.tracker.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID> {
    List<JobApplication> findByUserId(UUID userId);
    List<JobApplication> findByUserIdAndStatus(UUID userId, ApplicationStatus status);
    Optional<JobApplication> findByIdAndUserId(UUID id, UUID userId);
}
