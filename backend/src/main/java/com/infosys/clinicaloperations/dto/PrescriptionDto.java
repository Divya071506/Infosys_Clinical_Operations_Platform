package com.infosys.clinicaloperations.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionDto {
    private Long id;

    @NotNull(message = "Appointment ID is required")
    private Long appointmentId;

    private Long patientId;
    private String patientName;
    private String patientEmail;
    private String patientPhone;
    private String patientGender;
    private LocalDate patientDob;

    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private String doctorQualification;

    @NotBlank(message = "Diagnosis is required")
    private String diagnosis;

    private List<MedicineItemDto> medicineList;
    private String rawMedicines; // for json storage fallback

    private String advice;
    private LocalDate prescribedDate;
    private LocalDateTime createdAt;
}
