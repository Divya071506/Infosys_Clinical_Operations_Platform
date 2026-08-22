package com.infosys.clinicaloperations.repository;

import com.infosys.clinicaloperations.entity.Appointment;
import com.infosys.clinicaloperations.entity.AppointmentStatus;
import com.infosys.clinicaloperations.entity.Doctor;
import com.infosys.clinicaloperations.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientOrderByAppointmentDateDescAppointmentTimeDesc(Patient patient);
    List<Appointment> findByDoctorOrderByAppointmentDateDescAppointmentTimeDesc(Doctor doctor);
    List<Appointment> findByStatus(AppointmentStatus status);
    List<Appointment> findAllByOrderByAppointmentDateDescAppointmentTimeDesc();

    long countByStatus(AppointmentStatus status);

    @Query("SELECT a FROM Appointment a WHERE " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:doctorId IS NULL OR a.doctor.id = :doctorId) AND " +
           "(:date IS NULL OR a.appointmentDate = :date)")
    List<Appointment> filterAppointments(
            @Param("status") AppointmentStatus status,
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date
    );

    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId ORDER BY a.appointmentDate DESC, a.appointmentTime DESC")
    List<Appointment> findByPatientId(@Param("patientId") Long patientId);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId ORDER BY a.appointmentDate DESC, a.appointmentTime DESC")
    List<Appointment> findByDoctorId(@Param("doctorId") Long doctorId);

    @Query("SELECT a FROM Appointment a WHERE LOWER(a.doctor.email) = LOWER(:email) ORDER BY a.appointmentDate DESC, a.appointmentTime DESC")
    List<Appointment> findByDoctorEmail(@Param("email") String email);

    boolean existsByDoctorAndAppointmentDateAndAppointmentTimeAndStatusNot(
            Doctor doctor, LocalDate appointmentDate, String appointmentTime, AppointmentStatus status
    );

    List<Appointment> findTop5ByOrderByCreatedAtDesc();
}
