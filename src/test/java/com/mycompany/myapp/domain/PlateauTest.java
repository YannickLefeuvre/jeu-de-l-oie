package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PlateauTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Plateau.class);
        Plateau plateau1 = new Plateau();
        plateau1.setId(1L);
        Plateau plateau2 = new Plateau();
        plateau2.setId(plateau1.getId());
        assertThat(plateau1).isEqualTo(plateau2);
        plateau2.setId(2L);
        assertThat(plateau1).isNotEqualTo(plateau2);
        plateau1.setId(null);
        assertThat(plateau1).isNotEqualTo(plateau2);
    }
}
