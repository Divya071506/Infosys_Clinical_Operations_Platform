package com.infosys.clinicaloperations.service;

import com.infosys.clinicaloperations.dto.AuthRequest;
import com.infosys.clinicaloperations.dto.AuthResponse;
import com.infosys.clinicaloperations.dto.RegisterRequest;
import com.infosys.clinicaloperations.dto.UserProfileDto;
import com.infosys.clinicaloperations.entity.Doctor;
import com.infosys.clinicaloperations.entity.Patient;
import com.infosys.clinicaloperations.entity.Role;
import com.infosys.clinicaloperations.entity.User;
import com.infosys.clinicaloperations.exception.BadRequestException;
import com.infosys.clinicaloperations.exception.ResourceNotFoundException;
import com.infosys.clinicaloperations.repository.DoctorRepository;
import com.infosys.clinicaloperations.repository.PatientRepository;
import com.infosys.clinicaloperations.repository.UserRepository;
import com.infosys.clinicaloperations.security.CustomUserDetailsService;
import com.infosys.clinicaloperations.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.PATIENT)
                .build();

        User savedUser = userRepository.save(user);

        Patient patient = Patient.builder()
                .user(savedUser)
                .phone(request.getPhone().trim())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender().trim())
                .address(request.getAddress().trim())
                .build();

        Patient savedPatient = patientRepository.save(patient);

        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtService.generateToken(userDetails, savedUser.getRole().name(), savedUser.getId());

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .role(savedUser.getRole())
                .patientId(savedPatient.getId())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().trim().toLowerCase(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails, user.getRole().name(), user.getId());

        Long patientId = null;
        Long doctorId = null;

        if (user.getRole() == Role.PATIENT) {
            patientId = patientRepository.findByUserId(user.getId())
                    .map(Patient::getId)
                    .orElse(null);
        } else if (user.getRole() == Role.DOCTOR) {
            doctorId = doctorRepository.findByEmail(user.getEmail())
                    .map(Doctor::getId)
                    .orElse(null);
        }

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .patientId(patientId)
                .doctorId(doctorId)
                .build();
    }

    public UserProfileDto getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        UserProfileDto.UserProfileDtoBuilder builder = UserProfileDto.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole());

        if (user.getRole() == Role.PATIENT) {
            patientRepository.findByUserId(user.getId()).ifPresent(patient -> {
                builder.patientId(patient.getId())
                        .phone(patient.getPhone())
                        .dateOfBirth(patient.getDateOfBirth())
                        .gender(patient.getGender())
                        .address(patient.getAddress());
            });
        } else if (user.getRole() == Role.DOCTOR) {
            doctorRepository.findByEmail(user.getEmail()).ifPresent(doctor -> {
                builder.doctorId(doctor.getId())
                        .phone(doctor.getPhone())
                        .specialization(doctor.getSpecialization())
                        .qualification(doctor.getQualification());
            });
        }

        return builder.build();
    }
}
