package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Plateau;
import com.mycompany.myapp.repository.PlateauRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Plateau}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PlateauResource {

    private final Logger log = LoggerFactory.getLogger(PlateauResource.class);

    private static final String ENTITY_NAME = "plateau";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PlateauRepository plateauRepository;

    public PlateauResource(PlateauRepository plateauRepository) {
        this.plateauRepository = plateauRepository;
    }

    /**
     * {@code POST  /plateaus} : Create a new plateau.
     *
     * @param plateau the plateau to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new plateau, or with status {@code 400 (Bad Request)} if the plateau has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/plateaus")
    public ResponseEntity<Plateau> createPlateau(@RequestBody Plateau plateau) throws URISyntaxException {
        log.debug("REST request to save Plateau : {}", plateau);
        if (plateau.getId() != null) {
            throw new BadRequestAlertException("A new plateau cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Plateau result = plateauRepository.save(plateau);
        return ResponseEntity
            .created(new URI("/api/plateaus/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /plateaus/:id} : Updates an existing plateau.
     *
     * @param id the id of the plateau to save.
     * @param plateau the plateau to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated plateau,
     * or with status {@code 400 (Bad Request)} if the plateau is not valid,
     * or with status {@code 500 (Internal Server Error)} if the plateau couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/plateaus/{id}")
    public ResponseEntity<Plateau> updatePlateau(@PathVariable(value = "id", required = false) final Long id, @RequestBody Plateau plateau)
        throws URISyntaxException {
        log.debug("REST request to update Plateau : {}, {}", id, plateau);
        if (plateau.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, plateau.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!plateauRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Plateau result = plateauRepository.save(plateau);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, plateau.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /plateaus/:id} : Partial updates given fields of an existing plateau, field will ignore if it is null
     *
     * @param id the id of the plateau to save.
     * @param plateau the plateau to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated plateau,
     * or with status {@code 400 (Bad Request)} if the plateau is not valid,
     * or with status {@code 404 (Not Found)} if the plateau is not found,
     * or with status {@code 500 (Internal Server Error)} if the plateau couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/plateaus/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Plateau> partialUpdatePlateau(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Plateau plateau
    ) throws URISyntaxException {
        log.debug("REST request to partial update Plateau partially : {}, {}", id, plateau);
        if (plateau.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, plateau.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!plateauRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Plateau> result = plateauRepository
            .findById(plateau.getId())
            .map(existingPlateau -> {
                if (plateau.getNom() != null) {
                    existingPlateau.setNom(plateau.getNom());
                }
                if (plateau.getImage() != null) {
                    existingPlateau.setImage(plateau.getImage());
                }
                if (plateau.getImageContentType() != null) {
                    existingPlateau.setImageContentType(plateau.getImageContentType());
                }
                if (plateau.getNbQuestions() != null) {
                    existingPlateau.setNbQuestions(plateau.getNbQuestions());
                }
                if (plateau.getPrincipal() != null) {
                    existingPlateau.setPrincipal(plateau.getPrincipal());
                }

                return existingPlateau;
            })
            .map(plateauRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, plateau.getId().toString())
        );
    }

    /**
     * {@code GET  /plateaus} : get all the plateaus.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of plateaus in body.
     */
    @GetMapping("/plateaus")
    public List<Plateau> getAllPlateaus() {
        log.debug("REST request to get all Plateaus");
        return plateauRepository.findAll();
    }

    /**
     * {@code GET  /plateaus/:id} : get the "id" plateau.
     *
     * @param id the id of the plateau to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the plateau, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/plateaus/{id}")
    public ResponseEntity<Plateau> getPlateau(@PathVariable Long id) {
        log.debug("REST request to get Plateau : {}", id);
        Optional<Plateau> plateau = plateauRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(plateau);
    }

    /**
     * {@code DELETE  /plateaus/:id} : delete the "id" plateau.
     *
     * @param id the id of the plateau to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/plateaus/{id}")
    public ResponseEntity<Void> deletePlateau(@PathVariable Long id) {
        log.debug("REST request to delete Plateau : {}", id);
        plateauRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
