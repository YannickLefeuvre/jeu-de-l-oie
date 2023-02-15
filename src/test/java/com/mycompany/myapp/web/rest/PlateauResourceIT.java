package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Plateau;
import com.mycompany.myapp.repository.PlateauRepository;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link PlateauResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PlateauResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    private static final Integer DEFAULT_NB_QUESTIONS = 1;
    private static final Integer UPDATED_NB_QUESTIONS = 2;

    private static final Boolean DEFAULT_PRINCIPAL = false;
    private static final Boolean UPDATED_PRINCIPAL = true;

    private static final String ENTITY_API_URL = "/api/plateaus";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PlateauRepository plateauRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPlateauMockMvc;

    private Plateau plateau;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Plateau createEntity(EntityManager em) {
        Plateau plateau = new Plateau()
            .nom(DEFAULT_NOM)
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE)
            .nbQuestions(DEFAULT_NB_QUESTIONS)
            .principal(DEFAULT_PRINCIPAL);
        return plateau;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Plateau createUpdatedEntity(EntityManager em) {
        Plateau plateau = new Plateau()
            .nom(UPDATED_NOM)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .nbQuestions(UPDATED_NB_QUESTIONS)
            .principal(UPDATED_PRINCIPAL);
        return plateau;
    }

    @BeforeEach
    public void initTest() {
        plateau = createEntity(em);
    }

    @Test
    @Transactional
    void createPlateau() throws Exception {
        int databaseSizeBeforeCreate = plateauRepository.findAll().size();
        // Create the Plateau
        restPlateauMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(plateau)))
            .andExpect(status().isCreated());

        // Validate the Plateau in the database
        List<Plateau> plateauList = plateauRepository.findAll();
        assertThat(plateauList).hasSize(databaseSizeBeforeCreate + 1);
        Plateau testPlateau = plateauList.get(plateauList.size() - 1);
        assertThat(testPlateau.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testPlateau.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testPlateau.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
        assertThat(testPlateau.getNbQuestions()).isEqualTo(DEFAULT_NB_QUESTIONS);
        assertThat(testPlateau.getPrincipal()).isEqualTo(DEFAULT_PRINCIPAL);
    }

    @Test
    @Transactional
    void createPlateauWithExistingId() throws Exception {
        // Create the Plateau with an existing ID
        plateau.setId(1L);

        int databaseSizeBeforeCreate = plateauRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlateauMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(plateau)))
            .andExpect(status().isBadRequest());

        // Validate the Plateau in the database
        List<Plateau> plateauList = plateauRepository.findAll();
        assertThat(plateauList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPlateaus() throws Exception {
        // Initialize the database
        plateauRepository.saveAndFlush(plateau);

        // Get all the plateauList
        restPlateauMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(plateau.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))))
            .andExpect(jsonPath("$.[*].nbQuestions").value(hasItem(DEFAULT_NB_QUESTIONS)))
            .andExpect(jsonPath("$.[*].principal").value(hasItem(DEFAULT_PRINCIPAL.booleanValue())));
    }

    @Test
    @Transactional
    void getPlateau() throws Exception {
        // Initialize the database
        plateauRepository.saveAndFlush(plateau);

        // Get the plateau
        restPlateauMockMvc
            .perform(get(ENTITY_API_URL_ID, plateau.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(plateau.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)))
            .andExpect(jsonPath("$.nbQuestions").value(DEFAULT_NB_QUESTIONS))
            .andExpect(jsonPath("$.principal").value(DEFAULT_PRINCIPAL.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingPlateau() throws Exception {
        // Get the plateau
        restPlateauMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPlateau() throws Exception {
        // Initialize the database
        plateauRepository.saveAndFlush(plateau);

        int databaseSizeBeforeUpdate = plateauRepository.findAll().size();

        // Update the plateau
        Plateau updatedPlateau = plateauRepository.findById(plateau.getId()).get();
        // Disconnect from session so that the updates on updatedPlateau are not directly saved in db
        em.detach(updatedPlateau);
        updatedPlateau
            .nom(UPDATED_NOM)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .nbQuestions(UPDATED_NB_QUESTIONS)
            .principal(UPDATED_PRINCIPAL);

        restPlateauMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPlateau.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPlateau))
            )
            .andExpect(status().isOk());

        // Validate the Plateau in the database
        List<Plateau> plateauList = plateauRepository.findAll();
        assertThat(plateauList).hasSize(databaseSizeBeforeUpdate);
        Plateau testPlateau = plateauList.get(plateauList.size() - 1);
        assertThat(testPlateau.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testPlateau.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testPlateau.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testPlateau.getNbQuestions()).isEqualTo(UPDATED_NB_QUESTIONS);
        assertThat(testPlateau.getPrincipal()).isEqualTo(UPDATED_PRINCIPAL);
    }

    @Test
    @Transactional
    void putNonExistingPlateau() throws Exception {
        int databaseSizeBeforeUpdate = plateauRepository.findAll().size();
        plateau.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlateauMockMvc
            .perform(
                put(ENTITY_API_URL_ID, plateau.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(plateau))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plateau in the database
        List<Plateau> plateauList = plateauRepository.findAll();
        assertThat(plateauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPlateau() throws Exception {
        int databaseSizeBeforeUpdate = plateauRepository.findAll().size();
        plateau.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlateauMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(plateau))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plateau in the database
        List<Plateau> plateauList = plateauRepository.findAll();
        assertThat(plateauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPlateau() throws Exception {
        int databaseSizeBeforeUpdate = plateauRepository.findAll().size();
        plateau.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlateauMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(plateau)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Plateau in the database
        List<Plateau> plateauList = plateauRepository.findAll();
        assertThat(plateauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePlateauWithPatch() throws Exception {
        // Initialize the database
        plateauRepository.saveAndFlush(plateau);

        int databaseSizeBeforeUpdate = plateauRepository.findAll().size();

        // Update the plateau using partial update
        Plateau partialUpdatedPlateau = new Plateau();
        partialUpdatedPlateau.setId(plateau.getId());

        partialUpdatedPlateau.nom(UPDATED_NOM).principal(UPDATED_PRINCIPAL);

        restPlateauMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlateau.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPlateau))
            )
            .andExpect(status().isOk());

        // Validate the Plateau in the database
        List<Plateau> plateauList = plateauRepository.findAll();
        assertThat(plateauList).hasSize(databaseSizeBeforeUpdate);
        Plateau testPlateau = plateauList.get(plateauList.size() - 1);
        assertThat(testPlateau.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testPlateau.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testPlateau.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
        assertThat(testPlateau.getNbQuestions()).isEqualTo(DEFAULT_NB_QUESTIONS);
        assertThat(testPlateau.getPrincipal()).isEqualTo(UPDATED_PRINCIPAL);
    }

    @Test
    @Transactional
    void fullUpdatePlateauWithPatch() throws Exception {
        // Initialize the database
        plateauRepository.saveAndFlush(plateau);

        int databaseSizeBeforeUpdate = plateauRepository.findAll().size();

        // Update the plateau using partial update
        Plateau partialUpdatedPlateau = new Plateau();
        partialUpdatedPlateau.setId(plateau.getId());

        partialUpdatedPlateau
            .nom(UPDATED_NOM)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .nbQuestions(UPDATED_NB_QUESTIONS)
            .principal(UPDATED_PRINCIPAL);

        restPlateauMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlateau.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPlateau))
            )
            .andExpect(status().isOk());

        // Validate the Plateau in the database
        List<Plateau> plateauList = plateauRepository.findAll();
        assertThat(plateauList).hasSize(databaseSizeBeforeUpdate);
        Plateau testPlateau = plateauList.get(plateauList.size() - 1);
        assertThat(testPlateau.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testPlateau.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testPlateau.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testPlateau.getNbQuestions()).isEqualTo(UPDATED_NB_QUESTIONS);
        assertThat(testPlateau.getPrincipal()).isEqualTo(UPDATED_PRINCIPAL);
    }

    @Test
    @Transactional
    void patchNonExistingPlateau() throws Exception {
        int databaseSizeBeforeUpdate = plateauRepository.findAll().size();
        plateau.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlateauMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, plateau.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(plateau))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plateau in the database
        List<Plateau> plateauList = plateauRepository.findAll();
        assertThat(plateauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPlateau() throws Exception {
        int databaseSizeBeforeUpdate = plateauRepository.findAll().size();
        plateau.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlateauMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(plateau))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plateau in the database
        List<Plateau> plateauList = plateauRepository.findAll();
        assertThat(plateauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPlateau() throws Exception {
        int databaseSizeBeforeUpdate = plateauRepository.findAll().size();
        plateau.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlateauMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(plateau)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Plateau in the database
        List<Plateau> plateauList = plateauRepository.findAll();
        assertThat(plateauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePlateau() throws Exception {
        // Initialize the database
        plateauRepository.saveAndFlush(plateau);

        int databaseSizeBeforeDelete = plateauRepository.findAll().size();

        // Delete the plateau
        restPlateauMockMvc
            .perform(delete(ENTITY_API_URL_ID, plateau.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Plateau> plateauList = plateauRepository.findAll();
        assertThat(plateauList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
