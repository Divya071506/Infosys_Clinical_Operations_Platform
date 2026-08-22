package com.infosys.clinicaloperations.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.infosys.clinicaloperations.dto.MedicineItemDto;
import com.infosys.clinicaloperations.dto.PrescriptionDto;
import com.infosys.clinicaloperations.entity.*;
import com.infosys.clinicaloperations.exception.BadRequestException;
import com.infosys.clinicaloperations.exception.ResourceNotFoundException;
import com.infosys.clinicaloperations.exception.UnauthorizedException;
import com.infosys.clinicaloperations.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public PrescriptionDto createPrescription(PrescriptionDto dto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        Appointment appointment = appointmentRepository.findById(dto.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + dto.getAppointmentId()));

        Doctor doctor;
        if (user.getRole() == Role.DOCTOR) {
            doctor = doctorRepository.findByEmail(user.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for email: " + user.getEmail()));
            if (!appointment.getDoctor().getId().equals(doctor.getId())) {
                throw new UnauthorizedException("You can only issue prescriptions for your own appointments");
            }
        } else if (user.getRole() == Role.ADMIN) {
            doctor = appointment.getDoctor();
        } else {
            throw new UnauthorizedException("Only doctors or administrators can issue prescriptions");
        }

        if (prescriptionRepository.existsByAppointmentId(appointment.getId())) {
            throw new BadRequestException("Prescription already exists for this appointment. You can view or update it.");
        }

        String medicinesJson = "";
        try {
            if (dto.getMedicineList() != null && !dto.getMedicineList().isEmpty()) {
                medicinesJson = objectMapper.writeValueAsString(dto.getMedicineList());
            } else if (dto.getRawMedicines() != null) {
                medicinesJson = dto.getRawMedicines();
            }
        } catch (Exception e) {
            log.error("Error serializing medicines list", e);
            medicinesJson = "[]";
        }

        Prescription prescription = Prescription.builder()
                .appointment(appointment)
                .patient(appointment.getPatient())
                .doctor(doctor)
                .diagnosis(dto.getDiagnosis().trim())
                .medicines(medicinesJson)
                .advice(dto.getAdvice() != null ? dto.getAdvice().trim() : null)
                .prescribedDate(LocalDate.now())
                .build();

        Prescription saved = prescriptionRepository.save(prescription);

        // Also mark the appointment as COMPLETED if it was CONFIRMED or PENDING
        if (appointment.getStatus() != AppointmentStatus.COMPLETED) {
            appointment.setStatus(AppointmentStatus.COMPLETED);
            appointment.setNotes("Consultation completed & prescription issued.");
            appointmentRepository.save(appointment);
        }

        return mapToDto(saved);
    }

    public PrescriptionDto getPrescriptionByAppointmentId(Long appointmentId) {
        Prescription prescription = prescriptionRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("No prescription found for appointment id: " + appointmentId));
        return mapToDto(prescription);
    }

    public List<PrescriptionDto> getPrescriptionsByPatientEmail(String email) {
        Patient patient = patientRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for email: " + email));
        return prescriptionRepository.findByPatientOrderByCreatedAtDesc(patient).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<PrescriptionDto> getPrescriptionsByDoctorEmail(String email) {
        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for email: " + email));
        return prescriptionRepository.findByDoctorOrderByCreatedAtDesc(doctor).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<PrescriptionDto> getPrescriptionsByPatientId(Long patientId) {
        return prescriptionRepository.findByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public PrescriptionDto mapToDto(Prescription p) {
        List<MedicineItemDto> medicineList = new ArrayList<>();
        try {
            if (p.getMedicines() != null && !p.getMedicines().trim().isEmpty()) {
                medicineList = objectMapper.readValue(p.getMedicines(), new TypeReference<List<MedicineItemDto>>() {});
            }
        } catch (Exception e) {
            log.warn("Could not deserialize medicines json: {}", p.getMedicines());
        }

        return PrescriptionDto.builder()
                .id(p.getId())
                .appointmentId(p.getAppointment().getId())
                .patientId(p.getPatient().getId())
                .patientName(p.getPatient().getUser().getFullName())
                .patientEmail(p.getPatient().getUser().getEmail())
                .patientPhone(p.getPatient().getPhone())
                .patientGender(p.getPatient().getGender())
                .patientDob(p.getPatient().getDateOfBirth())
                .doctorId(p.getDoctor().getId())
                .doctorName(p.getDoctor().getName())
                .doctorSpecialization(p.getDoctor().getSpecialization())
                .doctorQualification(p.getDoctor().getQualification())
                .diagnosis(p.getDiagnosis())
                .medicineList(medicineList)
                .rawMedicines(p.getMedicines())
                .advice(p.getAdvice())
                .prescribedDate(p.getPrescribedDate())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
