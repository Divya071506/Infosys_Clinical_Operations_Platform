package com.infosys.clinicaloperations.service;

import com.infosys.clinicaloperations.dto.DoctorDto;
import com.infosys.clinicaloperations.entity.Doctor;
import com.infosys.clinicaloperations.exception.BadRequestException;
import com.infosys.clinicaloperations.exception.ResourceNotFoundException;
import com.infosys.clinicaloperations.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public List<DoctorDto> getAllDoctors(String search, String specialization) {
        List<Doctor> doctors;
        if (search != null && !search.trim().isEmpty()) {
            doctors = doctorRepository.searchDoctors(search.trim());
        } else if (specialization != null && !specialization.trim().isEmpty()) {
            doctors = doctorRepository.findBySpecializationIgnoreCase(specialization.trim());
        } else {
            doctors = doctorRepository.findAll();
        }
        return doctors.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<DoctorDto> getActiveDoctors() {
        return doctorRepository.findByActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public DoctorDto getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        return mapToDto(doctor);
    }

    @Transactional
    public DoctorDto createDoctor(DoctorDto dto) {
        if (doctorRepository.existsByEmail(dto.getEmail().trim())) {
            throw new BadRequestException("Doctor with this email already exists: " + dto.getEmail());
        }

        Doctor doctor = Doctor.builder()
                .name(dto.getName().trim())
                .email(dto.getEmail().trim().toLowerCase())
                .phone(dto.getPhone().trim())
                .specialization(dto.getSpecialization().trim())
                .qualification(dto.getQualification().trim())
                .experience(dto.getExperience())
                .availableDays(dto.getAvailableDays().trim())
                .consultationFee(dto.getConsultationFee())
                .active(dto.getActive() == null ? true : dto.getActive())
                .build();

        Doctor saved = doctorRepository.save(doctor);
        return mapToDto(saved);
    }

    @Transactional
    public DoctorDto updateDoctor(Long id, DoctorDto dto) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));

        if (!doctor.getEmail().equalsIgnoreCase(dto.getEmail().trim())) {
            if (doctorRepository.existsByEmail(dto.getEmail().trim())) {
                throw new BadRequestException("Email is already taken by another doctor: " + dto.getEmail());
            }
            doctor.setEmail(dto.getEmail().trim().toLowerCase());
        }

        doctor.setName(dto.getName().trim());
        doctor.setPhone(dto.getPhone().trim());
        doctor.setSpecialization(dto.getSpecialization().trim());
        doctor.setQualification(dto.getQualification().trim());
        doctor.setExperience(dto.getExperience());
        doctor.setAvailableDays(dto.getAvailableDays().trim());
        doctor.setConsultationFee(dto.getConsultationFee());
        if (dto.getActive() != null) {
            doctor.setActive(dto.getActive());
        }

        Doctor updated = doctorRepository.save(doctor);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        doctorRepository.delete(doctor);
    }

    public DoctorDto mapToDto(Doctor doctor) {
        return DoctorDto.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .email(doctor.getEmail())
                .phone(doctor.getPhone())
                .specialization(doctor.getSpecialization())
                .qualification(doctor.getQualification())
                .experience(doctor.getExperience())
                .availableDays(doctor.getAvailableDays())
                .consultationFee(doctor.getConsultationFee())
                .active(doctor.getActive())
                .createdAt(doctor.getCreatedAt())
                .build();
    }
}
