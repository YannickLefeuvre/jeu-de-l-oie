package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Plateau.
 */
@Entity
@Table(name = "plateau")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Plateau implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @Column(name = "nb_questions")
    private Integer nbQuestions;

    @Column(name = "principal")
    private Boolean principal;

    @OneToMany(mappedBy = "plateau")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "users", "plateau" }, allowSetters = true)
    private Set<Caze> questions = new HashSet<>();

    @OneToMany(mappedBy = "plateau")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "reponses", "user", "caze", "plateau" }, allowSetters = true)
    private Set<Joueur> users = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Plateau id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Plateau nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public byte[] getImage() {
        return this.image;
    }

    public Plateau image(byte[] image) {
        this.setImage(image);
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return this.imageContentType;
    }

    public Plateau imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public Integer getNbQuestions() {
        return this.nbQuestions;
    }

    public Plateau nbQuestions(Integer nbQuestions) {
        this.setNbQuestions(nbQuestions);
        return this;
    }

    public void setNbQuestions(Integer nbQuestions) {
        this.nbQuestions = nbQuestions;
    }

    public Boolean getPrincipal() {
        return this.principal;
    }

    public Plateau principal(Boolean principal) {
        this.setPrincipal(principal);
        return this;
    }

    public void setPrincipal(Boolean principal) {
        this.principal = principal;
    }

    public Set<Caze> getQuestions() {
        return this.questions;
    }

    public void setQuestions(Set<Caze> cazes) {
        if (this.questions != null) {
            this.questions.forEach(i -> i.setPlateau(null));
        }
        if (cazes != null) {
            cazes.forEach(i -> i.setPlateau(this));
        }
        this.questions = cazes;
    }

    public Plateau questions(Set<Caze> cazes) {
        this.setQuestions(cazes);
        return this;
    }

    public Plateau addQuestions(Caze caze) {
        this.questions.add(caze);
        caze.setPlateau(this);
        return this;
    }

    public Plateau removeQuestions(Caze caze) {
        this.questions.remove(caze);
        caze.setPlateau(null);
        return this;
    }

    public Set<Joueur> getUsers() {
        return this.users;
    }

    public void setUsers(Set<Joueur> joueurs) {
        if (this.users != null) {
            this.users.forEach(i -> i.setPlateau(null));
        }
        if (joueurs != null) {
            joueurs.forEach(i -> i.setPlateau(this));
        }
        this.users = joueurs;
    }

    public Plateau users(Set<Joueur> joueurs) {
        this.setUsers(joueurs);
        return this;
    }

    public Plateau addUsers(Joueur joueur) {
        this.users.add(joueur);
        joueur.setPlateau(this);
        return this;
    }

    public Plateau removeUsers(Joueur joueur) {
        this.users.remove(joueur);
        joueur.setPlateau(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Plateau)) {
            return false;
        }
        return id != null && id.equals(((Plateau) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Plateau{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            ", nbQuestions=" + getNbQuestions() +
            ", principal='" + getPrincipal() + "'" +
            "}";
    }
}
