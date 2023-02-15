package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.Couleur;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Joueur.
 */
@Entity
@Table(name = "joueur")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Joueur implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "positions")
    private Integer positions;

    @Enumerated(EnumType.STRING)
    @Column(name = "couleur")
    private Couleur couleur;

    @OneToMany(mappedBy = "user")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    private Set<Reponse> reponses = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "internalUser", "joueurs" }, allowSetters = true)
    private ApplicationUser user;

    @ManyToOne
    @JsonIgnoreProperties(value = { "users", "plateau" }, allowSetters = true)
    private Caze caze;

    @ManyToOne
    @JsonIgnoreProperties(value = { "questions", "users" }, allowSetters = true)
    private Plateau plateau;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Joueur id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Joueur nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Integer getPositions() {
        return this.positions;
    }

    public Joueur positions(Integer positions) {
        this.setPositions(positions);
        return this;
    }

    public void setPositions(Integer positions) {
        this.positions = positions;
    }

    public Couleur getCouleur() {
        return this.couleur;
    }

    public Joueur couleur(Couleur couleur) {
        this.setCouleur(couleur);
        return this;
    }

    public void setCouleur(Couleur couleur) {
        this.couleur = couleur;
    }

    public Set<Reponse> getReponses() {
        return this.reponses;
    }

    public void setReponses(Set<Reponse> reponses) {
        if (this.reponses != null) {
            this.reponses.forEach(i -> i.setUser(null));
        }
        if (reponses != null) {
            reponses.forEach(i -> i.setUser(this));
        }
        this.reponses = reponses;
    }

    public Joueur reponses(Set<Reponse> reponses) {
        this.setReponses(reponses);
        return this;
    }

    public Joueur addReponses(Reponse reponse) {
        this.reponses.add(reponse);
        reponse.setUser(this);
        return this;
    }

    public Joueur removeReponses(Reponse reponse) {
        this.reponses.remove(reponse);
        reponse.setUser(null);
        return this;
    }

    public ApplicationUser getUser() {
        return this.user;
    }

    public void setUser(ApplicationUser applicationUser) {
        this.user = applicationUser;
    }

    public Joueur user(ApplicationUser applicationUser) {
        this.setUser(applicationUser);
        return this;
    }

    public Caze getCaze() {
        return this.caze;
    }

    public void setCaze(Caze caze) {
        this.caze = caze;
    }

    public Joueur caze(Caze caze) {
        this.setCaze(caze);
        return this;
    }

    public Plateau getPlateau() {
        return this.plateau;
    }

    public void setPlateau(Plateau plateau) {
        this.plateau = plateau;
    }

    public Joueur plateau(Plateau plateau) {
        this.setPlateau(plateau);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Joueur)) {
            return false;
        }
        return id != null && id.equals(((Joueur) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Joueur{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", positions=" + getPositions() +
            ", couleur='" + getCouleur() + "'" +
            "}";
    }
}
