package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Caze;
import com.mycompany.myapp.repository.CazeRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CazeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CazeResourceIT {

    private static final String DEFAULT_QUESTION = "AAAAAAAAAA";
    private static final String UPDATED_QUESTION = "BBBBBBBBBB";

    private static final Integer DEFAULT_ABSICE = 1;
    private static final Integer UPDATED_ABSICE = 2;

    private static final Integer DEFAULT_ORDO = 1;
    private static final Integer UPDATED_ORDO = 2;

    private static final Integer DEFAULT_POSITION = 1;
    private static final Integer UPDATED_POSITION = 2;

    private static final String ENTITY_API_URL = "/api/cazes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CazeRepository cazeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCazeMockMvc;

    private Caze caze;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Caze createEntity(EntityManager em) {
        Caze caze = new Caze().question(DEFAULT_QUESTION).absice(DEFAULT_ABSICE).ordo(DEFAULT_ORDO).position(DEFAULT_POSITION);
        return caze;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Caze createUpdatedEntity(EntityManager em) {
        Caze caze = new Caze().question(UPDATED_QUESTION).absice(UPDATED_ABSICE).ordo(UPDATED_ORDO).position(UPDATED_POSITION);
        return caze;
    }

    @BeforeEach
    public void initTest() {
        caze = createEntity(em);
    }

    @Test
    @Transactional
    void createCaze() throws Exception {
        int databaseSizeBeforeCreate = cazeRepository.findAll().size();
        // Create the Caze
        restCazeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(caze)))
            .andExpect(status().isCreated());

        // Validate the Caze in the database
        List<Caze> cazeList = cazeRepository.findAll();
        assertThat(cazeList).hasSize(databaseSizeBeforeCreate + 1);
        Caze testCaze = cazeList.get(cazeList.size() - 1);
        assertThat(testCaze.getQuestion()).isEqualTo(DEFAULT_QUESTION);
        assertThat(testCaze.getAbsice()).isEqualTo(DEFAULT_ABSICE);
        assertThat(testCaze.getOrdo()).isEqualTo(DEFAULT_ORDO);
        assertThat(testCaze.getPosition()).isEqualTo(DEFAULT_POSITION);
    }

    @Test
    @Transactional
    void createCazeWithExistingId() throws Exception {
        // Create the Caze with an existing ID
        caze.setId(1L);

        int databaseSizeBeforeCreate = cazeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCazeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(caze)))
            .andExpect(status().isBadRequest());

        // Validate the Caze in the database
        List<Caze> cazeList = cazeRepository.findAll();
        assertThat(cazeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCazes() throws Exception {
        // Initialize the database
        cazeRepository.saveAndFlush(caze);

        // Get all the cazeList
        restCazeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(caze.getId().intValue())))
            .andExpect(jsonPath("$.[*].question").value(hasItem(DEFAULT_QUESTION)))
            .andExpect(jsonPath("$.[*].absice").value(hasItem(DEFAULT_ABSICE)))
            .andExpect(jsonPath("$.[*].ordo").value(hasItem(DEFAULT_ORDO)))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)));
    }

    @Test
    @Transactional
    void getCaze() throws Exception {
        // Initialize the database
        cazeRepository.saveAndFlush(caze);

        // Get the caze
        restCazeMockMvc
            .perform(get(ENTITY_API_URL_ID, caze.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(caze.getId().intValue()))
            .andExpect(jsonPath("$.question").value(DEFAULT_QUESTION))
            .andExpect(jsonPath("$.absice").value(DEFAULT_ABSICE))
            .andExpect(jsonPath("$.ordo").value(DEFAULT_ORDO))
            .andExpect(jsonPath("$.position").value(DEFAULT_POSITION));
    }

    @Test
    @Transactional
    void getNonExistingCaze() throws Exception {
        // Get the caze
        restCazeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCaze() throws Exception {
        // Initialize the database
        cazeRepository.saveAndFlush(caze);

        int databaseSizeBeforeUpdate = cazeRepository.findAll().size();

        // Update the caze
        Caze updatedCaze = cazeRepository.findById(caze.getId()).get();
        // Disconnect from session so that the updates on updatedCaze are not directly saved in db
        em.detach(updatedCaze);
        updatedCaze.question(UPDATED_QUESTION).absice(UPDATED_ABSICE).ordo(UPDATED_ORDO).position(UPDATED_POSITION);

        restCazeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCaze.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCaze))
            )
            .andExpect(status().isOk());

        // Validate the Caze in the database
        List<Caze> cazeList = cazeRepository.findAll();
        assertThat(cazeList).hasSize(databaseSizeBeforeUpdate);
        Caze testCaze = cazeList.get(cazeList.size() - 1);
        assertThat(testCaze.getQuestion()).isEqualTo(UPDATED_QUESTION);
        assertThat(testCaze.getAbsice()).isEqualTo(UPDATED_ABSICE);
        assertThat(testCaze.getOrdo()).isEqualTo(UPDATED_ORDO);
        assertThat(testCaze.getPosition()).isEqualTo(UPDATED_POSITION);
    }

    @Test
    @Transactional
    void putNonExistingCaze() throws Exception {
        int databaseSizeBeforeUpdate = cazeRepository.findAll().size();
        caze.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCazeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, caze.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(caze))
            )
            .andExpect(status().isBadRequest());

        // Validate the Caze in the database
        List<Caze> cazeList = cazeRepository.findAll();
        assertThat(cazeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCaze() throws Exception {
        int databaseSizeBeforeUpdate = cazeRepository.findAll().size();
        caze.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCazeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(caze))
            )
            .andExpect(status().isBadRequest());

        // Validate the Caze in the database
        List<Caze> cazeList = cazeRepository.findAll();
        assertThat(cazeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCaze() throws Exception {
        int databaseSizeBeforeUpdate = cazeRepository.findAll().size();
        caze.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCazeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(caze)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Caze in the database
        List<Caze> cazeList = cazeRepository.findAll();
        assertThat(cazeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCazeWithPatch() throws Exception {
        // Initialize the database
        cazeRepository.saveAndFlush(caze);

        int databaseSizeBeforeUpdate = cazeRepository.findAll().size();

        // Update the caze using partial update
        Caze partialUpdatedCaze = new Caze();
        partialUpdatedCaze.setId(caze.getId());

        partialUpdatedCaze.question(UPDATED_QUESTION);

        restCazeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCaze.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCaze))
            )
            .andExpect(status().isOk());

        // Validate the Caze in the database
        List<Caze> cazeList = cazeRepository.findAll();
        assertThat(cazeList).hasSize(databaseSizeBeforeUpdate);
        Caze testCaze = cazeList.get(cazeList.size() - 1);
        assertThat(testCaze.getQuestion()).isEqualTo(UPDATED_QUESTION);
        assertThat(testCaze.getAbsice()).isEqualTo(DEFAULT_ABSICE);
        assertThat(testCaze.getOrdo()).isEqualTo(DEFAULT_ORDO);
        assertThat(testCaze.getPosition()).isEqualTo(DEFAULT_POSITION);
    }

    @Test
    @Transactional
    void fullUpdateCazeWithPatch() throws Exception {
        // Initialize the database
        cazeRepository.saveAndFlush(caze);

        int databaseSizeBeforeUpdate = cazeRepository.findAll().size();

        // Update the caze using partial update
        Caze partialUpdatedCaze = new Caze();
        partialUpdatedCaze.setId(caze.getId());

        partialUpdatedCaze.question(UPDATED_QUESTION).absice(UPDATED_ABSICE).ordo(UPDATED_ORDO).position(UPDATED_POSITION);

        restCazeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCaze.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCaze))
            )
            .andExpect(status().isOk());

        // Validate the Caze in the database
        List<Caze> cazeList = cazeRepository.findAll();
        assertThat(cazeList).hasSize(databaseSizeBeforeUpdate);
        Caze testCaze = cazeList.get(cazeList.size() - 1);
        assertThat(testCaze.getQuestion()).isEqualTo(UPDATED_QUESTION);
        assertThat(testCaze.getAbsice()).isEqualTo(UPDATED_ABSICE);
        assertThat(testCaze.getOrdo()).isEqualTo(UPDATED_ORDO);
        assertThat(testCaze.getPosition()).isEqualTo(UPDATED_POSITION);
    }

    @Test
    @Transactional
    void patchNonExistingCaze() throws Exception {
        int databaseSizeBeforeUpdate = cazeRepository.findAll().size();
        caze.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCazeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, caze.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(caze))
            )
            .andExpect(status().isBadRequest());

        // Validate the Caze in the database
        List<Caze> cazeList = cazeRepository.findAll();
        assertThat(cazeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCaze() throws Exception {
        int databaseSizeBeforeUpdate = cazeRepository.findAll().size();
        caze.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCazeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(caze))
            )
            .andExpect(status().isBadRequest());

        // Validate the Caze in the database
        List<Caze> cazeList = cazeRepository.findAll();
        assertThat(cazeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCaze() throws Exception {
        int databaseSizeBeforeUpdate = cazeRepository.findAll().size();
        caze.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCazeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(caze)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Caze in the database
        List<Caze> cazeList = cazeRepository.findAll();
        assertThat(cazeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCaze() throws Exception {
        // Initialize the database
        cazeRepository.saveAndFlush(caze);

        int databaseSizeBeforeDelete = cazeRepository.findAll().size();

        // Delete the caze
        restCazeMockMvc
            .perform(delete(ENTITY_API_URL_ID, caze.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Caze> cazeList = cazeRepository.findAll();
        assertThat(cazeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
