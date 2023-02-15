package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Caze;
import com.mycompany.myapp.repository.CazeRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Caze}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CazeResource {

    private final Logger log = LoggerFactory.getLogger(CazeResource.class);

    private static final String ENTITY_NAME = "caze";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CazeRepository cazeRepository;

    public CazeResource(CazeRepository cazeRepository) {
        this.cazeRepository = cazeRepository;
    }

    /**
     * {@code POST  /cazes} : Create a new caze.
     *
     * @param caze the caze to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new caze, or with status {@code 400 (Bad Request)} if the caze has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/cazes")
    public ResponseEntity<Caze> createCaze(@RequestBody Caze caze) throws URISyntaxException {
        log.debug("REST request to save Caze : {}", caze);
        if (caze.getId() != null) {
            throw new BadRequestAlertException("A new caze cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Caze result = cazeRepository.save(caze);
        return ResponseEntity
            .created(new URI("/api/cazes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /cazes/:id} : Updates an existing caze.
     *
     * @param id the id of the caze to save.
     * @param caze the caze to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated caze,
     * or with status {@code 400 (Bad Request)} if the caze is not valid,
     * or with status {@code 500 (Internal Server Error)} if the caze couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/cazes/{id}")
    public ResponseEntity<Caze> updateCaze(@PathVariable(value = "id", required = false) final Long id, @RequestBody Caze caze)
        throws URISyntaxException {
        log.debug("REST request to update Caze : {}, {}", id, caze);
        if (caze.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, caze.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cazeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Caze result = cazeRepository.save(caze);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, caze.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /cazes/:id} : Partial updates given fields of an existing caze, field will ignore if it is null
     *
     * @param id the id of the caze to save.
     * @param caze the caze to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated caze,
     * or with status {@code 400 (Bad Request)} if the caze is not valid,
     * or with status {@code 404 (Not Found)} if the caze is not found,
     * or with status {@code 500 (Internal Server Error)} if the caze couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/cazes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Caze> partialUpdateCaze(@PathVariable(value = "id", required = false) final Long id, @RequestBody Caze caze)
        throws URISyntaxException {
        log.debug("REST request to partial update Caze partially : {}, {}", id, caze);
        if (caze.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, caze.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cazeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Caze> result = cazeRepository
            .findById(caze.getId())
            .map(existingCaze -> {
                if (caze.getQuestion() != null) {
                    existingCaze.setQuestion(caze.getQuestion());
                }
                if (caze.getAbsice() != null) {
                    existingCaze.setAbsice(caze.getAbsice());
                }
                if (caze.getOrdo() != null) {
                    existingCaze.setOrdo(caze.getOrdo());
                }
                if (caze.getPosition() != null) {
                    existingCaze.setPosition(caze.getPosition());
                }

                return existingCaze;
            })
            .map(cazeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, caze.getId().toString())
        );
    }

    /**
     * {@code GET  /cazes} : get all the cazes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of cazes in body.
     */
    @GetMapping("/cazes")
    public List<Caze> getAllCazes() {
        log.debug("REST request to get all Cazes");
        return cazeRepository.findAll();
    }

    /**
     * {@code GET  /cazes/:id} : get the "id" caze.
     *
     * @param id the id of the caze to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the caze, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/cazes/{id}")
    public ResponseEntity<Caze> getCaze(@PathVariable Long id) {
        log.debug("REST request to get Caze : {}", id);
        Optional<Caze> caze = cazeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(caze);
    }

    /**
     * {@code DELETE  /cazes/:id} : delete the "id" caze.
     *
     * @param id the id of the caze to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/cazes/{id}")
    public ResponseEntity<Void> deleteCaze(@PathVariable Long id) {
        log.debug("REST request to delete Caze : {}", id);
        cazeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
