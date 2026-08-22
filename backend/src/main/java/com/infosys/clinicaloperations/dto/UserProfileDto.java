package com.infosys.clinicaloperations.dto;

import com.infosys.clinicaloperations.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private Long userId;
    private String email;
    private String fullName;
    private Role role;
    
    // Patient specific fields
    private Long patientId;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;

    // Doctor specific fields
    private Long doctorId;
    private String specialization;
    private String qualification;
}
