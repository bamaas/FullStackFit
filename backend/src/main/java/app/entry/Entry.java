package app.entry;

import com.fasterxml.jackson.annotation.JsonFormat;
import javax.persistence.*;
import java.util.Date;

@Entity(name="entry")
@Table(name="entry")
public class Entry {

    public Entry(){

    }

    public Entry(long id, float weight, Date date, String note) {
        super();
        this.id = id;
        this.weight = weight;
        this.date = date;
        this.note = note;
    }

    @Override
    public String toString(){
        return "id: " + getId()+
                " | Weight: " + getWeight() +
                " | Date: " + getDate()  +
                " | Note: " + getNote();
    }

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="\"id\"",unique=true,nullable=false)
    private long id;

    @Column(name="\"weight\"", nullable = false)
    private float weight;

    @Column(name="\"note\"")
    private String note;

    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss")
    @Column(name="\"date\"", unique = true, nullable = false)
    private Date date;

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public float getWeight() {
        return this.weight;
    }

    public void setWeight(float weight) {
        this.weight = weight;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}
