package app.log;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name="log")
public class Log {

    public Log(){

    }

    public Log(long id, float weight, Date date, String note) {
        super();
        this.id = id;
        this.weight = weight;
        this.date = date;
        this.note = note;
    }

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="\"id\"",unique=true,nullable=false)
    private long id;

    @Column(name="\"weight\"")
    private float weight;

    @Column(name="\"note\"")
    private String note;

//    @JsonFormat(pattern="dd-MM-yyyy HH:mm:ss")
    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss")
    @Column(name="\"date\"")
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
