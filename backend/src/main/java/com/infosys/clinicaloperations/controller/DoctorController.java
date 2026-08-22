package com.infosys.clinicaloperations.controller;

import com.infosys.clinicaloperations.dto.ApiResponse;
import com.infosys.clinicaloperations.dto.DoctorDto;
import com.infosys.clinicaloperations.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorDto>>> getAllDoctors(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String specialization
    ) {
        List<DoctorDto> doctors = doctorService.getAllDoctors(search, specialization);
        return ResponseEntity.ok(ApiResponse.success(doctors));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<DoctorDto>>> getActiveDoctors() {
        List<DoctorDto> doctors = doctorService.getActiveDoctors();
        return ResponseEntity.ok(ApiResponse.success(doctors));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorDto>> getDoctorById(@PathVariable Long id) {
        DoctorDto doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(ApiResponse.success(doctor));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DoctorDto>> createDoctor(@Valid @RequestBody DoctorDto dto) {
        DoctorDto created = doctorService.createDoctor(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Doctor added successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DoctorDto>> updateDoctor(
            @PathVariable Long id,
            @Valid @RequestBody DoctorDto dto
    ) {
        DoctorDto updated = doctorService.updateDoctor(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Doctor updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor deleted successfully", null));
    }
}
