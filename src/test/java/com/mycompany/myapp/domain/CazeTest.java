package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CazeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Caze.class);
        Caze caze1 = new Caze();
        caze1.setId(1L);
        Caze caze2 = new Caze();
        caze2.setId(caze1.getId());
        assertThat(caze1).isEqualTo(caze2);
        caze2.setId(2L);
        assertThat(caze1).isNotEqualTo(caze2);
        caze1.setId(null);
        assertThat(caze1).isNotEqualTo(caze2);
    }
}
