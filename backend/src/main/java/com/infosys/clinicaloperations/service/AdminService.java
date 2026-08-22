package com.infosys.clinicaloperations.service;

import com.infosys.clinicaloperations.dto.AppointmentDto;
import com.infosys.clinicaloperations.dto.DashboardStatsDto;
import com.infosys.clinicaloperations.entity.AppointmentStatus;
import com.infosys.clinicaloperations.repository.AppointmentRepository;
import com.infosys.clinicaloperations.repository.DoctorRepository;
import com.infosys.clinicaloperations.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final AppointmentService appointmentService;

    public DashboardStatsDto getDashboardStats() {
        long totalPatients = patientRepository.count();
        long totalDoctors = doctorRepository.count();
        long totalAppointments = appointmentRepository.count();

        long pendingAppointments = appointmentRepository.countByStatus(AppointmentStatus.PENDING);
        long confirmedAppointments = appointmentRepository.countByStatus(AppointmentStatus.CONFIRMED);
        long completedAppointments = appointmentRepository.countByStatus(AppointmentStatus.COMPLETED);
        long cancelledAppointments = appointmentRepository.countByStatus(AppointmentStatus.CANCELLED);

        List<AppointmentDto> recentAppointments = appointmentRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .map(appointmentService::mapToDto)
                .collect(Collectors.toList());

        return DashboardStatsDto.builder()
                .totalPatients(totalPatients)
                .totalDoctors(totalDoctors)
                .totalAppointments(totalAppointments)
                .pendingAppointments(pendingAppointments)
                .confirmedAppointments(confirmedAppointments)
                .completedAppointments(completedAppointments)
                .cancelledAppointments(cancelledAppointments)
                .recentAppointments(recentAppointments)
                .build();
    }
}
