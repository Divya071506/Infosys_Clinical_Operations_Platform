package com.infosys.clinicaloperations.controller;

import com.infosys.clinicaloperations.dto.ApiResponse;
import com.infosys.clinicaloperations.dto.AppointmentDto;
import com.infosys.clinicaloperations.dto.AppointmentStatusUpdateRequest;
import com.infosys.clinicaloperations.entity.AppointmentStatus;
import com.infosys.clinicaloperations.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getAllAppointments(
            @RequestParam(required = false) AppointmentStatus status,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<AppointmentDto> appointments = appointmentService.getAllAppointments(status, doctorId, date);
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getMyAppointments(Authentication authentication) {
        List<AppointmentDto> appointments = appointmentService.getAppointmentsByPatientEmail(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @GetMapping("/doctor/my")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getMyDoctorAppointments(Authentication authentication) {
        List<AppointmentDto> appointments = appointmentService.getAppointmentsByDoctorEmail(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getAppointmentsByPatientId(@PathVariable Long patientId) {
        List<AppointmentDto> appointments = appointmentService.getAppointmentsByPatientId(patientId);
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @GetMapping("/{id}")
    @PreAuthorize("authenticated")
    public ResponseEntity<ApiResponse<AppointmentDto>> getAppointmentById(@PathVariable Long id) {
        AppointmentDto appointment = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(ApiResponse.success(appointment));
    }

    @PostMapping
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AppointmentDto>> bookAppointment(
            @Valid @RequestBody AppointmentDto dto,
            Authentication authentication
    ) {
        AppointmentDto created = appointmentService.bookAppointment(dto, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Appointment booked successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AppointmentDto>> updateAppointment(
            @PathVariable Long id,
            @Valid @RequestBody AppointmentDto dto
    ) {
        AppointmentDto updated = appointmentService.updateAppointment(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Appointment updated successfully", updated));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<AppointmentDto>> updateAppointmentStatus(
            @PathVariable Long id,
            @Valid @RequestBody AppointmentStatusUpdateRequest request
    ) {
        AppointmentDto updated = appointmentService.updateAppointmentStatus(id, request.getStatus(), request.getNotes());
        return ResponseEntity.ok(ApiResponse.success("Appointment status updated successfully", updated));
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("authenticated")
    public ResponseEntity<ApiResponse<AppointmentDto>> cancelAppointment(
            @PathVariable Long id,
            Authentication authentication
    ) {
        AppointmentDto updated = appointmentService.cancelAppointment(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Appointment cancelled successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok(ApiResponse.success("Appointment deleted successfully", null));
    }
}
