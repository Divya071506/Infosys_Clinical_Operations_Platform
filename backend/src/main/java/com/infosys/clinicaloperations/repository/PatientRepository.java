package com.infosys.clinicaloperations.repository;

import com.infosys.clinicaloperations.entity.Patient;
import com.infosys.clinicaloperations.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByUser(User user);
    Optional<Patient> findByUserId(Long userId);
    Optional<Patient> findByUserEmail(String email);

    @Query("SELECT p FROM Patient p WHERE " +
           "LOWER(p.user.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.user.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.phone) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.address) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Patient> searchPatients(@Param("query") String query);
}
