package com.infosys.clinicaloperations.controller;

import com.infosys.clinicaloperations.dto.ApiResponse;
import com.infosys.clinicaloperations.dto.PrescriptionDto;
import com.infosys.clinicaloperations.service.PrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PrescriptionDto>> createPrescription(
            @Valid @RequestBody PrescriptionDto dto,
            Authentication authentication
    ) {
        PrescriptionDto created = prescriptionService.createPrescription(dto, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Digital prescription issued successfully", created));
    }

    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("authenticated")
    public ResponseEntity<ApiResponse<PrescriptionDto>> getPrescriptionByAppointment(
            @PathVariable Long appointmentId
    ) {
        PrescriptionDto prescription = prescriptionService.getPrescriptionByAppointmentId(appointmentId);
        return ResponseEntity.ok(ApiResponse.success(prescription));
    }

    @GetMapping("/patient/my")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<List<PrescriptionDto>>> getMyPatientPrescriptions(
            Authentication authentication
    ) {
        List<PrescriptionDto> prescriptions = prescriptionService.getPrescriptionsByPatientEmail(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(prescriptions));
    }

    @GetMapping("/doctor/my")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<PrescriptionDto>>> getMyDoctorPrescriptions(
            Authentication authentication
    ) {
        List<PrescriptionDto> prescriptions = prescriptionService.getPrescriptionsByDoctorEmail(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(prescriptions));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<List<PrescriptionDto>>> getPrescriptionsByPatientId(
            @PathVariable Long patientId
    ) {
        List<PrescriptionDto> prescriptions = prescriptionService.getPrescriptionsByPatientId(patientId);
        return ResponseEntity.ok(ApiResponse.success(prescriptions));
    }
}
