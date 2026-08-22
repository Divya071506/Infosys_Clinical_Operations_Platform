package com.infosys.clinicaloperations.dto;

import com.infosys.clinicaloperations.entity.AppointmentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDto {
    private Long id;

    private Long patientId;
    private String patientName;
    private String patientEmail;
    private String patientPhone;

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private BigDecimal doctorConsultationFee;

    @NotNull(message = "Appointment date is required")
    private LocalDate appointmentDate;

    @NotBlank(message = "Appointment time is required")
    private String appointmentTime;

    @NotBlank(message = "Reason for appointment is required")
    private String reason;

    private AppointmentStatus status;
    private String notes;
    private LocalDateTime createdAt;
}
