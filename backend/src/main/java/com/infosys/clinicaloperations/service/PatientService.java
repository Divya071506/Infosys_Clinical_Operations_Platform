package com.infosys.clinicaloperations.service;

import com.infosys.clinicaloperations.dto.PatientDto;
import com.infosys.clinicaloperations.entity.Patient;
import com.infosys.clinicaloperations.entity.Role;
import com.infosys.clinicaloperations.entity.User;
import com.infosys.clinicaloperations.exception.BadRequestException;
import com.infosys.clinicaloperations.exception.ResourceNotFoundException;
import com.infosys.clinicaloperations.repository.PatientRepository;
import com.infosys.clinicaloperations.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<PatientDto> getAllPatients(String search) {
        List<Patient> patients;
        if (search != null && !search.trim().isEmpty()) {
            patients = patientRepository.searchPatients(search.trim());
        } else {
            patients = patientRepository.findAll();
        }
        return patients.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public PatientDto getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        return mapToDto(patient);
    }

    public PatientDto getPatientByEmail(String email) {
        Patient patient = patientRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with email: " + email));
        return mapToDto(patient);
    }

    @Transactional
    public PatientDto createPatient(PatientDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email is already registered: " + dto.getEmail());
        }

        User user = User.builder()
                .fullName(dto.getName().trim())
                .email(dto.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode("Patient@123")) // default password if created by admin
                .role(Role.PATIENT)
                .build();

        User savedUser = userRepository.save(user);

        Patient patient = Patient.builder()
                .user(savedUser)
                .phone(dto.getPhone().trim())
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender().trim())
                .address(dto.getAddress().trim())
                .build();

        Patient savedPatient = patientRepository.save(patient);
        return mapToDto(savedPatient);
    }

    @Transactional
    public PatientDto updatePatient(Long id, PatientDto dto) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));

        User user = patient.getUser();
        if (!user.getEmail().equalsIgnoreCase(dto.getEmail().trim())) {
            if (userRepository.existsByEmail(dto.getEmail().trim())) {
                throw new BadRequestException("Email is already taken: " + dto.getEmail());
            }
            user.setEmail(dto.getEmail().trim().toLowerCase());
        }
        user.setFullName(dto.getName().trim());
        userRepository.save(user);

        patient.setPhone(dto.getPhone().trim());
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setGender(dto.getGender().trim());
        patient.setAddress(dto.getAddress().trim());

        Patient updated = patientRepository.save(patient);
        return mapToDto(updated);
    }

    @Transactional
    public void deletePatient(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        User user = patient.getUser();
        patientRepository.delete(patient);
        userRepository.delete(user);
    }

    public PatientDto mapToDto(Patient patient) {
        return PatientDto.builder()
                .id(patient.getId())
                .userId(patient.getUser().getId())
                .name(patient.getUser().getFullName())
                .email(patient.getUser().getEmail())
                .phone(patient.getPhone())
                .gender(patient.getGender())
                .dateOfBirth(patient.getDateOfBirth())
                .address(patient.getAddress())
                .createdAt(patient.getCreatedAt())
                .build();
    }
}
