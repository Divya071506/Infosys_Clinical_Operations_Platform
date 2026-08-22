package com.infosys.clinicaloperations.dto;

import com.infosys.clinicaloperations.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    @Builder.Default
    private String type = "Bearer";
    private Long id;
    private String email;
    private String fullName;
    private Role role;
    private Long patientId; // Populated if role is PATIENT
    private Long doctorId;  // Populated if role is DOCTOR
}
