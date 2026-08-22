package com.infosys.clinicaloperations.service;

import com.infosys.clinicaloperations.dto.AppointmentDto;
import com.infosys.clinicaloperations.entity.*;
import com.infosys.clinicaloperations.exception.BadRequestException;
import com.infosys.clinicaloperations.exception.ResourceNotFoundException;
import com.infosys.clinicaloperations.exception.UnauthorizedException;
import com.infosys.clinicaloperations.repository.AppointmentRepository;
import com.infosys.clinicaloperations.repository.DoctorRepository;
import com.infosys.clinicaloperations.repository.PatientRepository;
import com.infosys.clinicaloperations.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    public List<AppointmentDto> getAllAppointments(AppointmentStatus status, Long doctorId, LocalDate date) {
        List<Appointment> appointments;
        if (status != null || doctorId != null || date != null) {
            appointments = appointmentRepository.filterAppointments(status, doctorId, date);
        } else {
            appointments = appointmentRepository.findAllByOrderByAppointmentDateDescAppointmentTimeDesc();
        }
        return appointments.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<AppointmentDto> getAppointmentsByPatientId(Long patientId) {
        return appointmentRepository.findByPatientId(patientId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<AppointmentDto> getAppointmentsByPatientEmail(String email) {
        Patient patient = patientRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for email: " + email));
        return appointmentRepository.findByPatientOrderByAppointmentDateDescAppointmentTimeDesc(patient).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<AppointmentDto> getAppointmentsByDoctorEmail(String email) {
        return appointmentRepository.findByDoctorEmail(email).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public AppointmentDto getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        return mapToDto(appointment);
    }

    @Transactional
    public AppointmentDto bookAppointment(AppointmentDto dto, String authenticatedEmail) {
        User user = userRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authenticatedEmail));

        Patient patient;
        if (user.getRole() == Role.ADMIN && dto.getPatientId() != null) {
            patient = patientRepository.findById(dto.getPatientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + dto.getPatientId()));
        } else {
            patient = patientRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for user: " + authenticatedEmail));
        }

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + dto.getDoctorId()));

        if (!Boolean.TRUE.equals(doctor.getActive())) {
            throw new BadRequestException("Selected doctor is currently not accepting appointments");
        }

        if (dto.getAppointmentDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Appointment date cannot be in the past");
        }

        // Check if doctor is already booked for this slot
        boolean isSlotTaken = appointmentRepository.existsByDoctorAndAppointmentDateAndAppointmentTimeAndStatusNot(
                doctor,
                dto.getAppointmentDate(),
                dto.getAppointmentTime().trim(),
                AppointmentStatus.CANCELLED
        );
        if (isSlotTaken) {
            throw new BadRequestException("Doctor " + doctor.getName() + " is already booked for " +
                    dto.getAppointmentTime() + " on " + dto.getAppointmentDate() + ". Please choose another slot.");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(dto.getAppointmentDate())
                .appointmentTime(dto.getAppointmentTime().trim())
                .reason(dto.getReason().trim())
                .status(AppointmentStatus.PENDING)
                .notes(dto.getNotes() != null ? dto.getNotes().trim() : null)
                .build();

        Appointment saved = appointmentRepository.save(appointment);
        return mapToDto(saved);
    }

    @Transactional
    public AppointmentDto updateAppointment(Long id, AppointmentDto dto) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + dto.getDoctorId()));

        // If date or time changed, check slot collision
        if (!appointment.getAppointmentDate().equals(dto.getAppointmentDate()) ||
            !appointment.getAppointmentTime().equalsIgnoreCase(dto.getAppointmentTime()) ||
            !appointment.getDoctor().getId().equals(dto.getDoctorId())) {
            
            boolean isSlotTaken = appointmentRepository.existsByDoctorAndAppointmentDateAndAppointmentTimeAndStatusNot(
                    doctor,
                    dto.getAppointmentDate(),
                    dto.getAppointmentTime().trim(),
                    AppointmentStatus.CANCELLED
            );
            if (isSlotTaken) {
                throw new BadRequestException("Doctor is already booked for this time slot.");
            }
        }

        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(dto.getAppointmentDate());
        appointment.setAppointmentTime(dto.getAppointmentTime().trim());
        appointment.setReason(dto.getReason().trim());
        if (dto.getStatus() != null) {
            appointment.setStatus(dto.getStatus());
        }
        if (dto.getNotes() != null) {
            appointment.setNotes(dto.getNotes().trim());
        }

        Appointment updated = appointmentRepository.save(appointment);
        return mapToDto(updated);
    }

    @Transactional
    public AppointmentDto updateAppointmentStatus(Long id, AppointmentStatus status, String notes) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        appointment.setStatus(status);
        if (notes != null && !notes.trim().isEmpty()) {
            appointment.setNotes(notes.trim());
        }

        Appointment updated = appointmentRepository.save(appointment);
        return mapToDto(updated);
    }

    @Transactional
    public AppointmentDto cancelAppointment(Long id, String userEmail) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        // If patient, make sure they own the appointment
        if (user.getRole() == Role.PATIENT) {
            if (!appointment.getPatient().getUser().getId().equals(user.getId())) {
                throw new UnauthorizedException("You can only cancel your own appointments");
            }
        } else if (user.getRole() == Role.DOCTOR) {
            if (!appointment.getDoctor().getEmail().equalsIgnoreCase(user.getEmail())) {
                throw new UnauthorizedException("You can only manage your own appointments");
            }
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setNotes("Cancelled by " + user.getRole().name());

        Appointment updated = appointmentRepository.save(appointment);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        appointmentRepository.delete(appointment);
    }

    public AppointmentDto mapToDto(Appointment appointment) {
        return AppointmentDto.builder()
                .id(appointment.getId())
                .patientId(appointment.getPatient().getId())
                .patientName(appointment.getPatient().getUser().getFullName())
                .patientEmail(appointment.getPatient().getUser().getEmail())
                .patientPhone(appointment.getPatient().getPhone())
                .doctorId(appointment.getDoctor().getId())
                .doctorName(appointment.getDoctor().getName())
                .doctorSpecialization(appointment.getDoctor().getSpecialization())
                .doctorConsultationFee(appointment.getDoctor().getConsultationFee())
                .appointmentDate(appointment.getAppointmentDate())
                .appointmentTime(appointment.getAppointmentTime())
                .reason(appointment.getReason())
                .status(appointment.getStatus())
                .notes(appointment.getNotes())
                .createdAt(appointment.getCreatedAt())
                .build();
    }
}
