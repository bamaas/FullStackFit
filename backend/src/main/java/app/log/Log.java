package app.log;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name="log")
public class Log {

    public Log(){

    }

    public Log(long id, int weight, Date date, String note) {
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
    private int weight;

    @Column(name="\"note\"")
    private String note;

    @JsonFormat(pattern="dd-MM-yyyy")
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

    public int getWeight() {
        return this.weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}
