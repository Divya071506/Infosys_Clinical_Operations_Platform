package com.infosys.clinicaloperations.repository;

import com.infosys.clinicaloperations.entity.Doctor;
import com.infosys.clinicaloperations.entity.Patient;
import com.infosys.clinicaloperations.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    Optional<Prescription> findByAppointmentId(Long appointmentId);
    List<Prescription> findByPatientOrderByCreatedAtDesc(Patient patient);
    List<Prescription> findByDoctorOrderByCreatedAtDesc(Doctor doctor);
    List<Prescription> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    List<Prescription> findByDoctorIdOrderByCreatedAtDesc(Long doctorId);
    boolean existsByAppointmentId(Long appointmentId);
}
