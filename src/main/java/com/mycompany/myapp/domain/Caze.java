package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Caze.
 */
@Entity
@Table(name = "caze")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Caze implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "question")
    private String question;

    @Column(name = "absice")
    private Integer absice;

    @Column(name = "ordo")
    private Integer ordo;

    @Column(name = "position")
    private Integer position;

    @OneToMany(mappedBy = "caze")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "reponses", "user", "caze", "plateau" }, allowSetters = true)
    private Set<Joueur> users = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "questions", "users" }, allowSetters = true)
    private Plateau plateau;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Caze id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestion() {
        return this.question;
    }

    public Caze question(String question) {
        this.setQuestion(question);
        return this;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public Integer getAbsice() {
        return this.absice;
    }

    public Caze absice(Integer absice) {
        this.setAbsice(absice);
        return this;
    }

    public void setAbsice(Integer absice) {
        this.absice = absice;
    }

    public Integer getOrdo() {
        return this.ordo;
    }

    public Caze ordo(Integer ordo) {
        this.setOrdo(ordo);
        return this;
    }

    public void setOrdo(Integer ordo) {
        this.ordo = ordo;
    }

    public Integer getPosition() {
        return this.position;
    }

    public Caze position(Integer position) {
        this.setPosition(position);
        return this;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public Set<Joueur> getUsers() {
        return this.users;
    }

    public void setUsers(Set<Joueur> joueurs) {
        if (this.users != null) {
            this.users.forEach(i -> i.setCaze(null));
        }
        if (joueurs != null) {
            joueurs.forEach(i -> i.setCaze(this));
        }
        this.users = joueurs;
    }

    public Caze users(Set<Joueur> joueurs) {
        this.setUsers(joueurs);
        return this;
    }

    public Caze addUsers(Joueur joueur) {
        this.users.add(joueur);
        joueur.setCaze(this);
        return this;
    }

    public Caze removeUsers(Joueur joueur) {
        this.users.remove(joueur);
        joueur.setCaze(null);
        return this;
    }

    public Plateau getPlateau() {
        return this.plateau;
    }

    public void setPlateau(Plateau plateau) {
        this.plateau = plateau;
    }

    public Caze plateau(Plateau plateau) {
        this.setPlateau(plateau);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Caze)) {
            return false;
        }
        return id != null && id.equals(((Caze) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Caze{" +
            "id=" + getId() +
            ", question='" + getQuestion() + "'" +
            ", absice=" + getAbsice() +
            ", ordo=" + getOrdo() +
            ", position=" + getPosition() +
            "}";
    }
}
