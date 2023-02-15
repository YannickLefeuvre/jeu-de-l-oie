package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Caze;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Caze entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CazeRepository extends JpaRepository<Caze, Long> {}
